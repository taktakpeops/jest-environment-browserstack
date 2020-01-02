# jest-environment-browserstack

[![Actions Status](https://github.com/taktakpeops/jest-environment-browserstack/workflows/Node%20CI/badge.svg)](https://github.com/taktakpeops/jest-environment-browserstack/actions) [![npm version](http://img.shields.io/npm/v/jest-environment-browserstack.svg?style=flat)](https://npmjs.org/package/jest-environment-browserstack 'View this project on npm')

Use Jest as test-runner for running your visual-tests and more using Browserstack.

The current implementation supports only the W3C way for capabilities. More info: [https://www.browserstack.com/automate/selenium-4](https://www.browserstack.com/automate/selenium-4)

## Usage

For using this environment, run first the following command in your terminal:

```bash
npm install --save-dev jest-environment-browserstack
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

If you aren't willing to put your credentials in your `package.json` file, you can export in your environment `BROWSERSTACK_USER_NAME` and `BROWSERSTACK_ACCESS_KEY`. If you do so, `userName` and `accessKey` can be omitted.

## Examples

In the `examples` folder, you can find an example using `react-create-app`.

To run the test, type the following commands in your terminal:

```bash
cd examples/with-bt-local
yarn install
yarn test
```

The `test` script will run a basic e2e tests, a visual tests making a snapshot of the web-app and the unit-tests.

## Known limitations

The screenshot API from Browserstack is not implemented yet.
The npm package `selenium-webdriver` is still an alpha version (4.0.0-alpha5) 

## Bug and more

Feel free to open an issue on GitHub or to contribute by opening a pull-request.
