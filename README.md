# jest-environment-browserstack

[![Actions Status](https://github.com/taktakpeops/jest-environment-browserstack/workflows/Node%20CI/badge.svg)](https://github.com/taktakpeops/jest-environment-browserstack/actions) [![npm version](http://img.shields.io/npm/v/jest-environment-browserstack.svg?style=flat)](https://npmjs.org/package/jest-environment-browserstack 'View this project on npm') [![Codacy Badge](https://api.codacy.com/project/badge/Grade/7b1839cead7743a69be711dd6c1c022c)](https://www.codacy.com/manual/taktakpeops/jest-environment-browserstack?utm_source=github.com&utm_medium=referral&utm_content=taktakpeops/jest-environment-browserstack&utm_campaign=Badge_Grade) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Use Jest as test-runner for running your visual-tests and more using Browserstack.

## What is it

This mono-repository has currently 3 packages:

- [core](https://github.com/taktakpeops/jest-environment-browserstack/tree/master/packages/core): the Jest environment taking care of making Browserstack available in your specs files
- [plugins](https://github.com/taktakpeops/jest-environment-browserstack/tree/master/packages/plugins): contains types and abstract classes for creating a new plugin
- [selenium-webdriver](https://github.com/taktakpeops/jest-environment-browserstack/tree/master/packages/selenium-webdriver): plugin wrapping [`selenium-webdriver`](https://www.npmjs.com/package/selenium-webdriver)

### Why a plugin system

With the Webdriver API becoming a W3C standard, more and more implementation of clients for interacting with the API are appearing. Instead of imposing an implementation over an other, the plugin system allows users to use their favorite client easily.

## Usage

For using this environment, run first the following command in your terminal:

```bash
npm install --save-dev jest-environment-browserstack @jest-environment-browserstack/selenium-webdriver
```

Once it's done, configure your Jest config.

### Browserstack

Assuming your configuration is defined in your `package.json`, add the following lines to your `globals` definition:

```json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "browserstack",
    "globals": {
      "browserstack": {
        "driver": "@jest-environment-browserstack/selenium-webdriver",
        "capabilities": {
          "browserName": "chrome",
          "browserVersion": "76.0",
          "bstack:options": {
            "os": "Windows",
            "osVersion": "10",
            "userName": "myUsername",
            "accessKey": "myAccessKey",
            "buildName": "myBuild",
            "sessionName": "mySessionName"
          }
        }
      }
    }
  }
}
```

### Browserstack Local

Assuming here also your configuration is defined in your `package.json`, add the following lines to your `globals` definition:

```json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "browserstack",
    "globals": {
      "browserstack": {
        "driver": "@jest-environment-browserstack/selenium-webdriver",
        "capabilities": {
          "browserName": "chrome",
          "browserVersion": "76.0",
          "bstack:options": {
            "os": "Windows",
            "osVersion": "10",
            "userName": "myUsername",
            "accessKey": "myAccessKey",
            "buildName": "myBuild",
            "sessionName": "mySessionName"
          }
        },
        "localTesting": {
          "verbose": true
        }
      }
    }
  }
}
```

### Loading the environment using annotation

If you are running all your tests with JSDom as main environment, you can load the Browserstack environment for a specific file by adding a Jest annotation at the beginning of your file.

Here is an example:

my-visual-test.spec.js:

```javascript
/**
 * @jest-environment browserstack
 */
import { By } from 'selenium-webdriver';

describe('my visual test', () => {
  let driver;

  beforeAll(async () => {
    // you can override the default configuration
    driver = await global.__driver__({
      'bstack:options': {
        sessionName: 'my test',
      },
    });
    driver.get('https://mysuperurl.ltd');
  }, 20000); // this timeout is required because starting a session in Browserstack can take ages

  afterAll(async () => {
    // can be omitted
    await driver.quit();
  });

  it('test something', async () => {
    const myElement = await driver.findElement(By.css('.super.class'));
    const text = await myElement.getText();
    expect(text).toBe('super text');
  });
});
```

### Credentials

If you aren't willing to put your credentials in your `package.json` file, you can export in your environment `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`. If you do so, `userName` and `accessKey` can be omitted.

## Examples

Two examples are available:

- [basic usage](https://github.com/taktakpeops/jest-environment-browserstack/tree/master/examples/basic-usage): a test loading the GitHub page of this repository and making some assertions
- [with Browserstack local](https://github.com/taktakpeops/jest-environment-browserstack/tree/master/examples/with-bs-local): an example made with create-react-app including visual test and ui-test

## Known limitations

The screenshot API from Browserstack is not implemented yet.
The npm package `selenium-webdriver` is still an alpha version (4.0.0-alpha5)

## Bug and more

Feel free to open an issue on GitHub or to contribute by opening a pull-request.
