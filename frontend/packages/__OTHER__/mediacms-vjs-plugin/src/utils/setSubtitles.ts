import videojs from "video.js";

export function setSubtitles(
	player: videojs.Player,
	subtitles: mediacmsVjsPlugin.ISettingsSubtitles
) {
	if (subtitles.on && subtitles.languages.length) {
		const defaultLanguages = [];

		let i;
		const tracks = player.textTracks();

		for (i = 0; i < tracks.length; i++) {
			defaultLanguages.push(tracks[i].language);
		}

		i = 1; // Exclude 'off' language option.
		while (i < subtitles.languages.length) {
			if (-1 === defaultLanguages.indexOf(subtitles.languages[i].srclang)) {
				player.addRemoteTextTrack(
					{
						kind: "subtitles",
						label: subtitles.languages[i].label,
						language: subtitles.languages[i].srclang,
						src: subtitles.languages[i].src,
					},
					true
				);
			}

			i += 1;
		}
	}
}
