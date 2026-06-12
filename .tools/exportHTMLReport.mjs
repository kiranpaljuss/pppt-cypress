import reporter from 'cucumber-html-reporter';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const cucumberJsonDir = 'report/JSON/';
const screenshotsDir = './cypress/screenshots';
const cucumberReportFileMap = {};
const cucumberReportMap = {};
const jsonIndentLevel = 2;

getCucumberReportMaps();
addScreenshots();
generateReport();

function getCucumberReportMaps () {
  try {
    const reportFiles = fs.readdirSync(cucumberJsonDir).filter(file => file.endsWith('.json'));

    reportFiles.forEach(file => {
      const reportPath = path.join(cucumberJsonDir, file);
      const json = JSON.parse(fs.readFileSync(reportPath));

      if (!Array.isArray(json)) {
        console.error(`❌ ERROR: '${file}' is not a valid Cucumber JSON report. Skipping.`);
        return;
      }

      json.forEach(feature => {
        if (!feature?.name) {
          console.warn(`⚠ WARNING: Skipping feature in '${file}' with missing name.`);
          return;
        }
        cucumberReportMap[feature.name.trim()] = feature;
        cucumberReportFileMap[feature.name.trim()] = file;
      });
    });

  } catch (error) {
    console.error('❌ ERROR: Failed to load Cucumber report files:', error);
  }
}

function addScreenshots () {
  const getAllFilesRecursively = (dir) =>
    fs.readdirSync(dir).flatMap(file => {
      const fullPath = path.join(dir, file);
      return fs.statSync(fullPath).isDirectory() ? getAllFilesRecursively(fullPath) : fullPath;
    });

  const screenshots = getAllFilesRecursively(path.resolve(screenshotsDir)).filter(file => file.endsWith('.png'));

  const extractedFeatures = screenshots.map(screenshot => {
    // const relativePath = path.relative(screenshotsDir, screenshot);
    const fileName = path.basename(screenshot).replace('(failed)', '').replace('.png', '').trim();
    const match = fileName.split(' -- ');

    return match.length === 2 ? { feature: match[0].trim(), scenario: match[1].trim(), fullPath: screenshot } : null;
  }).filter(Boolean);

  extractedFeatures.forEach(({ feature, scenario, fullPath }) => {
    const matchedFeature = Object.keys(cucumberReportMap).find(f => f.toLowerCase() === feature.toLowerCase());

    if (!matchedFeature) {
      console.warn(`⚠ WARNING: Feature '${feature}' not found in JSON report.`);
      return;
    }

    const featureData = cucumberReportMap[matchedFeature];
    const scenarios = featureData.elements?.filter(e => e.name.trim().toLowerCase() === scenario.toLowerCase());

    if (!scenarios?.length) {
      console.warn(`⚠ WARNING: No matching scenario found for '${scenario}' in feature '${feature}'.`);
      return;
    }

    let foundFailedStep = false;
    scenarios.forEach(scenario => {
      if (foundFailedStep) {
        return;
      }

      const stepToAttach = scenario.steps.find(step =>
        fullPath.includes('(failed)') ? step.result.status === 'failed' : step.name.includes('screenshot')
      );

      if (!stepToAttach) {
        return;
      }

      try {
        if (!fs.existsSync(fullPath)) {
          console.error(`❌ ERROR: Screenshot file not found -> ${fullPath}`);
          return;
        }

        const base64Image = fs.readFileSync(fullPath).toString('base64');
        stepToAttach.embeddings = stepToAttach.embeddings || [];
        stepToAttach.embeddings.push({ data: base64Image, mime_type: 'image/png' });
        foundFailedStep = true;

        console.info(chalk.blue('\n    Adding screenshot(s) to HTML report for'));
        console.info(chalk.blue(`    '${matchedFeature} - ${scenario.name}'`));

      } catch (error) {
        console.error(`❌ ERROR reading screenshot file '${fullPath}':`, error);
      }
    });

    const reportFilePath = path.join(cucumberJsonDir, cucumberReportFileMap[matchedFeature]);

    let existingData = [];
    if (fs.existsSync(reportFilePath)) {
      try {
        existingData = JSON.parse(fs.readFileSync(reportFilePath, 'utf8'));
        if (!Array.isArray(existingData)) {
          existingData = [];
        }
      } catch {
        existingData = [];
      }
    }

    const featureArray = Array.isArray(featureData) ? featureData : [featureData];
    const mergedData = [...existingData.filter(f => f.name !== matchedFeature), ...featureArray];

    try {
      fs.writeFileSync(reportFilePath, JSON.stringify(mergedData, null, jsonIndentLevel));
    } catch (error) {
      console.error(`❌ ERROR: Failed to write valid JSON for '${matchedFeature}'.`, error);
    }
  });
}

function generateReport () {
  if (!fs.existsSync(cucumberJsonDir)) {
    console.warn(`⚠ WARNING: Folder '${cucumberJsonDir}' not found. REPORT CANNOT BE CREATED!`);
    return;
  }

  const jsonFiles = fs.readdirSync(cucumberJsonDir)
    .filter(file => file.endsWith('.json'))
    .map(file => `${cucumberJsonDir}/${file}`)
    .filter(file => {
      const content = fs.readFileSync(file, 'utf8').trim();
      return content.length > 2;
    });

  if (jsonFiles.length === 0) {
    console.info(chalk.yellow(`No valid Cucumber JSON files found in '${cucumberJsonDir}'. REPORT CANNOT BE CREATED!`));
    return;
  }

  reporter.generate({
    brandTitle: 'Report',
    columnLayout: 1,
    jsonDir: cucumberJsonDir,
    launchReport: false,
    output: 'report/HTML/cucumber_report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    theme: 'bootstrap',
  });
}