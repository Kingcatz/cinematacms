import videojs, { VideoJsPlayer } from "video.js";

import { setControlsComponents } from "./setControlsComponents";
import { setCornerLayersComponents } from "./setCornerLayersComponents";

import {
	ActionsAnimations,
	LoadedPercentage,
	LoadingSpinner,
	VolumeDisplay,
} from "../components/";

export function setComponents(
	player: VideoJsPlayer,
	state: mediacmsVjsPlugin.State,
	options: mediacmsVjsPlugin.InputOptions
) {
	const defaultLoadingSpinner = player.getChild("LoadingSpinner");

	if (undefined !== defaultLoadingSpinner) {
		player.removeChild(defaultLoadingSpinner);
	}

	videojs.registerComponent("VolumeDisplay", VolumeDisplay);
	videojs.registerComponent("LoadingSpinner", LoadingSpinner);
	videojs.registerComponent("LoadedPercentage", LoadedPercentage);
	videojs.registerComponent("ActionsAnimations", ActionsAnimations);

	player.addChild("VolumeDisplay");
	player.addChild("ActionsAnimations");
	player.addChild("LoadingSpinner");
	player.addChild("LoadedPercentage");

	setCornerLayersComponents(player, options.cornerLayers);

	setControlsComponents(player, state, options);
}
