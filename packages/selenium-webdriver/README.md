# @jest-environment-browserstack/selenium-webdriver

This plugin wraps the NPM module [`selenium-webdriver`](https://www.npmjs.com/package/selenium-webdriver).

It gives access to this NPM module through the Browserstack environment.

## Usage

```bash
npm install --save-dev jest-environment-browserstack @jest-environment-browserstack/selenium-webdriver
```

Once you have installed both modules, assuming that you Jest configuration is in your `package.json`, add the following:

```json
{
  "jest": {
    "globals": {
      "browserstack": {
        "driver": "@jest-environment-browserstack/selenium-webdriver",
        "capabilities": {
          "browserName": "chrome",
          "browserVersion": "76.0",
          "bstack:options": {
            "os": "Windows",
            "osVersion": "10",
            "buildName": "with-bt-local",
            "local": true
          }
        },
        "localTesting": {
          "verbose": true,
          "local": true,
          "forceLocal": true
        }
      }
    }
  }
}
```
