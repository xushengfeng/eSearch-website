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
    "-linux-amd64.deb": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-linux-amd64.deb`,
        size: `未知`,
    },
    "-linux-x86_64.rpm": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-linux-x86_64.rpm`,
        size: `未知`,
    },
    "-linux-x86_64.AppImage": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-linux-x86_64.AppImage`,
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

function cPlatform(platform: string) {
    mainDownload.innerHTML = "";
    switch (platform) {
        case "Windows":
            mainDownload.append(getDownloadItem("-win32-x64.exe", "exe"), getDownloadItem("-win32-x64.zip", "压缩包"));
            platformSelect.value = "Windows";
            break;
        case "Linux":
            mainDownload.append(
                getDownloadItem("-linux-amd64.deb", "deb"),
                getDownloadItem("-linux-x86_64.rpm", "rpm"),
                getDownloadItem("-linux-x86_64.AppImage", "AppImage")
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

// 获取软件资源
let result: any[];
fetch("https://api.github.com/repos/xushengfeng/eSearch/releases?per_page=100", { method: "GET" })
    .then((response) => response.text())
    .then((r) => {
        result = JSON.parse(r);
        for (let i in result) {
            if (result[i].prerelease) {
                delete result[i];
            }
        }
        result = result.flat();
        for (let i in result[0].assets) {
            let url = <string>result[0].assets[i].browser_download_url;
            let name = <string>result[0].assets[i].name;
            let hz = name.replace(/e-?[sS]earch.+[0-9]\.[0-9]\.[0-9]/, "");
            console.log(hz);

            if (!filesObject[hz]) continue;
            filesObject[hz].size = (result[0].assets[i].size / 1024 / 1024).toFixed(2);
            filesObject[hz].url = url;
        }
        console.log(filesObject);
        useFastGit(fastUrl);

        up_time = new Date(result[0].published_at).getTime();
        v = result[0].name;

        showLog();
    })
    .catch((error) => {
        console.error("error", error);
    });

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

if (lan.split("-")[0] === "zh") useFastGit(true);

function title(string: string, posi?: "bottom") {
    const s = el("span", { class: "title" }, t(string));
    if (posi === "bottom") s.classList.add("b");
    return s;
}

downloadEl.append(el("span", { class: "title" }, t("立即下载")), el("div", platformSelect, mainDownload));

const ocrEl = el("div", title("离线OCR", "bottom"));

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

const recordEl = el("div", { class: "record" }, el("div", { class: "center" }, [el("div"), el("div")]));

const y以图搜图 = el("div", title("以图搜图"));

const x形状 = el("div", title("多种形状"), { class: "shape" });
import shape_arrow from "../assets/shape/arrow.svg";
import shape_circle from "../assets/shape/circle.svg";
import shape_rect from "../assets/shape/rect.svg";
import shape_line from "../assets/shape/line.svg";
import shape_polyline from "../assets/shape/polyline.svg";
import shape_polygon from "../assets/shape/polygon.svg";
import shape_number from "../assets/shape/number.svg";
x形状.append(
    el("img", { src: shape_arrow }),
    el("img", { src: shape_circle }),
    el("img", { src: shape_rect }),
    el("img", { src: shape_line }),
    el("img", { src: shape_polyline }),
    el("img", { src: shape_polygon }),
    el("img", { src: shape_number })
);

const translate = el("div", title("翻译"));

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
infintyBento.push({ x: 3, y: 0, w: 1, h: 1, el: el("div", title("背景模糊")) }); // 背景模糊
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
        el("img", { class: "center", src: electronImg }),
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
        el("a", { class: "center", href: "https://github.com/xushengfeng/eSearch/releases" }, t("测试版尝鲜")),
        aiTip()
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
    el: el("div", title("AI识图")),
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
function pickColorXY() {
    if (!canPickColor) return;
    let x = pickColorBg.getBoundingClientRect().x;
    let y = pickColorBg.getBoundingClientRect().y;
    x = Math.max(0, Math.min(pickColorCanvas.width, x));
    y = Math.max(0, Math.min(pickColorCanvas.height, y));
    const color = pickColorCanvas.getContext("2d").getImageData(x, y, 1, 1).data;
    pickColorEl.innerHTML = "";
    pickColorEl.append(pickColor(Array.from(color)));
}
import photo from "../assets/p.jpg";
const pickColorCanvas = el("canvas");
let img = document.createElement("img");
img.src = photo;
img.onload = () => {
    pickColorCanvas.width = img.naturalWidth;
    pickColorCanvas.height = img.naturalHeight;
    pickColorCanvas.getContext("2d").drawImage(img, 0, 0);
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
    el: el("div", { class: "qr" }, el("img", { class: "center", width: 200, src: qr })),
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
    longClipEl.style.height = window.innerHeight - longClipEl.getBoundingClientRect().y - 100 + "px";
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
        el("img", { class: "center", src: logo }),
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
    el: el("div", title("自由截屏（测试版）")),
});
infintyBento.push({
    x: 0,
    y: -2,
    w: 1,
    h: 1,
    el: el("div", title("编辑录屏")),
});
infintyBento.push({
    x: 3,
    y: -2,
    w: 1,
    h: 1,
    el: el("div", title("录制摄像头")),
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
