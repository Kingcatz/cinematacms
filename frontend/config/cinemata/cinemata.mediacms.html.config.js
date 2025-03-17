module.exports = {
	head: {
		meta: [
			{ charset: "utf-8" },
			{ content: "ie=edge", "http-equiv": "x-ua-compatible" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ name: "theme-color", content: "#122537" },
			{ name: "msapplication-TileColor", content: "#122537" },
			{
				name: "msapplication-config",
				content: "favicons/browserconfig.xml",
			},
			// { name: 'apple-mobile-web-app-title', content: 'Cinemata', },
			// { name: 'application-name', content: 'Cinemata', },
		],
		links: [
			/**
			 * Manifest file link.
			 */
			{ rel: "manifest", href: "static/favicons/site.webmanifest?v=1.0" },

			/**
			 * Favicon links.
			 *
			 * @see {link: https://realfavicongenerator.net}
			 */
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "static/favicons/apple-touch-icon.png?v=1.0",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "static/favicons/favicon-32x32.png?v=1.0",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "static/favicons/favicon-16x16.png?v=1.0",
			},
			{
				rel: "mask-icon",
				href: "static/favicons/safari-pinned-tab.svg?v=1.0",
				color: "#122537",
			},
			{ rel: "shortcut icon", href: "static/favicons/favicon.ico?v=1.0" },

			/**
			 * Stylesheet links
			 */
			{ rel: "preload", href: "static/css/_extra.css", as: "style" },
			{ rel: "stylesheet", href: "static/css/_extra.css" },

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
			{ rel: "preload", href: "static/lib/Amulya/css/amulya.css", as: "style" },
			{ rel: "stylesheet", href: "static/lib/Amulya/css/amulya.css" },
			{
				rel: "preload",
				href: "static/lib/Facultad/Facultad-Regular.css",
				as: "style",
			},
			{ rel: "stylesheet", href: "static/lib/Facultad/Facultad-Regular.css" },
		],
		scripts: [],
	},
	body: {
		scripts: [],
		snippet: "",
	},
};
