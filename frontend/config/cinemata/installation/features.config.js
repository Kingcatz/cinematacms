module.exports = {
	embeddedVideo: {
		initialDimensions: {
			width: 768, // In pixels.
			height: 432, // In pixels.
		},
	},
	headerBar: {
		hideLogin: false,
		hideRegister: true,
	},
	sideBar: {
		hideTagsLink: true,
	},
	media: {
		actions: {
			share: true,
			report: true,
			like: true,
			dislike: false,
			download: true,
			save: true,
			comment: true,
		},
		shareOptions: [
			"embed",
			"email",
			"fb",
			"tw",
			"whatsapp",
			"telegram",
			"linkedin",
			"reddit",
			"tumblr",
			"pinterest",
		],
	},
	mediaItem: {
		size: "medium", // Valid values: 'small', 'medium', 'large'
		hideDate: false,
		hideViews: false,
		hideAuthor: false,
		hideCategories: true,
	},
	playlists: {
		mediaTypes: ["video"],
	},
};
