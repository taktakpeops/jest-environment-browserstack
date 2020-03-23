# @jest-environment-browserstack/plugins

Provides the abstract classes needed for implementing a plugin.

A plugin is a wrapper on top of the W3C WebDriver API used in `jest-environment-browserstack` for interacting with Browserstack.

## Usage

```bash
npm install --save @jest-environment-browserstack/plugins
```

In your plugin:

```typescript
import { WebDriver, Builder } from 'my-selenium-webdriver';
import { BrowserCapability, PluginDriver, Driver, LogTypes } from '@jest-environment-browserstack/plugins';

export class SeleniumWebDriver extends Driver<WebDriver> {
  async build(capabilities?: BrowserCapability): Promise<WebDriver> {
    // init your module
  }

  async quit(): Promise<boolean> {
    // your module teardown
  }
}

export class PluginSeleniumWebDriver extends PluginDriver<SeleniumWebDriver> {
  async createWdDriver(capabilities?: BrowserCapability, hubUrl?: string): Promise<SeleniumWebDriver> {
    // create your driver instance and return it for the test
  }
}
```

Inside the core, we use the `Reflect` API to determine which object contains the `createWdDriver` method.

## Bugs / Improvements

Feel free to report an issue in case you found a bug or something which could be improved. PR are more than welcome !
