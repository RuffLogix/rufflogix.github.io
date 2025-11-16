// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	site: "https://rufflogix.github.io",

	// base: "/rufflogix.github.io",
	build: {
		assets: "_astro/[name].[hash][extname]",
		inlineStylesheets: "auto", // Inline small CSS files
	},

	vite: {
		plugins: [tailwindcss()],
		build: {
			cssCodeSplit: true, // Split CSS per component
			sourcemap: false, // Disable sourcemaps in production
			minify: "esbuild", // Use esbuild for faster builds (default)
			rollupOptions: {
				output: {
					assetFileNames: "assets/[name].[hash][extname]",
					chunkFileNames: "assets/[name].[hash].js",
					entryFileNames: "assets/[name].[hash].js",
					manualChunks: {
						// Separate vendor chunks for better caching
						gsap: ["gsap"],
						"react-vendor": ["react", "react-dom"],
						lucide: ["lucide-astro", "lucide-react"],
					},
				},
			},
			// Optimize chunk size warnings
			chunkSizeWarningLimit: 1000,
		},
		// Enable build optimizations
		optimizeDeps: {
			include: ["gsap", "react", "react-dom"],
			exclude: ["@astrojs/react"],
		},
	},

	// Performance optimizations
	// experimental: {
	//   optimizeHoistedScript: true,
	// },

	// Enable compression and optimizations
	compressHTML: true,

	integrations: [
		react({
			// Only hydrate interactive components
			experimentalReactChildren: true,
		}),
	],
});
