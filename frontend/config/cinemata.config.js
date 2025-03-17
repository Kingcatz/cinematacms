require("dotenv").config();

const path = require("path");

const html = require("./cinemata/cinemata.mediacms.html.config.js");
const { pages } = require("./cinemata/cinemata.mediacms.pages.config.js");
const windowMediaCMS = require("./cinemata/cinemata.window.MediaCMS.js");

module.exports = {
	src: path.resolve(__dirname, "../src"),
	build: path.resolve(__dirname, "../build"),
	html,
	pages,
	window: windowMediaCMS,
	postcssConfigFile: path.resolve(__dirname, "postcss.config.js"),
};
