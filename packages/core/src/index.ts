import NodeEnvironment from 'jest-environment-node';
import { Config } from '@jest/types';
import { Driver, DriverInstance, PluginDriver, BrowserCapability } from '@jest-environment-browserstack/plugins';
import { Options, Local } from 'browserstack-local';
import { randomBytes } from 'crypto';
import { Script } from 'vm';
import { EnvironmentOptions } from './types';

/**
 * Browserstack environment
 */
export default class BrowserstackEnvironment<T extends Driver> extends NodeEnvironment {
  /**
   * local identifier for the Browserstack tunnel
   */
  private readonly localIdentifier: string;

  /**
   * Browserstack key
   */
  private readonly key: string;

  /**
   * Browserstack Selenium hub URL
   */
  private readonly selHubUrl: string;

  /**
   * default browser capabilities
   */
  private readonly btCapabilities: EnvironmentOptions;

  /**
   * Browserstack tunnel options
   */
  private btTunnelOpts: Options;

  /**
   * driver module name
   */
  private pluginDriver: string;

  /**
   * plugin instance
   */
  private plugin: PluginDriver<T>;

  /**
   * driver instances
   */
  private readonly drivers: T[];

  constructor(config: Config.ProjectConfig) {
    super(config);

    // get the configurations from the config in the main package.json
    const { browserstack } = config.globals;

    this.btCapabilities = browserstack;

    const {
      capabilities: { 'bstack:options': opts },
      driver,
      seleniumHubUrl = 'https://hub-cloud.browserstack.com/wd/hub',
    } = this.btCapabilities;

    // if no Browserstack credentials were found in the package.json
    // look into the environment for BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY
    if (!opts.accessKey || !opts.userName) {
      const { BROWSERSTACK_USERNAME: userName = '', BROWSERSTACK_ACCESS_KEY: accessKey = '' } = process.env;

      if (!userName || !accessKey) {
        throw new Error('valid credentials for Browserstack are required');
      }

      opts.accessKey = accessKey;
      opts.userName = userName;
    }

    this.key = opts.accessKey;

    if (opts.local) {
      // if local identifier wasn't generate a random 28 chars string
      if (!opts.localIdentifier) {
        this.localIdentifier = Buffer.from(randomBytes(28)).toString('hex');
        opts.localIdentifier = this.localIdentifier;
      } else {
        this.localIdentifier = opts.localIdentifier;
      }

      opts.localIdentifier = this.localIdentifier;

      this.btTunnelOpts = this.btCapabilities.localTesting;
    }

    this.selHubUrl = seleniumHubUrl;

    if (!driver) {
      throw new Error('a driver is needed for interacting with Browserstack');
    }

    this.pluginDriver = driver;
    this.drivers = new Array<T>();
  }

  /**
   * override the original setup environment for the Browserstack one
   */
  async setup(): Promise<void> {
    await super.setup();

    if (this.btTunnelOpts) {
      await this.createBTTunnel();
    }

    // the plugin for the driver is loaded dynamically
    const mod = await import(this.pluginDriver);

    // look for the exported member having a createWdDriver method
    const clazz = Object.values(mod).find(fct => Reflect.has((fct as Function).prototype, 'createWdDriver')) as PluginDriver<T>;

    if (!clazz) {
      throw new Error('the plugin is not extending @jest-browserstack-environment/plugin');
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.plugin = new clazz();
    const driver = await this.plugin.createWdDriver(this.btCapabilities.capabilities, this.selHubUrl);

    this.global.__driver__ = (async <D extends DriverInstance = { quit: Function }>(caps?: BrowserCapability): Promise<D> => {
      if (caps) {
        caps['bstack:options'].accessKey = this.key;
        caps['bstack:options'].userName = this.btCapabilities.capabilities['bstack:options'].userName;
      }

      return (await driver.build(caps || this.btCapabilities.capabilities)) as D;
    }).bind(this);

    this.drivers.push(this.global.__driver__);
  }

  /**
   * environment teardown - kill all driver instance and close the tunnel
   */
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

  /**
   * Create the Browserstack tunnel
   * @returns {Promise} resolve if the tunnel was correctly created
   */
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

  /**
   * Browserstack tunnel teardown
   * @returns {Promise} resolve if everything went well
   */
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
