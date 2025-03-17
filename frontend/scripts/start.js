const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

const { parseCommandArgs, webpackConfigFactory } = require("./utils/");

const {
	config: argConfigFile,
	host: argHost,
	port: argPort,
} = parseCommandArgs(process.argv.slice(2));

// @todo: validate `argConfigFile` value.

// @todo: validate `configuration.src` absolute source path.
// @todo: validate `configuration.build` absolute source path.
// @todo: validate `configuration.postcssConfigFile` absolute source path.

const environment = "development";

const host = argHost || "0.0.0.0";
const port = argPort || 8080;

const inputConfig = require(path.resolve(argConfigFile));

const webpackConfig = webpackConfigFactory(environment, inputConfig);

const webpackDevServerConfig = {
	compress: true,
	hot: true,
	host,
	port,
	static: inputConfig.src,
};

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(webpackDevServerConfig, compiler);

server.startCallback(() => {});
