/**
 * @see {link: https://github.com/seeyoulater/html-beautify-webpack-plugin/blob/master/index.js}
 */

const prettify = require("html-prettify");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function htmlPluginDataFunction(pluginData, options, callback) {
	pluginData.html = prettify(
		options.replace.reduce(
			(res, item) =>
				res.replace(item instanceof RegExp ? new RegExp(item, "gi") : item, ""),
			pluginData.html
		)
		// options.config
	);

	callback(null, pluginData);
}

class MyHtmlBeautifyWebpackPlugin {
	apply(compiler) {
		const options = {
			config: {
				// TODO: Remove it.
				indent_size: 4,
				indent_with_tabs: false,
				html: {
					end_with_newline: true,
					indent_inner_html: true,
					preserve_newlines: true,
					max_preserve_newlines: 0,
				},
			},
			replace: [],
		};

		function tapAsyncCallback(pluginData, callback) {
			return htmlPluginDataFunction(pluginData, options, callback);
		}

		function tapHookCallback(compilation) {
			return HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
				"MyHtmlBeautifyWebpackPlugin",
				tapAsyncCallback
			);
		}

		compiler.hooks.compilation.tap(
			"MyHtmlBeautifyWebpackPlugin",
			tapHookCallback
		);
	}
}

module.exports = MyHtmlBeautifyWebpackPlugin;
