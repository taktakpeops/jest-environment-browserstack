import NodeEnvironment from 'jest-environment-node';
import { Config } from '@jest/types';
import { Options, Local } from 'browserstack-local';
import { Builder, WebDriver } from 'selenium-webdriver';
import { randomBytes } from 'crypto';
import { Script } from 'vm';

import { BrowserstackCapabilities } from './types';

export default class BrowserstackEnvironment extends NodeEnvironment {
  private readonly localIdentifier: string;

  private readonly key: string;

  private readonly selHubUrl: string;

  private readonly btCapabilities: BrowserstackCapabilities;

  private btTunnelOpts: Options;

  private readonly drivers: WebDriver[];

  constructor(config: Config.ProjectConfig) {
    super(config);

    const {
      browserstack: { capabilities, seleniumHubUrl = 'https://hub-cloud.browserstack.com/wd/hub', localTesting = null },
    } = config.globals;

    this.btCapabilities = capabilities;

    const opts = this.btCapabilities['bstack:options'];

    if (!opts.accessKey || !opts.userName) {
      const { BROWSERSTACK_USER_NAME: userName = '', BROWSERSTACK_ACCESS_KEY: accessKey = '' } = process.env;

      if (!userName || !accessKey) {
        throw new Error('valid credentials for Browserstack are requierd');
      }

      this.btCapabilities['bstack:options'].accessKey = accessKey;
      this.btCapabilities['bstack:options'].userName = userName;
    }

    this.key = opts.accessKey;

    if (opts.local) {
      if (!opts.localIdentifier) {
        this.localIdentifier = Buffer.from(randomBytes(28)).toString('hex');
        opts.localIdentifier = this.localIdentifier;
      } else {
        this.localIdentifier = opts.localIdentifier;
      }

      this.btCapabilities['bstack:options'].localIdentifier = this.localIdentifier;

      this.btTunnelOpts = localTesting;
    }

    this.selHubUrl = seleniumHubUrl;
    this.drivers = new Array<WebDriver>();
  }

  async setup(): Promise<void> {
    await super.setup();

    if (this.btTunnelOpts) {
      await this.createBTTunnel();
    }

    this.global.__driver__ = this.createWDDriver.bind(this);
  }

  async teardown(): Promise<void> {
    await super.teardown();

    await Promise.all(
      this.drivers.map(async driver => {
        try {
          await driver.quit();
        } catch (_) {
          return Promise.resolve();
        }
      }),
    );
    await this.closeBTTunnel();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runScript(script: Script): any {
    return super.runScript(script);
  }

  private async createWDDriver(capabilities?: BrowserstackCapabilities): Promise<WebDriver> {
    // checks if we have new capabilities
    if (capabilities) {
      // define username + accessKey + tunnelIdentifier if any
      capabilities['bstack:options'].userName = this.btCapabilities['bstack:options'].userName;
      capabilities['bstack:options'].accessKey = this.btCapabilities['bstack:options'].accessKey;

      if (this.localIdentifier) {
        capabilities['bstack:options'].localIdentifier = this.btCapabilities['bstack:options'].localIdentifier;
      }
    }

    const driverFactory = new Builder().usingServer(this.selHubUrl).withCapabilities(capabilities || this.btCapabilities);

    const driver = await driverFactory.build();

    this.drivers.push(driver);

    return driver;
  }

  private createBTTunnel(): Promise<void | Error> {
    if (this.localIdentifier) {
      this.btTunnelOpts.localIdentifier = this.localIdentifier;
    }

    this.btTunnelOpts.key = this.key;

    this.global.__local__ = new Local();

    return new Promise((resolve, reject): void => {
      this.global.__local__.start(this.btTunnelOpts, (err?: Error) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  private closeBTTunnel(): Promise<void | Error> {
    if (!this.global.__local__) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject): void => {
      this.global.__local__.stop((err?: Error) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}
