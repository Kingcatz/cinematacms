const { defaultPages } = require("./default-pages.js");
const { formatPagesConfig } = require("./format-pages-config.js");

const preparePages = (pages, html, window) => {
	const pagesKeys = pages ? Object.keys(pages) : [];
	return formatPagesConfig(
		{
			title: "",
			filename: "",
			render: "",
			html,
			window,
		},
		{ ...pages, ...defaultPages(pagesKeys) }
	);
};

module.exports = preparePages;
