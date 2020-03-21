import { BrowserCapability } from '@jest-environment-browserstack/plugins';
import { Options } from 'browserstack-local';

export type EnvironmentOptions = {
  capabilities: BrowserCapability;
  driver: string;
  localTesting: Options;
  seleniumHubUrl?: string;
};
