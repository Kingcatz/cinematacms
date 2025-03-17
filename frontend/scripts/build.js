const path = require("path");
const webpack = require("webpack");
const webpackFormatMessages = require("webpack-format-messages");

const { parseCommandArgs, webpackConfigFactory } = require("./utils/");

const { config: argConfigFile, env: argEnvironment } = parseCommandArgs(
	process.argv.slice(2)
);

const environment = argEnvironment || "production";

const webpackConfig = webpackConfigFactory(
	environment,
	require(path.resolve(argConfigFile))
);

const compiler = webpack(webpackConfig);

compiler.run((err, stats) => {
	if (err) throw err;

	const messages = webpackFormatMessages(stats);

	if (!messages.errors.length && !messages.warnings.length) {
		console.log("Compiled successfully!", "\n");
	}

	if (messages.errors.length) {
		console.log("Failed to compile.", "\n");

		for (const m of messages.errors) {
			console.log(m);
		}
	} else if (messages.warnings.length) {
		console.log("Compiled with warnings.", "\n");

		for (const m of messages.warnings) {
			console.log(m);
		}
	}
});
