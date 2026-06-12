# pppt-cypress

Cypress end-to-end and API test automation project using Cucumber feature files and TypeScript.

## Prerequisites

1. Visual Studio Code: https://code.visualstudio.com/download
2. Google Chrome: https://www.google.com/chrome
3. Node.js managed with nvm (project uses Node `v24`, see `.nvmrc`)
4. Yarn Classic (`1.x`)

## Setup

1. Clone this repository.
2. Open the project in VS Code.
3. In a terminal at the project root, run:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install
nvm use
```

4. Install dependencies:

```bash
yarn install
```

5. (Optional) Validate TypeScript compilation:

```bash
yarn typecheck
```

## Run Tests

Use these scripts from `package.json`:

1. Open Cypress Test Runner:

```bash
yarn cypress:open
```

2. Run all feature tests in headless Chrome and generate HTML report:

```bash
yarn cypress:run
```

3. Run all feature files in parallel (feature-level only, not scenario-level) and generate HTML report:

```bash
yarn cypress:run:parallel:features
```

Optional: set worker concurrency in `.env` with `FEATURE_PARALLEL_WORKERS`.

```bash
FEATURE_PARALLEL_WORKERS=3
```

If this value is not set, default worker count is `3`.

## Other Scripts

1. Lint Gherkin feature files:

```bash
yarn lint:gherkin
```

2. Run lint-staged file linting:

```bash
yarn lint:files
```

3. Generate report from JSON output using TypeScript runner:

```bash
yarn report
```

## Reports

1. JSON report output: `report/JSON/cucumber_report.json`
2. HTML report output: `report/HTML/cucumber_report.html`

## Notes

1. Environment values are loaded from `.env.template` and `.env` (if present).
2. Tests are filtered with `TAGS=not @ignore` in the Cypress run/open scripts.
3. Step definitions, page objects, support files, and Cypress config are in TypeScript (`.ts`).
