import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const projectRoot = process.cwd();
const featureRoot = path.join(projectRoot, 'cypress', 'integration', 'features');
const templateEnvValues = readEnvFile('.env.template');
const dotEnvValues = readEnvFile('.env');
const mergedEnvValues = {
  ...templateEnvValues,
  ...dotEnvValues,
};
const defaultWorkers = 3;
const workers = resolveWorkerCount();
const browser = process.env.CYPRESS_BROWSER ?? 'chrome';
const tags = process.env.CYPRESS_TAGS ?? 'not @ignore';

const featureFiles = listFeatureFiles(featureRoot);

if (featureFiles.length === 0) {
  console.error('No feature files found under cypress/integration/features.');
  process.exit(1);
}

console.info(`Found ${featureFiles.length} feature file(s). Running with ${workers} worker(s).`);

const queue = [...featureFiles];
const failures: Array<{ feature: string; code: number | null }> = [];

void main();

async function main () {
  await Promise.all(Array.from({ length: workers }, (_, workerIndex) => runWorker(workerIndex + 1)));

  if (failures.length > 0) {
    console.error('\nFeature-level parallel run completed with failures:');
    failures.forEach(({ feature, code }) => {
      console.error(`- ${path.relative(projectRoot, feature)} (exit code: ${code ?? 'unknown'})`);
    });
    process.exit(1);
  }

  console.info('\nFeature-level parallel run completed successfully.');
}

function resolveWorkerCount () {
  const raw = process.env.FEATURE_PARALLEL_WORKERS
    ?? process.env.PARALLEL_WORKERS
    ?? mergedEnvValues.FEATURE_PARALLEL_WORKERS
    ?? mergedEnvValues.PARALLEL_WORKERS;

  if (!raw) {
    return defaultWorkers;
  }

  const parsed = Number.parseInt(raw, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    console.warn(`Invalid worker count '${raw}'. Falling back to 1.`);
    return 1;
  }

  return parsed;
}

function readEnvFile (fileName: string) {
  const envPath = path.resolve(projectRoot, fileName);

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .reduce<Record<string, string>>((acc, line) => {
      const firstEquals = line.indexOf('=');
      const key = line.slice(0, firstEquals).trim();
      const value = line.slice(firstEquals + 1).trim();

      if (key) {
        acc[key] = value;
      }

      return acc;
    }, {});
}

function listFeatureFiles (directory: string): string[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return listFeatureFiles(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith('.feature')) {
      return [fullPath];
    }

    return [];
  });

  return files.sort((a, b) => a.localeCompare(b));
}

async function runWorker (workerNumber: number) {
  while (queue.length > 0) {
    const feature = queue.shift();

    if (!feature) {
      return;
    }

    const jsonOutput = buildJsonOutputPath(feature);

    console.info(`\n[worker ${workerNumber}] START ${path.relative(projectRoot, feature)}`);
    const exitCode = await runFeature(feature, jsonOutput);

    if (exitCode !== 0) {
      failures.push({ feature, code: exitCode });
      console.error(`[worker ${workerNumber}] FAIL  ${path.relative(projectRoot, feature)} (exit code: ${exitCode ?? 'unknown'})`);
    } else {
      console.info(`[worker ${workerNumber}] PASS  ${path.relative(projectRoot, feature)}`);
    }
  }
}

function buildJsonOutputPath (featurePath: string) {
  const relative = path.relative(featureRoot, featurePath);
  const safeName = relative
    .replace(/\.feature$/i, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_');

  return `report/JSON/cucumber_report_${safeName}.json`;
}

function runFeature (featurePath: string, jsonOutput: string): Promise<number | null> {
  const envParts = [
    `TAGS=${tags}`,
    'jsonEnabled=true',
    `jsonOutput=${jsonOutput}`,
  ];

  const args = [
    'cypress',
    'run',
    '--browser',
    browser,
    '--spec',
    featurePath,
    '--env',
    envParts.join(','),
  ];

  return new Promise((resolve) => {
    const child = spawn('yarn', args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: false,
    });

    child.on('close', (code) => {
      resolve(code);
    });
  });
}