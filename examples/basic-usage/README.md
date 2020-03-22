# Basic Usage

In this folder, you can find a basic example showing how to configure Jest and use the environment.

## Usage

After cloning the repository, run the following commands:

```bash
yarn
yarn build
cd packages/plugins
yarn link
cd ../selenium-webdriver
yarn link @jest-environment-browserstack/plugins
yarn link
cd ../core
yarn link @jest-environment-browserstack/plugins
yarn link @jest-environment-browserstack/selenium-webdriver
yarn link
cd ../../examples/basic-usage
yarn install
yarn test
```

Make sure that you either add `accessKey` and `userName` to the `bstack:options` object in the `package.json` or that you export `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` in your terminal.

## Issues / Bugs / Improvements

Open an issue or open a PR - contributions are more than welcome !
