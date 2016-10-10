module.exports = function (grunt) {
    "use strict";

    var lintFiles = [
        "Gruntfile.js",
        "tasks/test.js",
        "lib/**/*.js",
        "test/cases/**/*.js"
    ];

    grunt.option("stack", true);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        gabarito: {
            src: [
                "test/cases/SeleniumEnvironmentTest.js"
            ],

            options: {
                environments: ["node"]
            }
        },

        jshint: {
            options: {
                /* enforcing */
                strict: true,
                bitwise: false,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                plusplus: true,
                quotmark: "double",

                undef: true,

                /* relaxing */
                eqnull: true,
                sub: true,

                /* environment */
                node: true
            },

            files: lintFiles
        },

        jscs: {
            src: lintFiles,
            options: {
                config: ".jscsrc"
            }
        },

        yuidoc: {
            compile: {
                name: "<%= pkg.name %>",
                description: "<%= pkg.description %>",
                version: "<%= pkg.version %>",
                url: "<%= pkg.homepage %>",
                options: {
                    themedir: "node_modules/yuidoc-clear-theme",
                    paths: ["lib/"],
                    outdir: "docs/"
                }
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-yuidoc");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-gabarito");

    grunt.registerTask("default", ["jscs", "jshint", "gabarito"]);

};
