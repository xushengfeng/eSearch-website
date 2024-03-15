import { el } from "redom";

let infintyBento: { x: number; y: number; w: number; h: number; el: HTMLElement }[] = [];
const blockSize = 360;
const gap = 10;

const b = document.getElementById("bento");

function r(p: { x: number; y: number }, repeatX: number, repeatY: number) {
    for (let i of infintyBento) {
        const gapX = repeatX - i.w;
        const gapY = repeatY - i.h;
        let cx = Math.floor((p.x - i.x) / (i.w + gapX));
        let cy = Math.floor((p.y - i.y) / (i.h + gapY));
        if (i.x + cx * (i.w + gapX) + i.w < p.x) cx++;
        if (i.y + cy * (i.h + gapY) + i.h < p.y) cy++;
        let el = i.el;
        el.style.left = (i.x + cx * (i.w + gapX)) * blockSize + gap + "px";
        el.style.top = (i.y + cy * (i.h + gapY)) * blockSize + gap + "px";
        el.style.width = i.w * blockSize - gap * 2 + "px";
        el.style.height = i.h * blockSize - gap * 2 + "px";
        console.log(cx, cy);
    }
}

let x = 0;
let y = 0;
const repeatX = 10;
const repeatY = 6;

document.onwheel = (e) => {
    x -= e.deltaX;
    y -= e.deltaY;
    b.style.left = x + "px";
    b.style.top = y + "px";
    r({ x: -x / blockSize, y: -y / blockSize }, repeatX, repeatY);
};

function initBento() {
    b.innerHTML = "";

    for (let i of infintyBento) {
        b.append(i.el);
    }

    r({ x: 0, y: 0 }, repeatX, repeatY);
}

const navTipEl = el("div");
navTipEl.append("滚动或拖动来查看");

const downloadEl = el("div");

// 根据平台在首页显示下载按钮
var userAgent = navigator.userAgent.toLowerCase();
var platform = "Unknown";
if (userAgent.indexOf("win") > -1) {
    platform = "Windows";
} else if (userAgent.indexOf("iphone") > -1) {
    platform = "iOS";
} else if (userAgent.indexOf("mac") > -1) {
    platform = "macOS";
} else if (userAgent.indexOf("linux") > -1) {
    if (userAgent.indexOf("android") > -1) {
        platform = "Android";
    } else {
        platform = "Linux";
    }
} else {
    platform = "Unknown";
}

const platformSelect = el("select", [
    el("option", { value: "Windows" }, "Windows"),
    el("option", { value: "macOS" }, "macOS"),
    el("option", { value: "Linux" }, "Linux"),
]);

const mainDownload = el("div");

function cPlatform(platform: string) {
    let d = "下载";
    switch (platform) {
        case "Windows":
            mainDownload.innerHTML = `<button id="-win32-x64.exe">${d}</button>`;
            platformSelect.value = "Windows";
            break;
        case "Linux":
            mainDownload.innerHTML = `<button id="-linux-amd64.deb">${d} deb</button><button id="-linux-x86_64.rpm">${d} rpm</button>`;
            platformSelect.value = "Linux";
            break;
        case "macOS":
            mainDownload.innerHTML = `<button id="-darwin-x64.dmg">${d}</button>`;
            platformSelect.value = "macOS";
            break;
        case "Android":
            mainDownload.innerHTML = `<button id="-win32-x64.exe">${d}</button>`;
            platformSelect.value = "Windows";
            break;
        case "iOS":
            mainDownload.innerHTML = `<button id="-darwin-x64.dmg">${d}</button>`;
            platformSelect.value = "macOS";
            break;
    }
}

cPlatform(platform);

platformSelect.oninput = () => {
    cPlatform(platformSelect.value);
};

downloadEl.append(mainDownload, platformSelect);

const ocrEl = el("div");

const logEl = el("div");

const recordEl = el("div");

const y以图搜图 = el("div");

const x形状 = el("div");

const translate = el("div");

infintyBento.push({ x: 0, y: 0, w: 1, h: 1, el: navTipEl });
infintyBento.push({ x: 0, y: 1, w: 2, h: 1, el: downloadEl });
infintyBento.push({ x: 1, y: -1, w: 2, h: 2, el: ocrEl });
infintyBento.push({ x: 1, y: 2, w: 1, h: 2, el: logEl });
infintyBento.push({ x: 0, y: -1, w: 1, h: 1, el: recordEl });
infintyBento.push({ x: -1, y: -1, w: 1, h: 1, el: y以图搜图 });
infintyBento.push({ x: 2, y: 1, w: 1, h: 1, el: x形状 });
infintyBento.push({ x: 2, y: 2, w: 2, h: 2, el: translate });

infintyBento.push({ x: 3, y: -1, w: 1, h: 1, el: el("div") }); // 搜索引擎
infintyBento.push({ x: 3, y: 0, w: 1, h: 1, el: el("div") }); // 背景模糊
infintyBento.push({ x: 3, y: 1, w: 1, h: 1, el: el("div") }); // start
infintyBento.push({ x: 2, y: -2, w: 1, h: 1, el: el("div") }); // ocr语言
infintyBento.push({ x: 0, y: 2, w: 1, h: 1, el: el("div") }); // 跨平台
infintyBento.push({ x: 0, y: 3, w: 1, h: 1, el: el("div") }); // 开源

initBento();
