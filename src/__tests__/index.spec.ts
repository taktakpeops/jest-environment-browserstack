import { WebDriver } from 'selenium-webdriver';

describe('BrowserstackEnvironment', () => {
  // eslint-disable-next-line
  // @ts-ignore
  const driver = global.__driver__ as WebDriver;

  it('connects to NPM', async () => {
    await driver.get('https://www.npmjs.com/package/jest-environment-browserstack');

    const title = await driver.getTitle();
    expect(title).toBe('jest-environment-browserstack - npm');
  });
});
