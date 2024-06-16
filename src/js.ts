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
    }
}

let x = 0;
let y = 0;
const repeatX = 10;
const repeatY = 6;

document.onwheel = (e) => {
    if (log2El.contains(e.target as HTMLElement)) return;
    x -= e.deltaX;
    y -= e.deltaY;
    moveB(x, y);
};

let startE: PointerEvent;
let startP = { x, y };
b.onpointerdown = (e) => {
    startE = e;
    startP = { x, y };
};
b.onpointermove = (e) => {
    if (!startE) return;
    x = startP.x + e.clientX - startE.clientX;
    y = startP.y + e.clientY - startE.clientY;
    moveB(x, y);
};
window.onpointerup = (e) => {
    startE = null;
};

function moveB(x: number, y: number) {
    b.style.left = x + "px";
    b.style.top = y + "px";
    r({ x: -x / blockSize, y: -y / blockSize }, repeatX, repeatY);

    pickColorXY();
    logClip();
}

function moveToRect(r: { x: number; y: number; w: number; h: number }) {
    x = window.innerWidth / 2 - (r.x * blockSize + (r.w * blockSize) / 2);
    y = window.innerHeight / 2 - (r.y * blockSize + (r.h * blockSize) / 2);
    moveB(x, y);
}

function fillBento() {
    let smallL: { x: number; y: number; has: boolean }[] = [];
    for (let i = 0; i < repeatX; i++) {
        for (let j = 0; j < repeatY; j++) {
            smallL.push({ x: i, y: j, has: false });
        }
    }
    for (let i of infintyBento) {
        let x = i.x < 0 ? repeatX + i.x : i.x;
        let y = i.y < 0 ? repeatY + i.y : i.y;
        for (let ix = 0; ix < i.w; ix++) {
            for (let iy = 0; iy < i.h; iy++) {
                let nx = (x + ix) % repeatX;
                let ny = (y + iy) % repeatY;
                smallL.find((v) => v.x === nx && v.y === ny).has = true;
            }
        }
    }
    for (let i of smallL) {
        if (!i.has) {
            infintyBento.push({ x: i.x, y: i.y, w: 1, h: 1, el: el("div", `#${i.x},${i.y}`) });
        }
    }
}

function initBento() {
    b.innerHTML = "";

    fillBento();

    for (let i of infintyBento) {
        b.append(i.el);
    }

    moveB(x, y);
}

let lan = navigator.language || "zh-HANS";

let lanMap: { [key: string]: string } = {};

if (lan.split("-")[0] != "zh") {
    fetch("/language/en.json")
        .then((res) => res.json())
        .then((data) => {
            lanMap = data;
        });
}

const t = (text: string) => {
    if (lan.split("-")[0] === "zh") {
        return text;
    } else {
        return lanMap[text];
    }
};

const navTipEl = el("div", { class: "logo" });
import logo from "../assets/icon.svg";
navTipEl.append(
    el("img", { src: logo, width: 300 }),
    el("div", el("h1", "eSearch", { style: { "font-size": "3rem" } }), el("h2", t("识屏 · 搜索")))
);

window.onload = () => {
    navTipEl.style.transform = "scale(1)";
};
navTipEl.ontransitionend = () => {
    navTipEl.style.transition = "0s";
};

const downloadEl = el("div", { class: "download" });

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

const useFastGitEl = el("input", {
    type: "checkbox",
    oninput: () => {
        useFastGit(useFastGitEl.checked);
    },
});

const mainDownload = el("div");

var v = "1.11.0";
var up_time = 1702051200000;
var filesObject: { [key: string]: { url: string; size: string; fastUrl?: string } } = {
    "-win32-x64.zip": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-win32-x64.zip`,
        size: `未知`,
    },
    "-win32-x64.exe": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-win32-x64.exe`,
        size: `未知`,
    },
    "-linux-x64.tar.gz": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-linux-x64.tar.gz`,
        size: `未知`,
    },
    "-linux-x64.deb": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-linux-x64.deb`,
        size: `未知`,
    },
    "-linux-x64.rpm": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-linux-x64.rpm`,
        size: `未知`,
    },
    "-linux-x64.AppImage": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-linux-x64.AppImage`,
        size: `未知`,
    },
    ".aur": { url: ``, size: `未知` },
    "-darwin-x64.dmg": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-darwin-x64.dmg`,
        size: `未知`,
    },
    "-darwin-x64.zip": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-darwin-x64.zip`,
        size: `未知`,
    },
};
var fileType = Object.keys(filesObject);

function cPlatform(platform: string) {
    mainDownload.innerHTML = "";
    switch (platform) {
        case "Windows":
            mainDownload.append(getDownloadItem("-win32-x64.exe", "exe"), getDownloadItem("-win32-x64.zip", "压缩包"));
            platformSelect.value = "Windows";
            break;
        case "Linux":
            mainDownload.append(
                getDownloadItem("-linux-x64.deb", "deb"),
                getDownloadItem("-linux-x64.rpm", "rpm"),
                getDownloadItem("-linux-x64.AppImage", "AppImage")
            );
            platformSelect.value = "Linux";
            break;
        case "macOS":
            mainDownload.append(
                getDownloadItem("-darwin-x64.dmg", "dmg"),
                getDownloadItem("-darwin-x64.zip", "压缩包")
            );
            platformSelect.value = "macOS";
            break;
        case "Android":
            cPlatform("Windows");
            break;
        case "iOS":
            cPlatform("macOS");
            break;
    }
}

let fastUrl = lan.split("-")[0] === "zh";

cPlatform(platform);

platformSelect.oninput = () => {
    cPlatform(platformSelect.value);
};

function getDownloadItem(type: string, text: string) {
    return el("a", t(text), {
        href: fastUrl ? filesObject[type].fastUrl : filesObject[type].url,
        download: true,
        target: "_blank",
        "data-type": type,
    });
}

let dev = false;

// 获取软件资源
let result: any[];
let devResult: any[];
fetch("https://api.github.com/repos/xushengfeng/eSearch/releases?per_page=100", { method: "GET" })
    .then((response) => response.json())
    .then((r) => releasesX(r))
    .catch((error) => {
        fetch("/releases.json", { method: "GET" })
            .then((response) => response.json())
            .then((r) => releasesX(r));
    });

const releasesX = (r) => {
    devResult = r;
    result = structuredClone(r);

    if (!dev)
        for (let i in result) {
            if (result[i].prerelease) {
                delete result[i];
            }
        }
    result = result.flat();
    for (let i in result[0].assets) {
        let url = <string>result[0].assets[i].browser_download_url;
        let name = <string>result[0].assets[i].name;
        let x = fileType.find((i) => name.includes(i));
        if (!x) continue;
        filesObject[x].size = (result[0].assets[i].size / 1024 / 1024).toFixed(2);
        filesObject[x].url = url;
    }
    console.log(filesObject);
    useFastGit(fastUrl);

    up_time = new Date(result[0].published_at).getTime();
    v = result[0].name;

    showLog();
};

function fasthub(url: string) {
    const proxy_list: { url: string; replace: boolean }[] = [
        { url: "https://git.xfj0.cn/", replace: false },
        { url: "https://github.moeyy.xyz/", replace: false },
        { url: "https://kkgithub.com/", replace: true },
    ];
    let proxy = proxy_list[Math.floor(Math.random() * proxy_list.length)];
    if (proxy.replace) {
        return url.replace("https://github.com/", proxy.url);
    } else {
        return proxy.url + url;
    }
}

function useFastGit(b: boolean) {
    if (b)
        for (let i in filesObject) {
            filesObject[i].fastUrl = fasthub(filesObject[i].url);
        }

    mainDownload.querySelectorAll("a").forEach((a) => {
        let o = filesObject[a.getAttribute("data-type")];
        a.href = b ? o.fastUrl : o.url;
    });
}

if (lan.split("-")[0] === "zh") {
    useFastGit(true);
    useFastGitEl.checked = true;
}

function devEl() {
    return el("span", "测试版", {
        style: {
            "font-size": "12px",
            background: "#e9c018",
            color: "#fff",
            padding: "2px",
            "border-radius": "4px",
        },
    });
}

function title(string: string, posi?: "bottom", dev?: boolean) {
    const s = el("h2", { class: "title" }, t(string));
    if (posi === "bottom") s.classList.add("b");
    if (dev) {
        s.append(devEl());
    }
    return s;
}
function subtitle(string: string) {
    const s = el("h3", { class: "subtitle" }, t(string));
    return s;
}

const center = { class: "center" };

downloadEl.append(
    el("span", { class: "title" }, t("立即下载")),
    el("div", el("div", platformSelect, el("label", useFastGitEl, t("使用加速链接下载"))), mainDownload)
);

const ocrEl = el("div", { class: "ocr" }, title("离线OCR", "bottom"));

const log2El = el("div");
const logEl = el("div", title("更新记录"), log2El, { class: "log" });

import markdownit from "markdown-it";
function showLog() {
    const md = markdownit({
        html: true,
        linkify: true,
        typographer: true,
    });
    const defaultRender =
        md.renderer.rules.link_open ||
        function (tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const aIndex = tokens[idx].attrIndex("target");
        if (aIndex < 0) {
            tokens[idx].attrPush(["target", "_blank"]);
        } else {
            tokens[idx].attrs[aIndex][1] = "_blank";
        }
        return defaultRender(tokens, idx, options, env, self);
    };
    log2El.innerHTML = "";
    for (let i in result) {
        const li = el("li");
        const h = el("span");
        h.className = "log_v";
        h.innerText = result[i].tag_name;
        li.appendChild(h);
        const div = el("div");
        div.innerHTML = md.render(result[i].body);
        li.append(h, div);
        log2El.appendChild(li);
    }
}

import windowImg from "../assets/window.svg";
import wallPaper1 from "../assets/wallpaper/win11.jpg";
import wallPaper2 from "../assets/wallpaper/macos.jpg";
const recordEl = el(
    "div",
    { class: "record" },
    el("img", { src: wallPaper1, class: "wp" }),
    el("img", { src: windowImg, ...center }),
    el("div", { ...center })
);

import photoImg from "../assets/a-mountain.svg";
import photoImg1 from "../assets/a-mountain1.svg";
import photoImg2 from "../assets/colorful-waves-from-center-diverging-in-all-direct.svg";
const y以图搜图 = el(
    "div",
    title("以图搜图"),
    aiTip(),
    { class: "search_photo" },
    el("div", center, el("img", { src: photoImg2 })),
    el("div", center, el("img", { src: photoImg })),
    el("div", center, el("div", el("img", { src: photoImg }))),
    el("div", center, el("div", el("img", { src: photoImg }))),
    el("div", center, el("div", el("img", { src: photoImg }))),
    el("div", center, el("div", el("img", { src: photoImg1 })))
);

const x形状 = el("div", title("多种形状"), { class: "shape" });
import shape_arrow from "../assets/shape/arrow.svg";
import shape_circle from "../assets/shape/circle.svg";
import shape_rect from "../assets/shape/rect.svg";
import shape_line from "../assets/shape/line.svg";
import shape_polyline from "../assets/shape/polyline.svg";
import shape_polygon from "../assets/shape/polygon.svg";
import shape_number from "../assets/shape/number.svg";
x形状.append(imgL([shape_arrow, shape_circle, shape_rect, shape_line, shape_polyline, shape_polygon, shape_number]));

function imgL(l: string[]) {
    const d = document.createDocumentFragment();
    for (let i of l) {
        d.append(el("img", { src: i }));
    }
    return d;
}

import t_bing from "../assets/icons/translate/bing.svg";
import t_baidu from "../assets/icons/translate/baidu.svg";
import t_caiyun from "../assets/icons/translate/caiyun.svg";
import t_chatgpt from "../assets/icons/translate/chatgpt.svg";
import t_deepl from "../assets/icons/translate/deepl.svg";
import t_gemini from "../assets/icons/translate/gemini.svg";
import t_niu from "../assets/icons/translate/niu.svg";
import t_youdao from "../assets/icons/translate/youdao.svg";

const translate = el(
    "div",
    { class: "translate" },
    title("翻译"),
    subtitle("反射"),
    el("p", "你好世界=>Hello world=>你好世界"),
    subtitle("多语言"),
    subtitle("多引擎对照")
);
translate.append(el("div", imgL([t_chatgpt, t_gemini, t_deepl, t_caiyun, t_bing, t_youdao, t_baidu, t_niu])));

function t条幅(text: string) {
    let s = el("div", { class: "slide" });
    s.append(el("span", text), el("span", text));
    return s;
}

infintyBento.push({ x: -1, y: 0, w: 2, h: 1, el: navTipEl });
infintyBento.push({ x: 0, y: 1, w: 2, h: 1, el: downloadEl });
infintyBento.push({ x: 1, y: -1, w: 2, h: 2, el: ocrEl });
infintyBento.push({ x: 1, y: 2, w: 1, h: 2, el: logEl });
infintyBento.push({ x: 0, y: -1, w: 1, h: 1, el: recordEl });
infintyBento.push({ x: -1, y: -1, w: 1, h: 1, el: y以图搜图 });
infintyBento.push({ x: 2, y: 1, w: 1, h: 1, el: x形状 });
infintyBento.push({ x: 2, y: 2, w: 2, h: 2, el: translate });

const noBorder = { style: { border: "none" } };
infintyBento.push({
    x: 1,
    y: -1,
    w: 1,
    h: 1,
    el: el("div", noBorder, el("div", center, subtitle("🛡隐私"), el("p", "本地运行，不依赖网络"))),
});
infintyBento.push({
    x: 2,
    y: -1,
    w: 1,
    h: 1,
    el: el("div", noBorder, el("div", center, subtitle("🎯准确"), el("p", "使用PaddleOCR v4模型"))),
});
infintyBento.push({
    x: 2,
    y: 0,
    w: 1,
    h: 1,
    el: el("div", noBorder, el("div", center, subtitle("🆓0元/万字"), el("p", "不限量使用"))),
});
infintyBento.push({
    x: 1,
    y: 0,
    w: 1,
    h: 1,
    el: el(
        "div",
        noBorder,
        el(
            "div",
            center,
            el("p", "基于开源的", el("a", { href: "https://github.com/paddle/paddleocr" }, "PaddleOCR")),
            el("p", "开箱即用"),
            el("a", { href: "https://github.com/xushengfeng/eSearch-OCR" }, el("p", "js库"))
        )
    ),
});

import bingImg from "../assets/icons/bing.svg";
import baiduImg from "../assets/icons/baidu.svg";
import googleImg from "../assets/icons/google.svg";
import yandexImg from "../assets/icons/yandex.svg";
infintyBento.push({
    x: 3,
    y: -1,
    w: 1,
    h: 1,
    el: el(
        "div",
        { class: "search_engine" },
        title("自定义搜索引擎"),
        el("img", { src: baiduImg }),
        el("img", { src: yandexImg }),
        el("img", { src: googleImg }),
        el("img", { src: bingImg })
    ),
}); // 搜索引擎

import bg1 from "../assets/bookshelf.svg";
import bg2 from "../assets/blackhole.svg";
import bg3 from "../assets/forest.svg";
const virtualBgEl = el(
    "div",
    el("div"),
    el("img", { src: bg2 }),
    el("img", { src: bg3 }),
    el("div", el("img", { src: wallPaper1 }))
);
infintyBento.push({
    x: 3,
    y: 0,
    w: 1,
    h: 1,
    el: el(
        "div",
        { class: "virtual_bg" },
        title("虚拟背景"),
        el("img", { src: bg1 }),
        virtualBgEl,
        el("img", { src: manImg }),
        aiTip()
    ),
});
let virtualBgI = 1;
setInterval(() => {
    virtualBgEl.style.left = virtualBgI * 100 + "%";
    virtualBgI--;
    if (virtualBgI === -4) virtualBgI = 1;
}, 1600);
infintyBento.push({
    x: 3,
    y: 1,
    w: 1,
    h: 1,
    el: el(
        "div",
        { class: "star" },
        el("a", { href: "https://github.com/xushengfeng/eSearch", target: "_blank" }, [
            el("span", "🌟"),
            el("span", t("去GitHub点Star")),
            el("span", t("或fork，或提issue，这是我开发的动力")),
        ])
    ),
});
infintyBento.push({
    x: 2,
    y: -2,
    w: 1,
    h: 1,
    el: el(
        "div",
        { class: "lang" },
        el("a", t("下载OCR语言包"), { target: "_blank", href: "./ocr.html" }),
        t条幅("界面和OCR支持多种语言"),
        t条幅("Interface and OCR support multiple languages "),
        t条幅("Interface et OCR prennent en charge plusieurs langues "),
        t条幅("Interfaz y OCR soportan varios idiomas "),
        t条幅("интерфейс и OCR поддерживает несколько языков ")
    ),
});
import windowsImg from "../assets/Windows.svg";
import linuxImg from "../assets/Linux.svg";
import macosImg from "../assets/macOS.svg";
import electronImg from "../assets/icons/Electron_Software_Framework_Logo.svg";
infintyBento.push({
    x: -1,
    y: 2,
    w: 2,
    h: 1,
    el: el(
        "div",
        title("跨平台"),
        { class: "platform" },
        el("img", { ...center, src: electronImg }),
        el(
            "div",
            { class: "center" },
            el("img", { src: windowsImg }),
            el("img", { src: linuxImg }),
            el("img", { src: macosImg })
        )
    ),
}); // 跨平台
import githubImg from "../assets/icons/Github.svg";
import giteeImg from "../assets/icons/Gitee.svg";
let codeBg = el("div");
const codeCharts = ["~", "<", ">", "?", "#", "@", "$", "&", "*", "%", "0", "*", "+", "-"];
let codeBgC = "";
for (let y = 0; y < 18; y++) {
    for (let x = 0; x < 100; x++) {
        const d = Math.sqrt((x - 50) ** 2 + (y - 9) ** 2);
        const feq = d / (30 * Math.sqrt(2));
        const code = codeCharts[Math.floor(Math.random() * codeCharts.length)];
        codeBgC += Math.random() < feq - 0.1 ? code : " ";
    }
    codeBgC += "\n";
}

codeBg.innerText = codeBgC;
infintyBento.push({
    x: -1,
    y: 3,
    w: 2,
    h: 1,
    el: el(
        "div",
        { class: "opensource" },
        codeBg,
        el(
            "div",
            { class: "center" },
            el(
                "a",
                { href: "https://github.com/xushengfeng/eSearch", target: "_blank" },
                el("img", { src: githubImg })
            ),
            el("a", { href: "https://gitee.com/xsf-root/eSearch", target: "_blank" }, el("img", { src: giteeImg }))
        )
    ),
}); // 开源
import devImg from "../assets/a-cube-filled-with-mechancial-elements.svg";
infintyBento.push({
    x: 1,
    y: 4,
    w: 1,
    h: 1,
    el: el(
        "div",
        { class: "dev" },
        title("新特性"),
        el("img", { src: devImg }),
        el(
            "a",
            {
                ...center,
                href: "https://github.com/xushengfeng/eSearch/releases",
                target: "_blank",
                onclick: () => {
                    dev = true;
                    releasesX(devResult);
                },
            },
            t("测试版尝鲜")
        )
    ),
});
infintyBento.push({
    x: 4,
    y: -1,
    w: 2,
    h: 1,
    el: el("div", title("贴图归位")),
});
infintyBento.push({
    x: -2,
    y: -1,
    w: 1,
    h: 2,
    el: el("div", title("AI识图", null, true)),
});
import Color from "color";
const allColorFormat = ["HEX", "RGB", "HSL", "HSV", "CMYK"];
// 色彩空间转换
function colorConversion(rgba: number[] | string, type: string): string {
    const color = new Color(rgba);
    if (color.alpha() !== 1) return "/";
    switch (type) {
        case "HEX":
            return color.hex();
        case "RGB":
            return color.rgb().string();
        case "HSL":
            const hsl = color.hsl().round().array();
            return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
        case "HSV":
            const hsv = color.hsv().round().array();
            return `hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)`;
        case "CMYK":
            const cmyk = color.cmyk().round().array();
            return `cmyk(${cmyk[0]}, ${cmyk[1]}, ${cmyk[2]}, ${cmyk[3]})`;
        default:
            return "";
    }
}
function pickColor(l: number[]) {
    let color = Color.rgb(l);
    let clipColorTextColor = color.alpha() == 1 ? (color.isLight() ? "#000" : "#fff") : "";
    let div = el("div", { style: { background: color.hex(), color: clipColorTextColor } });
    for (let i in allColorFormat) {
        div.append(el("div", colorConversion(color, allColorFormat[i])));
    }
    return div;
}

let canPickColor = false;
let lastPickColor = 0;
const pickColorCanvas = el("canvas");
const pickColorCanvasCtx = pickColorCanvas.getContext("2d", { willReadFrequently: true });
function pickColorXY() {
    if (!canPickColor) return;
    if (new Date().getTime() - lastPickColor < 100) return;
    lastPickColor = new Date().getTime();
    let x = pickColorBg.getBoundingClientRect().x;
    let y = pickColorBg.getBoundingClientRect().y;
    x = Math.max(0, Math.min(pickColorCanvas.width, x));
    y = Math.max(0, Math.min(pickColorCanvas.height, y));
    const color = pickColorCanvasCtx.getImageData(x, y, 1, 1).data;
    pickColorEl.innerHTML = "";
    pickColorEl.append(pickColor(Array.from(color)));
}
import photo from "../assets/p.jpg";
let img = document.createElement("img");
img.src = photo;
img.onload = () => {
    pickColorCanvas.width = img.naturalWidth;
    pickColorCanvas.height = img.naturalHeight;
    pickColorCanvasCtx.drawImage(img, 0, 0);
    canPickColor = true;
};
const pickColorEl = el("div", { class: "center" }, pickColor([58, 105, 255]));
const pickColorBg = el("div");
infintyBento.push({
    x: -1,
    y: 1,
    w: 1,
    h: 1,
    el: el("div", { class: "pick_color" }, pickColorBg, pickColorEl),
});
import qr from "../assets/qr.svg";
infintyBento.push({
    x: -1,
    y: 4,
    w: 1,
    h: 1,
    el: el("div", { class: "qr" }, el("img", { ...center, width: 200, src: qr })),
});
infintyBento.push({
    x: 4,
    y: 0,
    w: 1,
    h: 1,
    el: el("div", title("按键提示")),
});
function aiTip() {
    return el("span", t("此插画由AI绘制"), {
        style: {
            position: "absolute",
            bottom: "4px",
            right: "4px",
        },
    });
}

import scrollImg from "../assets/rockets-and-space-ship.svg";
const longClipEl = el("div", el("img", { src: scrollImg }));
function logClip() {
    const h = window.innerHeight - longClipEl.getBoundingClientRect().y - 100;
    longClipEl.style.height = Math.max(h, 200) + "px";
}
infintyBento.push({
    x: -2,
    y: 1,
    w: 1,
    h: 3,
    el: el("div", { class: "long_clip" }, title("滚动截屏"), longClipEl, aiTip()),
});
infintyBento.push({
    x: 6,
    y: -1,
    w: 2,
    h: 2,
    el: el("div", title("自动排版")),
});
infintyBento.push({
    x: 5,
    y: 0,
    w: 1,
    h: 1,
    el: el("div", title("鼠标穿透")),
});
import mutiScreen from "../assets/a-muti-screen-wall.svg";
infintyBento.push({
    x: 4,
    y: 1,
    w: 2,
    h: 1,
    el: el(
        "div",
        { class: "muti_screen" },
        title("多屏幕"),
        el("img", { src: mutiScreen }),
        el("img", { ...center, src: logo }),
        aiTip()
    ),
});
infintyBento.push({
    x: 4,
    y: 2,
    w: 1,
    h: 1,
    el: el("div", title("深色模式")),
});
infintyBento.push({
    x: 4,
    y: 3,
    w: 1,
    h: 1,
    el: el("div", title("滤镜")),
});
infintyBento.push({
    x: 5,
    y: 2,
    w: 1,
    h: 1,
    el: el("div", title("自由截屏", null, true)),
});
import film from "../assets/a-film-strip.svg";
infintyBento.push({
    x: 0,
    y: -2,
    w: 1,
    h: 1,
    el: el(
        "div",
        { class: "edit_record" },
        title("编辑录屏"),
        el("p", t("并把他们转为mp4、gif、webm……")),
        el(
            "div",
            el("img", { src: film }),
            el("img", { src: film }),
            el("img", { src: film }),
            el("img", { src: film })
        ),
        aiTip()
    ),
});
import manImg from "../assets/a-professor.svg";
infintyBento.push({
    x: 3,
    y: -2,
    w: 1,
    h: 1,
    el: el(
        "div",
        title("录制摄像头"),
        { class: "camera" },
        el("img", { src: wallPaper2, class: "wp" }),
        el("img", { src: windowImg, ...center }),
        el("div", el("img", { src: manImg }))
    ),
});
infintyBento.push({
    x: 6,
    y: 1,
    w: 1,
    h: 2,
    el: el("div", title("自定义界面")),
});
const syncSelect = el("div", { class: "center sync" });
infintyBento.push({
    x: 4,
    y: 4,
    w: 1,
    h: 1,
    el: el("div", title("同步选择"), syncSelect),
});
const testText = t("这是测试文字，在图片中选中的文字可以同步到编辑区");
const syncOCR = el("div", { class: "photo_text" });
syncOCR.append(testText.slice(0, 4), el("span", testText.slice(4, 6)), testText.slice(6));
const syncOCR2 = el("div");
syncOCR2.append(testText.slice(0, 4), el("span", testText.slice(4, 6)), testText.slice(6));
syncSelect.append(syncOCR, syncOCR2);

infintyBento.push({
    x: 8,
    y: 4,
    w: 1,
    h: 1,
    el: el(
        "div",
        title("关于"),
        el(
            "div",
            el(
                "a",
                { href: "https://www.netlify.com", target: "_blank" },
                el("img", { src: "https://www.netlify.com/v3/img/components/netlify-light.svg" })
            ),
            el("p", t("网站灵感来源："), el("a", "amie", { href: "https://www.amie.so/recap", target: "_blank" })),
            el(
                "p",
                t("此网站源码："),
                el("a", "GitHub", { href: "https://github.com/xushengfeng/eSearch-website/", target: "_blank" })
            ),
            el("p", "2021 - 2024"),
            el(
                "address",
                el("a", { href: "https://github.com/xushengfeng", target: "_blank" }, "xushengfeng"),
                el("br"),
                el("a", { href: "mailto:xushengfeng_zg@163.com" }, "xushengfeng_zg@163.com")
            )
        )
    ),
});

const cursorEl = el("div");
const ctrlEl = el(
    "div",
    { class: "ctrl" },
    cursorEl,
    title("精确控制"),
    el("p", el("span", { style: { "font-family": "code" } }, "↑↓←→"), "自由移动"),
    el("p", el("span", { style: { "font-family": "code" } }, "+-*/()"), "四则运算精确分割"),
    el("p", "放大到像素编辑")
);
infintyBento.push({
    x: 7,
    y: 1,
    w: 1,
    h: 1,
    el: ctrlEl,
});

for (let i = 0; i < 36; i++) {
    cursorEl.append(el("div"));
}

infintyBento.push({
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    el: el("div", title("快捷键"), el("p", "全局"), el("p", "截屏"), el("p", "编辑器"), el("p", "41种可自定义快捷键")),
});
infintyBento.push({
    x: 5,
    y: 4,
    w: 1,
    h: 1,
    el: el(
        "div",
        title("高效编辑"),
        el("p", "使用正则表达式替换"),
        el("p", "自定义js脚本处理文字", devEl()),
        el("p", "联动其他编辑器"),
        el(
            "span",
            {
                style: {
                    position: "absolute",
                    bottom: "0",
                    width: "100%",
                    left: "0",
                    "text-align": "center",
                    "font-size": "4rem",
                    "font-family": "code",
                },
            },
            "(t)=>λt"
        )
    ),
});
infintyBento.push({
    x: 6,
    y: 3,
    w: 2,
    h: 2,
    el: el("div", title("界面展示")),
});
infintyBento.push({
    x: 5,
    y: 3,
    w: 1,
    h: 1,
    el: el(
        "div",
        title("反馈"),
        el(
            "div",
            center,
            el(
                "div",
                el(
                    "a",
                    {
                        href: "https://github.com/xushengfeng/eSearch/issues/new?assignees=&labels=bug&projects=&template=bug_report.yaml&title=%E2%80%A6%E2%80%A6%E5%AD%98%E5%9C%A8%E2%80%A6%E2%80%A6%E9%94%99%E8%AF%AF",
                    },
                    t("错误报告")
                )
            ),
            el(
                "div",
                el(
                    "a",
                    {
                        href: "https://github.com/xushengfeng/eSearch/issues/new?assignees=&labels=%E6%96%B0%E9%9C%80%E6%B1%82&projects=&template=feature_request.md&title=%E5%BB%BA%E8%AE%AE%E5%9C%A8%E2%80%A6%E2%80%A6%E6%B7%BB%E5%8A%A0%E2%80%A6%E2%80%A6%E5%8A%9F%E8%83%BD%2F%E6%94%B9%E8%BF%9B",
                    },
                    t("功能建议")
                )
            )
        )
    ),
});

initBento();

moveToRect({ x: -1, y: 0, w: 2, h: 1 });

document.body.append(
    el(
        "div",
        { class: "tip" },
        el("span", t("滚动或按住鼠标移动")),
        el("button", "🎲", {
            onclick: () => {
                const i = Math.floor(Math.random() * infintyBento.length);
                b.style.transition = "0.6s";
                moveToRect(infintyBento[i]);
                setTimeout(() => {
                    b.style.transition = "";
                }, 400);
            },
        })
    )
);
