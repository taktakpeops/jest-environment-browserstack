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

      this.btTunnelOpts = localTesting;
    }

    this.selHubUrl = seleniumHubUrl;
  }

  async setup(): Promise<void> {
    await super.setup();

    if (this.btTunnelOpts) {
      await this.createBTTunnel();
    }

    this.global.__driver__ = await this.createWDDriver();
  }

  async teardown(): Promise<void> {
    await super.teardown();

    await this.global.__driver__.quit();
    await this.closeBTTunnel();
  }

  runScript(script: Script): any {
    return super.runScript(script);
  }

  private async createWDDriver(): Promise<WebDriver> {
    const driverFactory = new Builder().usingServer(this.selHubUrl).withCapabilities(this.btCapabilities);

    return await driverFactory.build();
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
