import rollupConfig from "./utils/rollupConfig.js";
import pkg from "../package.json";

const input = "./src/index.ts";

const external = [
	...Object.keys(pkg.dependencies || {}),
	...Object.keys(pkg.peerDependencies || {}),
];

export default rollupConfig(input, {
	cjs: pkg.main,
	// esm: pkg.module,
	// iife: pkg.iife,
	umd: pkg.umd,
})(
	"mediacms-player",
	external,
	{ "video.js": "videojs", "mediacms-vjs-plugin": "mediacms-vjs-plugin" },
	true
);
