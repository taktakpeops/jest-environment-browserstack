export type BrowserstackW3COptions = {
  userName: string;
  accessKey: string;
  os?: string;
  osVersion?: string;
  local?: boolean;
  debug?: boolean;
  buildName?: string;
  sessionName?: string;
  localIdentifier?: string;
  networkLogs?: boolean;
  safari?: {
    enablePopups?: boolean;
    useSimulator?: boolean;
    allowAllCookies?: boolean;
    driver?: string;
  };
};

export type ChromeOptions = {
  w3c?: boolean;
  binary?: string;
  args?: string[];
};

export type FirefoxOptions = {
  binary?: string;
  args?: string[];
  profile?: string;
  log?: {
    level?: string;
  };
  prefs?: object;
};

export type InternetExplorerOptions = {
  ignoreProtectedModeSettings: boolean;
  ignoreZoomSetting: boolean;
  'ie.ensureCleanSession': boolean;
};

export type BrowserCapability = {
  browserName?: string;
  browserVersion?: string;
  platformName?: string;
  acceptInsecureCerts?: boolean;
  pageLoadStrategy?: 'none' | 'eager' | 'normal';
  unhandledPromptBehavior?: 'dismiss' | 'accept' | 'dismiss and notify' | 'accept and notify' | 'ignore';
  'goog:chromeOptions'?: ChromeOptions;
  'moz:firefoxOptions'?: FirefoxOptions;
  'se:ieOptions'?: InternetExplorerOptions;
  'bstack:options'?: BrowserstackW3COptions;
};

export type DriverInstance = {
  quit: Function;
};
