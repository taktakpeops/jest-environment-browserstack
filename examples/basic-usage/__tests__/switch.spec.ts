import { WebDriver, By } from 'selenium-webdriver';

describe('Switch specs', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    // eslint-disable-next-line
    // @ts-ignore
    driver = await global.__driver__({
      'bstack:options': {
        osVersion: '11',
        deviceName: 'iPhone 8 Plus',
        realMobile: 'true',
        buildName: 'jest-environment-browserstack',
        sessionName: 'override capabilities',
      },
      browserName: 'iPhone',
    });
    await driver.get('https://github.com/taktakpeops/jest-environment-browserstack');
  }, 20000);

  afterAll(async () => {
    await driver.quit();
  });

  it('has an author', async () => {
    const authorSpan = await driver.findElement(By.css('.Details .Header-link:first-of-type'));
    const author = await authorSpan.getText();
    expect(author).toBe('taktakpeops');
  });

  it('has a repository name', async () => {
    const repoSpan = await driver.findElement(By.css('.Details .Header-link:last-of-type'));
    const repo = await repoSpan.getText();
    expect(repo).toBe('jest-environment-browserstack');
  });
});
