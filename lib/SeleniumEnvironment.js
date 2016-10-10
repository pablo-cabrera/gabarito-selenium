"use strict";

var ServerEnvironment = require("gabarito").plumbing.ServerEnvironment;
var ilk = require("ilk");

module.exports = ilk.tokens(function (
    driver,
    capabilities,
    hub,
    host,
    webdriver
) {
    var shared = {};

    /**
     * @class SeleniumEnvironment
     * @extends gabarito::gabarito.plumbing.ServerEnvironment
     * @constructor
     *
     * @param {object} capabilities
     * @param {string} hub
     * @param {string} host
     * @param {selenium-webdriver::WebDriver} [webdriver]
     */
    return ServerEnvironment.descend(function (
            pCapabilities, pHub, pHost, pWebdriver) {

        capabilities.mark(this, pCapabilities);
        hub.mark(this, pHub);
        host.mark(this, pHost);

        webdriver.mark(this, pWebdriver || require("selenium-webdriver"));

        ServerEnvironment.call(this);
    }, shared).

    proto(shared.dispatchBrowser, function (done) {
        this[driver] = new this[webdriver].Builder().
                withCapabilities(this[capabilities]).
                usingServer("http://" + this[hub] + "/wd/hub").
                build();

        this[driver].get("http://" + this[host] + ":1432").
        then(function () { done(); });
    }).

    proto(shared.ditchBrowser, function (done) {
        this[driver].quit().
        then(function () { done(); });
    }).

    proto({

        /**
         * Returns the name of the environment, the browser, version and
         * platform from its capabilities.
         *
         * @method getName
         * @for SeleniumEnvironment
         *
         * @return {string}
         */
        getName: function () {
            var version = this[capabilities].version;
            var platform = this[capabilities].platform;

            var name = "Selenium[" + this[capabilities].browserName;

            if (version) {
                name += ":" + version;
            }

            if (platform) {
                name += ":" + platform;
            }

            name += "]";
            return name;
        }

    });
});
