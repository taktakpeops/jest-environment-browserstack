import { WebDriver, Builder } from 'selenium-webdriver';
import { BrowserCapability, PluginDriver, Driver, LogTypes } from '@jest-environment-browserstack/plugins';

export class SeleniumWebDriver extends Driver<WebDriver> {
  public static pluginName = 'selenium-webdriver';

  private driver: WebDriver;

  constructor(capabilities: BrowserCapability, private selHubUrl: string) {
    super(SeleniumWebDriver.pluginName, capabilities);
  }

  async build(capabilities?: BrowserCapability): Promise<WebDriver> {
    const driverFactory = new Builder().usingServer(this.selHubUrl).withCapabilities(capabilities || this.capabilities);

    this.driver = await driverFactory.build();

    return this.driver;
  }

  async quit(): Promise<boolean> {
    try {
      await this.driver.quit();

      return true;
    } catch (e) {
      this.logger(LogTypes.ERROR, e);

      return false;
    }
  }
}

export class PluginSeleniumWebDriver extends PluginDriver<SeleniumWebDriver> {
  constructor() {
    super('selenium-webdriver');
  }

  async createWdDriver(capabilities?: BrowserCapability, hubUrl?: string): Promise<SeleniumWebDriver> {
    this.driver = new SeleniumWebDriver(capabilities, hubUrl);

    return Promise.resolve(this.driver);
  }

  getName(): string {
    return this.moduleName;
  }
}
