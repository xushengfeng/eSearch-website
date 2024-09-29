const { resolve } = require("node:path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                download: resolve(__dirname, "download.html"),
                ocr: resolve(__dirname, "ocr.html"),
            },
        },
    },
    css: { transformer: "lightningcss" },
});
