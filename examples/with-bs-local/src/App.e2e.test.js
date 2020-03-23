/**
 * @jest-environment browserstack
 */

const { By } = require('selenium-webdriver');

describe('ui testing UiTest', () => {
  let driver;

  beforeAll(async () => {
    driver = await global.__driver__();

    await driver.get('http://localhost:8080');
  }, 20000);

  afterAll(async () => {
    await driver.quit();
  });

  it('load the app', async () => {
    const title = await driver.getTitle();

    expect(title).toBe('React App');
  });

  it('page has a link', async () => {
    const anchor = await driver.findElement(By.css('.App-link'));
    const text = await anchor.getText();

    expect(text).toBe('Learn React');
  });
});
