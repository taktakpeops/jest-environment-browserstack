# jest-environment-browserstack

Use Jest as test-runner for running your visual-tests and more using Browserstack.

The current implementation supports only the W3C way for capabilities. More info: https://www.browserstack.com/automate/selenium-4

# Usage

For using this environment, run first the following command in your terminal:

```
npm install --save-dev jest-environment-browserstack
```

Once it's done, configure your Jest config.

## Browserstack

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

## Browserstack Local

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

## Loading the environment using annotation

If you are running all your tests with JSDom as main environment, you can load the Browserstack environment for a specific file by adding a Jest annotation at the beginning of your file.

Here is an example:

my-visual-test.spec.js:

```javascript
/**
 * @jest-environment browserstack
 */
import { until, By } from 'selenium-webdriver';

describe('my visual test', () => {
  it('test something', () => {
    global.__driver__.get('https://mysuperurl.ltd');
    // do something
    // do test
  });
});
```

## Credentials

If you aren't willing to put your credentials in your `package.json` file, you can export in your environment `BROWSERSTACK_USER_NAME` and `BROWSERSTACK_ACCESS_KEY`. If you do so, `userName` and `accessKey` can be omitted.

# Known limitations

For now, only one browser can be defined.

# Bug and more

Feel free to open an issue on GitHub or to contribute by opening a pull-request.
