import { WebDriver, By } from 'selenium-webdriver';

describe('Github page', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    // eslint-disable-next-line
    // @ts-ignore
    driver = await global.__driver__();

    await driver.get('https://github.com/taktakpeops/jest-environment-browserstack');
  }, 20000);

  it('has loaded', async () => {
    await driver.wait(async () => {
      const elem = await driver.findElement(By.css('.octicon'));

      return elem.isDisplayed();
    }, 2000);

    expect(await driver.getTitle()).toBe(
      'GitHub - taktakpeops/jest-environment-browserstack: A Jest environment for using Browserstack and Browserstack-Local with Webdriver-manager',
    );
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
