(function () {
	var domElem = document.querySelector(
		"#videojs-mediacms-videojs-plugin-player"
	);

	var MediaPlayer = window["mediacms-player"].MediacmsPlayer;

	new MediaPlayer(
		domElem,
		{
			// enabledTouchControls: false,
			// preload: 'auto',
			subtitles: {
				on: true,
				languages: [
					{
						src: "http://localhost:8080/https://demo.mediacms.io/media/original/subtitles/user/styiannis/elephants-dream-subtitles-en.vtt",
						srclang: "en",
						label: "English",
					},
					{
						src: "http://localhost:8080/https://demo.mediacms.io/media/original/subtitles/user/styiannis/elephants-dream-subtitles-el.vtt",
						srclang: "gr",
						label: "Ελληνικά",
					},
				],
			},
			sources: [
				{
					src: "https://demo.mediacms.io/media/encoded/13/styiannis/ab611e4a2bcc43308374534b758a7705.ab611e4a2bcc43308374534b758a7705.Elephants_Dream_2006_1080p24.webm.1080p.vp9.webm.mp4" /*, encodings_status: "success"*/,
				},
			],
			poster:
				"https://demo.mediacms.io/media/original/thumbnails/user/styiannis/ab611e4a2bcc43308374534b758a7705.Elephants_Dream_2006_1080p24.webm.1080p.vp9.webm_HZliTrd.jpg",
			autoplay: false,
			bigPlayButton: true,
			controlBar: { theaterMode: true },
			cornerLayers: {
				topLeft: null,
				topRight: null,
				bottomLeft: {},
				bottomRight: null,
			},
			previewSprite: {
				url: "https://demo.mediacms.io/media/original/thumbnails/user/styiannis/ab611e4a2bcc43308374534b758a7705.Elephants_Dream_2006_1080p24.webm.1080p.vp9.webmsprites_m5S46xu.jpg",
				frame: {
					width: 160,
					height: 90,
					seconds: 10,
				},
			},
		},
		{
			volume: 0.75,
			soundMuted: false,
			theaterMode: false,
			/*"theSelectedQuality": '2160',*/ theSelectedPlaybackSpeed: 1.25,
		},
		{
			Auto: {
				format: ["hsl"],
				url: [
					"http://localhost:8080/https://demo.mediacms.io/media/hls/ab611e4a2bcc43308374534b758a7705/master.m3u8",
				],
			},
			240: {
				format: ["hsl", "h264"],
				url: [
					"http://localhost:8080/https://demo.mediacms.io/media/hls/ab611e4a2bcc43308374534b758a7705/media-5/stream.m3u8",
					"https://demo.mediacms.io/media/encoded/19/styiannis/ab611e4a2bcc43308374534b758a7705.ab611e4a2bcc43308374534b758a7705.Elephants_Dream_2006_1080p24.webm.1080p.vp9.webm.mp4",
				],
			},
			360: {
				format: ["hsl", "h264"],
				url: [
					"http://localhost:8080/https://demo.mediacms.io/media/hls/ab611e4a2bcc43308374534b758a7705/media-4/stream.m3u8",
					"https://demo.mediacms.io/media/encoded/16/styiannis/ab611e4a2bcc43308374534b758a7705.ab611e4a2bcc43308374534b758a7705.Elephants_Dream_2006_1080p24.webm.1080p.vp9.webm.mp4",
				],
			},
			480: {
				format: ["hsl", "h264"],
				url: [
					"http://localhost:8080/https://demo.mediacms.io/media/hls/ab611e4a2bcc43308374534b758a7705/media-3/stream.m3u8",
					"https://demo.mediacms.io/media/encoded/13/styiannis/ab611e4a2bcc43308374534b758a7705.ab611e4a2bcc43308374534b758a7705.Elephants_Dream_2006_1080p24.webm.1080p.vp9.webm.mp4",
				],
			},
			720: {
				format: ["hsl", "h264"],
				url: [
					"http://localhost:8080/https://demo.mediacms.io/media/hls/ab611e4a2bcc43308374534b758a7705/media-2/stream.m3u8",
					"https://demo.mediacms.io/media/encoded/10/styiannis/ab611e4a2bcc43308374534b758a7705.ab611e4a2bcc43308374534b758a7705.Elephants_Dream_2006_1080p24.webm.1080p.vp9.webm.mp4",
				],
			},
			1080: {
				format: ["hsl", "h264", "vp9"],
				url: [
					"http://localhost:8080/https://demo.mediacms.io/media/hls/ab611e4a2bcc43308374534b758a7705/media-1/stream.m3u8",
					"https://demo.mediacms.io/media/encoded/7/styiannis/ab611e4a2bcc43308374534b758a7705.ab611e4a2bcc43308374534b758a7705.Elephants_Dream_2006_1080p24.webm.1080p.vp9.webm.mp4",
					"https://demo.mediacms.io/media/encoded/8/styiannis/ab611e4a2bcc43308374534b758a7705.ab611e4a2bcc43308374534b758a7705.Elephants_Dream_2006_1080p24.webm.1080p.vp9.webm.webm",
				],
			},
			1440: {},
			2160: {},
		},
		[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
		function (newState) {
			// console.warn(newState);
			// console.log(this);
		},
		function () {
			// console.warn("Clicked next");
		},
		function () {
			// console.warn("Clicked previous");
		}
	);
})();
