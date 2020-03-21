import { WebDriver, By } from 'selenium-webdriver';

describe('should override the default configuration', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    // eslint-disable-next-line
    // @ts-ignore
    driver = await global.__driver__({
      'bstack:options': {
        os: 'Windows',
        osVersion: '10',
        buildName: 'jest-environment-browserstack',
        sessionName: 'override capabilities',
      },
      browserName: 'Firefox',
      browserVersion: '75.0 beta',
    });
    await driver.get('https://github.com/taktakpeops/jest-environment-browserstack');
  }, 20000);

  afterAll(async () => {
    await driver.quit();
  });

  it('has an author', async () => {
    const authorSpan = await driver.findElement(By.css('.author > a'));
    const author = await authorSpan.getText();
    expect(author).toBe('taktakpeops');
  });

  it('has a repository name', async () => {
    const repoSpan = await driver.findElement(By.css('.pagehead > * strong[itemprop=name] > a'));
    const repo = await repoSpan.getText();
    expect(repo).toBe('jest-environment-browserstack');
  });
});
