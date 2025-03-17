module.exports = {
	id: "media-cms",
	title: "MediaCMS Demo",
	url: "https://demo.mediacms.io",
	api: "https://demo.mediacms.io/api/v1",
	theme: {
		mode: "light", // Valid values: 'light', 'dark'.
		switch: {
			position: "header", // Valid values: 'header', 'sidebar'.
		},
	},
	logo: {
		lightMode: {
			svg: "./static/images/__default-logos/logo_dark.svg",
			img: "./static/images/__default-logos/logo_dark.png",
		},
		darkMode: {
			svg: "./static/images/__default-logos/logo_light.svg",
			img: "./static/images/__default-logos/logo_light.png",
		},
	},
	pages: {
		latest: {
			title: "Recent uploads",
		},
		featured: {
			title: "Featured",
		},
		recommended: {
			title: "Recommended",
		},
		members: {
			title: "Members",
		},
	},
	userPages: {
		liked: {
			title: "Liked media",
		},
		history: {
			title: "History",
		},
	},
	taxonomies: {
		tags: {
			title: "Tags",
		},
		categories: {
			title: "Categories",
		},
	},
};
