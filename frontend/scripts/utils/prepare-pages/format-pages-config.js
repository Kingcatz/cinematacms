const merge = require("lodash.merge");

const validateBoolean = (val, defaultVal) => {
	if (true === val || false === val) {
		return val;
	}

	if (0 === val || 1 === val) {
		return !!val;
	}

	return defaultVal || false;
};

const validateString = (val, defaultVal) => (val ? val : defaultVal || "");

const getArrayType = (sourcesArr, pageArr) => {
	if ((!sourcesArr || !sourcesArr.length) && (!pageArr || !pageArr.length)) {
		return [];
	}

	if (sourcesArr && sourcesArr.length && pageArr && pageArr.length) {
		return sourcesArr.concat(pageArr);
	}

	if (sourcesArr && sourcesArr.length) {
		return sourcesArr;
	}

	return pageArr;
};

const formatPagesConfig = (sources, pages) => {
	const ret = {};

	for (const pk in pages) {
		ret[pk] = {
			staticPage: validateBoolean(pages[pk].staticPage, false),
			buildExclude: validateBoolean(pages[pk].buildExclude, false),
			title: validateString(pages[pk].title, sources.title),
			filename: validateString(pages[pk].filename, sources.filename),
			html: {
				head: {
					meta: getArrayType(sources.html.head.meta, pages[pk].html.head.meta),
					links: getArrayType(sources.html.head.links, pages[pk].html.head.links),
					scripts: getArrayType(
						sources.html.head.scripts,
						pages[pk].html.head.scripts
					),
				},
				body: {
					scripts: getArrayType(
						sources.html.body.scripts,
						pages[pk].html.body.scripts
					),
					snippet: validateString(
						pages[pk].html.body.snippet,
						sources.html.body.snippet
					),
				},
			},
			window: merge({}, sources.window, pages[pk].window),
			render: validateString(sources.render, pages[pk].render),
		};
	}

	return ret;
};

module.exports = { formatPagesConfig };
