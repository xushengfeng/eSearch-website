const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                nested: resolve(__dirname, "en.html"),
                plugin: resolve(__dirname, "plugin.html"),
                download: resolve(__dirname, "download.html"),
                ocr: resolve(__dirname, "ocr.html"),
            },
        },
    },
});
