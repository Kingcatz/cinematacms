module.exports = {
	embeddedVideo: {
		initialDimensions: {
			width: 560, // In pixels.
			height: 315, // In pixels.
		},
	},
	headerBar: {
		hideLogin: false,
		hideRegister: false,
	},
	media: {
		actions: {
			share: true,
			report: true,
			like: true,
			dislike: true,
			download: true,
			save: true,
			comment: true,
		},
		shareOptions: [
			"embed",
			"fb",
			"tw",
			"whatsapp",
			"telegram",
			"reddit",
			"tumblr",
			"vk",
			"pinterest",
			"mix",
			"linkedin",
			"email",
		],
	},
	mediaItem: {
		size: "small", // Valid values: 'small', 'medium', 'large'
		hideDate: false,
		hideViews: false,
		hideAuthor: false,
		hideCategories: true,
	},
	playlists: {
		mediaTypes: ["audio", "video"],
	},
};
