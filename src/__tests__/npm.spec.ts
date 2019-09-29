import { WebDriver, By } from 'selenium-webdriver';

describe('NPM', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    // eslint-disable-next-line
    // @ts-ignore
    driver = await global.__driver__({
      'bstack:options': {
        sessionName: 'npm',
      },
    });
    await driver.get('https://www.npmjs.com/package/jest-environment-browserstack');
  }, 10000);

  afterAll(async () => {
    await driver.quit();
  });

  it('get title from NPM', async () => {
    const title = await driver.getTitle();
    expect(title).toBe('jest-environment-browserstack - npm');
  });

  it('get name of the module', async () => {
    const titleBlock = await driver.findElement(By.css('.w-100.ph0-l.ph3.ph4-m span[title="jest-environment-browserstack"]'));
    const title = await titleBlock.getText();
    expect(title).toBe('jest-environment-browserstack');
  });
});
