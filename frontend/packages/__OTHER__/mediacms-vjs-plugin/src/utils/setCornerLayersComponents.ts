import { VideoJsPlayer } from "video.js";

import {
	TopLeftCornerLayer,
	TopRightCornerLayer,
	BottomLeftCornerLayer,
	BottomRightCornerLayer,
} from "../components";

export function setCornerLayersComponents(
	player: VideoJsPlayer,
	cornerLayersOptions?: mediacmsVjsPlugin.ISettingsCornersLayers
) {
	if (!cornerLayersOptions) {
		return;
	}

	if (cornerLayersOptions.topLeft) {
		player.addChild(
			new TopLeftCornerLayer(player, { content: cornerLayersOptions.topLeft })
		);
	}

	if (cornerLayersOptions.topRight) {
		player.addChild(
			new TopRightCornerLayer(player, { content: cornerLayersOptions.topRight })
		);
	}

	if (cornerLayersOptions.bottomLeft) {
		player.addChild(
			new BottomLeftCornerLayer(player, {
				content: cornerLayersOptions.bottomLeft,
			})
		);
	}

	if (cornerLayersOptions.bottomRight) {
		player.addChild(
			new BottomRightCornerLayer(player, {
				content: cornerLayersOptions.bottomRight,
			})
		);
	}
}
