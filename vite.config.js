const { resolve } = require("node:path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                download: resolve(__dirname, "download.html"),
            },
        },
    },
    css: { transformer: "lightningcss" },
});
