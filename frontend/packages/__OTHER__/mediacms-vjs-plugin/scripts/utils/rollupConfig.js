import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import visualizer from "rollup-plugin-visualizer";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import postcssUrl from "postcss-url";

const path = require("path");

export default function (input, outputs) {
	return function (name, external, globals, sourcemap) {
		return function (visualizerDir) {
			return Object.keys(outputs).map((format) => {
				const ret = {
					input,
					output: {
						file: outputs[format],
						format,
						name,
						globals,
						sourcemap,
					},
					external,
					plugins: [
						postcss({
							extract: true,
							minimize: false,
							plugins: [
								postcssUrl({
									url: "inline",
								}),
							],
						}),
						peerDepsExternal(),
						resolve(),
						commonjs(),
						typescript(),
						json(),
					],
				};

				if (typeof visualizerDir === "string") {
					ret.plugins.push(
						visualizer({
							title: outputs[format],
							filename: path.join(
								path.normalize(visualizerDir),
								`${path.parse(outputs[format]).base}.html`
							),
							// sourcemap: true,
							// json: true,
							// gzipSize : true,
							// brotliSize: true,
						})
					);
				}

				return ret;
			});
		};
	};
}
