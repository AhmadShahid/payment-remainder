# collectAI payment-remainder

<p align="center">
  <h2>collectAI payment-remainder</h2>
</p>

<p align="center">A Invoice Remainder based system that sends out reminders of unsettled invoices based on the specified schedule.</p>
    <p align="center">
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
</p>

This app only uses one third-party library, which is needed to parse csv files.
**[csv-parser](https://github.com/mafintosh/csv-parser)** is greased-lightning fast csv parser library that can convert CSV into JSON at at rate of around 90,000 rows per second.

### Known issues:

Sometimes the time is off by a few milliseconds. This is primarily due to the solution's usage of the'setTimeout' function, which is inaccurate due to Node.js/asynchronous javascript's nature.

### Clone repository

To clone the repository, use the following commands:

```bash
git clone https://github.com/AhmadShahid/payment-remainder.git
cd payment-remainder
```

## Installation

```bash
$ npm install
```

## Quick start

-   You will need to have `Node.js` installed, this project has been tested with Node version [16.X](https://nodejs.org/en/blog/release/v12.22.1/) and [14.X](https://nodejs.org/en/blog/release/v14.17.5/)

```bash
# clone this repo
$ git clone https://github.com/AhmadShahid/product-discount.git
# go to payment-remainder dir
$ cd payment-remainder
# copy .env.example to .env for environment configuration
$ cp .env.example .env
# install dependencies
$ npm install

# Try to give all permission to your bin folder with below command to avoid EAccess issue on both linux and MacBook Platforms
chmod -R 755 dist/bin
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run build
$ npm run start
```

## Available Scripts

-   `start` - run project in production environment,
-   `start:dev` - run project in dev environment,
-   `clean` - remove coverage data, Jest cache and transpiled files,
-   `prebuild` - lint source files and tests before building,
-   `build` - transpile TypeScript to ES6,
-   `lint` - lint source files and tests,
-   `lint:fix` - fix linting issues,
-   `prettier` - reformat files,
-   `test` - run tests,
-   `test:watch` - interactive watch mode to automatically re-run tests

## What's the stack used in this project?

-   **[TypeScript](https://www.typescriptlang.org/)** is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
-   **[Eslint](https://eslint.org/)** is a static code analysis tool for identifying problematic patterns found in JavaScript code.
-   **[Prettier](https://prettier.io/)** is to enforce consistent code style.
-   **[Jest](https://facebook.github.io/jest/)** is a testing platform from Facebook Code. It's easy to configure and provides out-of-the-box mocking and code coverage reporting.

## Stay in touch

-   Author - [Shahid Ahmad]
-   Twitter - [@shahid](https://twitter.com/shahida09454170)

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/AhmadShahid/payment-remainder/blob/main/LICENSE) file for details.
