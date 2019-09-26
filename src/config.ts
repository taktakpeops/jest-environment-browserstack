export interface BrowserstackW3COptions {
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
}

export interface BrowserstackCapabilities {
  browserName: string;
  'bstack:options': BrowserstackW3COptions;
  browserVersion?: string;
}
