import { BrowserCapability } from './types';

/**
 * log levels for the the logger
 */
export enum LogTypes {
  LOG = 'log',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
}

/**
 * Abstract class to implement for wrapping an implementation of a Selenium web-driver
 */
export abstract class Driver<T extends { quit: Function } = { quit: Function }, C extends BrowserCapability = BrowserCapability> {
  constructor(private name: string, protected capabilities: C) {}

  private getDateForLog(): string {
    const date = new Date();

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  protected logger(level: LogTypes, input: string | Error): void {
    console[level](`[driver::${this.name}][${this.getDateForLog()}]: ${input instanceof Error ? input.message : input}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract async build(capabilities?: C, ...args: any[]): Promise<T>;
  abstract async quit(): Promise<boolean | undefined>;
}

/**
 * Abstract class representing a plugin
 */
export abstract class PluginDriver<T extends Driver> {
  protected driver: T;

  constructor(protected readonly moduleName: string) {}

  getName(): string {
    return this.moduleName;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract async createWdDriver<C extends BrowserCapability>(capabilities?: C, ...args: any[]): Promise<T>;
}
