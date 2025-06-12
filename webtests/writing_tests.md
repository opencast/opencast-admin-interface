# Frontend End-to-End Testing with Playwright

## Overview

Playwright is a testing framework that allows automated testing of web applications across multiple browsers (Chromium, Firefox, WebKit).

## Setup Browsers

There are multiple browsers setup in `../playwright.config.ts`:

General browsers:

- Desktop Chromium
- Desktop Firefox
- Desktop Safari

Branded Browsers:

- Microsoft Edge
- Google Chrome

## Basic Structure

1. Import Playwright test modules
2. Define test scenarios with `test()` function
3. Use page interactions (click, fill, etc.)
4. Assert expected outcomes

## Developing tests

### Installation

Besides the dependencies in the ```package.json``` file which need to be install to run the webserver at all, playwright has browser dependencies as well. To install the extra broser dependencies, run: ```npx playwright install --with-deps```

### Run tests locally

To execute the tests locally, there are multiple options:

**Running the tests headless:**
Execute `npm run test:e2e:headless` or `npx playwright test` in the terminal.

**Running the tests in the UI:**
Execute `npm run test:e2e` or `npx playwright test --ui` in the terminal.

In both cases you can add `--trace on` to get a trace view of the tests.

### Developing

Please have a look at the official playwright documentation on how to develop new tests. 

## References

- [Playwright Documentation](https://playwright.dev/docs/intro)
