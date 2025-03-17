module.exports = {
	head: {
		meta: [
			{ charset: "utf-8" },
			{ content: "ie=edge", "http-equiv": "x-ua-compatible" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ name: "theme-color", content: "#fafafa" },
			{ name: "msapplication-TileColor", content: "#fafafa" },
			{
				name: "msapplication-config",
				content: "__default-favicons/browserconfig.xml",
			},
		],
		links: [
			/**
			 * Manifest file link.
			 */
			{ rel: "manifest", href: "static/__default-favicons/site.webmanifest" },

			/**
			 * Favicon links.
			 *
			 * @see {link: https://realfavicongenerator.net}
			 */
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "static/__default-favicons/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "static/__default-favicons/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "static/__default-favicons/favicon-16x16.png",
			},
			{
				rel: "mask-icon",
				href: "static/__default-favicons/safari-pinned-tab.svg",
				color: "#fafafa",
			},
			{ rel: "shortcut icon", href: "static/__default-favicons/favicon.ico" },

			/**
			 * Stylesheet links
			 */
			{ rel: "preload", href: "static/css/__default_extra.css", as: "style" },
			{ rel: "stylesheet", href: "static/css/__default_extra.css" },

			{
				rel: "preload",
				href: "static/lib/material-icons/material-icons.css",
				as: "style",
			},
			{ rel: "stylesheet", href: "static/lib/material-icons/material-icons.css" },

			{ rel: "preload", href: "static/lib/gfonts/gfonts.css", as: "style" },
			{ rel: "stylesheet", href: "static/lib/gfonts/gfonts.css" },
			// 'https://fonts.googleapis.com/icon?family=Material+Icons',
			// 'https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i&display=swap
		],
		scripts: [],
	},
	body: {
		scripts: [],
		snippet: "",
	},
};
