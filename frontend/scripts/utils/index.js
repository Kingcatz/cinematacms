const parseCommandArgs = require("./parseCommandArgs.js");
const preparePages = require("./prepare-pages/prepare-pages.js");
const webpackConfigFactory = require("./webpack-config/webpack-config-factory.js");

module.exports = {
	parseCommandArgs,
	preparePages,
	webpackConfigFactory,
};
