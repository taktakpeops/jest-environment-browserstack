/**
 * @jest-environment browserstack
 */
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

describe('visual testing VisualTest', () => {
  let driver;

  beforeAll(async () => {
    driver = await global.__driver__({
      'bstack:options': {
        sessionName: 'visual testing',
      },
    });

    await driver.get('http://localhost:8080');
  }, 10000);

  afterAll(async () => {
    await driver.quit();
  });

  it('check the app', async () => {
    const title = await driver.getTitle();

    expect(title).toBe('React App');
  });

  it('take and screenshot and compare', async () => {
    const image = await driver.takeScreenshot();
    return expect(image).toMatchImageSnapshot();
  });
});
