require("dotenv").config();

const path = require("path");

const html = require("./__default/mediacms.html.config.js");
const { pages } = require("./__default/mediacms.pages.config.js");
const windowMediaCMS = require("./__default/window.MediaCMS.js");

module.exports = {
	src: path.resolve(__dirname, "../src"),
	build: path.resolve(__dirname, "../build__default"),
	html,
	pages,
	window: windowMediaCMS,
	postcssConfigFile: path.resolve(__dirname, "postcss.config.js"),
};
