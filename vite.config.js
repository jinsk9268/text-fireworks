import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	base: "/text-fireworks/",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	server: {
		host: "0.0.0.0",
		port: 5173,
	},
});
