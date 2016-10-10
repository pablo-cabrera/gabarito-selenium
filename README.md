gabarito-selenium [![Build Status](https://travis-ci.org/pablo-cabrera/gabarito-selenium.png)](https://travis-ci.org/pablo-cabrera/gabarito-selenium)
==============

Selenium environment for gabarito.

## TL;DR

Install dev dependencies.

```shell
npm install gabarito --save-dev
npm install gabarito-selenium --save-dev
```

Setup runner

```js
// runner.js

var gabarito = require("gabarito");
var SeleniumEnvironment = require("gabarito-selenium");

// setup selenium environment
var seleniumCapabilities = {
    browser: "firefox",
    version: "47",
    platform: "linux"
};
var seleniumHub = "localhost:4444";
var gabaritoHost = "localhost";

var env = new SeleniumEnvironment(
    seleniumCapabilities,
    seleniumHub,
    gabaritoHost);

// setup runner
var runner = new gabarito.plumbing.Runner();
runner.addEnvironment(env);
runner.addFile("test.js");
runner.addReporter(new gabarito.plumbing.ConsoleReporter());

runner.run(function (results) {
    console.log(results);
});
```

The test.js file

```js
// test.js
var assert = gabarito.assert;

gabarito.add("test").
clause("should pass", function () {
    assert.isTrue(true);
}).

clause("should fail", function () {
    assert.isTrue(false);
});
```

Run.
```shell
node runner.js
```
