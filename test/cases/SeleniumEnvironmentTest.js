"use strict";

var gabarito = require("gabarito");
var parts = require("parts");
var assert = gabarito.assert;
var SeleniumEnvironment = require("../../lib/SeleniumEnvironment");

var MyEnv;
var shared;

gabarito.test("SeleniumEnvironment").

before(function () {
    shared = {};
    MyEnv = SeleniumEnvironment.descend(shared);
}).

clause(
"dispatchBrowser should sent the browser to locahost:1432 and run the callback",
function () {
    var capabilities = {};
    var hub = "hub";
    var host = "localhost";

    var driverPromise = { then: gabarito.spy(function (f) { f(); }) };
    var driver = { get: gabarito.spy(parts.constant(driverPromise)) };

    var driverBuilder = {
        withCapabilities: gabarito.spy(function () { return this; }),
        usingServer: gabarito.spy(function () { return this; }),
        build: gabarito.spy(parts.constant(driver))
    };

    var webDriver = { Builder: gabarito.spy(parts.constant(driverBuilder)) };

    var done = gabarito.spy();

    var env = new MyEnv(capabilities, hub, host, webDriver);
    env[shared.dispatchBrowser](done);

    webDriver.Builder.verify();

    driverBuilder.withCapabilities.verify().args(capabilities);
    driverBuilder.usingServer.verify().args("http://" + hub + "/wd/hub");
    driverBuilder.build.verify();

    driver.get.verify().args("http://" + host + ":1432");
    driverPromise.then.verify();
    done.verify();

}).

clause("ditchBrowser should get rid of the driver and run the callback",
function () {
    var capabilities = {};
    var hub = "hub";
    var host = "localhost";

    var driverPromise = { then: gabarito.spy(function (f) { f(); }) };

    var driver = {
        get: function () { return { then: function (f) { f(); } }; },
        quit: gabarito.spy(parts.constant(driverPromise))
    };

    var driverBuilder = {
        withCapabilities: function () { return this; },
        usingServer: function () { return this; },
        build: parts.constant(driver)
    };

    var webDriver = { Builder: gabarito.spy(parts.constant(driverBuilder)) };

    var done = gabarito.spy();

    var env = new MyEnv(capabilities, hub, host, webDriver);
    env[shared.dispatchBrowser](parts.k);
    env[shared.ditchBrowser](done);

    driver.quit.verify();
    driverPromise.then.verify();
    done.verify();

}).

clause(
"getName should identify the environment with the browser name",
function () {
    var capabilities = { browserName: "browserName" };
    var hub = "hub";
    var host = "localhost";

    var env = new SeleniumEnvironment(capabilities, hub, host);

    var name = env.getName();
    assert.that(name).sameAs("Selenium[browserName]");
}).

clause(
"getName should identify the environment with the browser name and version",
function () {
    var capabilities = {
        browserName: "browserName",
        version: "version"
    };
    var hub = "hub";
    var host = "localhost";

    var env = new SeleniumEnvironment(capabilities, hub, host);

    var name = env.getName();
    assert.that(name).sameAs("Selenium[browserName:version]");
}).

clause(
"getName should identify the environment with the browser name, version and " +
"platform",
function () {
    var capabilities = {
        browserName: "browserName",
        version: "version",
        platform: "platform"
    };
    var hub = "hub";
    var host = "localhost";

    var env = new SeleniumEnvironment(capabilities, hub, host);

    var name = env.getName();
    assert.that(name).sameAs("Selenium[browserName:version:platform]");
});
