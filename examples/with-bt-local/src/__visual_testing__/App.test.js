/**
 * @jest-environment browserstack
 */
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

describe('ui testing', () => {
  const driver = global.__driver__;

  it('load the app', async () => {
    await driver.get('http://localhost:8080');

    const title = await driver.getTitle();

    expect(title).toBe('React App');
  });

  it('take and screenshot and compare', async () => {
    const image = await driver.takeScreenshot();
    return expect(image).toMatchImageSnapshot();
  });
});
