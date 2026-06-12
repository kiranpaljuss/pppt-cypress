# pppt-cypress

Cypress end-to-end and API test automation project using Cucumber feature files.

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

## Other Scripts

1. Lint Gherkin feature files:

```bash
yarn lint:gherkin
```

2. Run lint-staged file linting:

```bash
yarn lint:files
```

## Reports

1. JSON report output: `report/JSON/cucumber_report.json`
2. HTML report output: `report/HTML/cucumber_report.html`

## Notes

1. Environment values are loaded from `.env.template` and `.env` (if present).
2. Tests are filtered with `TAGS=not @ignore` in the Cypress run/open scripts.
