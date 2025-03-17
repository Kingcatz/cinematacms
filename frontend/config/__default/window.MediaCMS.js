module.exports = {
	MediaCMS: {
		api: require("../core/api.config.js"),
		url: require("../core/url.config.js"),
		user: require("../core/user.config.js"),
		site: require("./installation/site.config.js"),
		pages: require("./installation/pages.config.js"),
		contents: require("./installation/contents.config.js"),
		features: require("./installation/features.config.js"),
		/*notifications: [
            'Message one text',
            'Message two text',
            'Message three text'
        ],*/
	},
};
