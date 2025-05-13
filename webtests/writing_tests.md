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

For developing new tests you can have a look at the references below. To execute the tests locally, there are multiple options:

**Running the tests headless:**
Execute `npm run test:e2e:headless` or `npx playwright test` in the terminal.

**Running the tests in the UI:**
Execute `npm run test:e2e` or `npx playwright test --ui` in the terminal.

In both cases you can add `--trace on` to get a trace view of the tests.

## References

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Getting Started Guide](https://playwright.dev/docs/getting-started-intro)
- [Test API Reference](https://playwright.dev/docs/api/class-test)
- [Assertions Documentation](https://playwright.dev/docs/assertions)
