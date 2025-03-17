const bodySnippet = (id) => '<div id="' + id + '"></div>';

const homePage = {
	staticPage: true,
	buildExclude: false,
	title: "Home",
	filename: "index.html",
	html: {
		head: {},
		body: {
			scripts: [],
			snippet: bodySnippet("page-home"),
		},
	},
	window: {},
	render:
		"import { renderPage } from './js/helpers'; import { HomePage } from './js/pages/HomePage'; renderPage( 'page-home', HomePage );",
};

const errorPage = {
	staticPage: true,
	buildExclude: false,
	title: "Error",
	filename: "error.html",
	html: {
		head: {},
		body: {
			scripts: [],
			snippet: bodySnippet("page-error"),
		},
	},
	window: {},
	render:
		"import { renderPage } from './js/helpers'; import { ErrorPage } from './js/pages/ErrorPage'; renderPage( 'page-error', ErrorPage );",
};

const pages = {
	home: homePage,
	error: errorPage,
};

const htmlHead = {
	meta: [
		{ charset: "utf-8" },
		{ content: "ie=edge", "http-equiv": "x-ua-compatible" },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
	],
	links: [],
	scripts: [],
};

const htmlBody = {
	scripts: [],
	snippet: "",
};

const configuration = {
	src: "",
	build: "",
	pages,
	html: {
		head: htmlHead,
		body: htmlBody,
	},
	window: {},
	postcssConfigFile: "",
};

module.exports = {
	configuration,
};
