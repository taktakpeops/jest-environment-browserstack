/**
 * @jest-environment browserstack
 */

const { By } = require('selenium-webdriver');

describe('ui testing', () => {
  const driver = global.__driver__;

  it('load the app', async () => {
    await driver.get('http://localhost:8080');

    const title = await driver.getTitle();

    expect(title).toBe('React App');
  });

  it('page has a link', async () => {
    const anchor = await driver.findElement(By.css('.App-link'));
    const text = await anchor.getText();

    expect(text).toBe('Learn React');
  });
});
