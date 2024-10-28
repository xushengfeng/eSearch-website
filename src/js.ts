import {
    a,
    addStyle,
    button,
    ele,
    type ElType,
    image,
    input,
    label,
    p,
    pack,
    radioGroup,
    select,
    setProperties,
    setProperty,
    txt,
    view,
} from "dkh-ui";

const infintyBento: { x: number; y: number; w: number; h: number; el: ElType<HTMLElement> }[] = [];
const blockSize = 360;
const gap = 10;

const b = document.getElementById("bento");

function r(p: { x: number; y: number }, repeatX: number, repeatY: number) {
    for (const i of infintyBento) {
        const gapX = repeatX - i.w;
        const gapY = repeatY - i.h;
        let cx = Math.floor((p.x - i.x) / (i.w + gapX));
        let cy = Math.floor((p.y - i.y) / (i.h + gapY));
        if (i.x + cx * (i.w + gapX) + i.w < p.x) cx++;
        if (i.y + cy * (i.h + gapY) + i.h < p.y) cy++;
        const el = i.el;
        el.style({
            left: `${(i.x + cx * (i.w + gapX)) * blockSize + gap}px`,
            top: `${(i.y + cy * (i.h + gapY)) * blockSize + gap}px`,
            width: `${i.w * blockSize - gap * 2}px`,
            height: `${i.h * blockSize - gap * 2}px`,
        });
    }
}

let x = 0;
let y = 0;
const repeatX = 10;
const repeatY = 7;

document.onwheel = (e) => {
    if (log2El.el.contains(e.target as HTMLElement)) return;
    moveAnimate.stop();
    x -= e.deltaX;
    y -= e.deltaY;
    moveB(x, y);
};

let startE: PointerEvent;
let startP = { x, y };
b.onpointerdown = (e) => {
    const el = e.target as HTMLElement;
    if (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(el.tagName)) return;
    moveAnimate.stop();
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
    b.style.left = `${x}px`;
    b.style.top = `${y}px`;
    r({ x: -x / blockSize, y: -y / blockSize }, repeatX, repeatY);

    pickColorXY();
    logClip();
}

function getToRect(r: { x: number; y: number; w: number; h: number }) {
    x = window.innerWidth / 2 - (r.x * blockSize + (r.w * blockSize) / 2);
    y = window.innerHeight / 2 - (r.y * blockSize + (r.h * blockSize) / 2);
    return { x, y };
}
function moveToRect(r: { x: number; y: number; w: number; h: number }) {
    const { x, y } = getToRect(r);
    moveB(x, y);
}

function fillBento() {
    const smallL: { x: number; y: number; has: boolean }[] = [];
    for (let i = 0; i < repeatX; i++) {
        for (let j = 0; j < repeatY; j++) {
            smallL.push({ x: i, y: j, has: false });
        }
    }
    for (const i of infintyBento) {
        const x = i.x < 0 ? repeatX + i.x : i.x;
        const y = i.y < 0 ? repeatY + i.y : i.y;
        for (let ix = 0; ix < i.w; ix++) {
            for (let iy = 0; iy < i.h; iy++) {
                const nx = (x + ix) % repeatX;
                const ny = (y + iy) % repeatY;
                smallL.find((v) => v.x === nx && v.y === ny).has = true;
            }
        }
    }
    const dontHas = smallL.filter((v) => !v.has);
    for (const [index, i] of dontHas.entries()) {
        const bg = Colors((index / dontHas.length) * 360);
        infintyBento.push({
            x: i.x,
            y: i.y,
            w: 1,
            h: 1,
            el: view("x", "wrap")
                .add(
                    Array(25)
                        .fill("")
                        .map((i) => partten().style({ width: "20%", height: "20%" })),
                )
                .style({
                    backgroundColor: bg,
                    padding: 0,
                })
                .on("click", () => {
                    console.log(`#${i.x},${i.y}`);
                }),
        });
    }
}

// @auto-path:../assets
function getImg(name: string) {
    return new URL(`../assets/${name}`, import.meta.url).href;
}

const Colors = (n: number) => `oklch(0.87 0.27 ${n})`;

function partten() {
    const xc = "#0009";
    const deg = Math.round(Math.random() * 4) * 90;
    const p: { p: number; f: () => ElType<HTMLElement> }[] = [
        {
            p: 3,
            f: () => {
                return view().style({
                    backgroundImage: `repeating-linear-gradient(${deg + 45}deg,transparent 0 6.25%,${xc} 6.25% 12.5%)`,
                });
            },
        },
        {
            p: 1,
            f: () => {
                return view().style({
                    background: xc,
                });
            },
        },
        {
            p: 2,
            f: () => {
                return view().style({
                    backgroundImage: `radial-gradient(${xc} 50%, transparent 50%)`,
                    backgroundSize: "20% 20%",
                });
            },
        },
        {
            p: 2,
            f: () => {
                return view().style({
                    borderTopRightRadius: "100%",
                    background: xc,
                    rotate: `${deg}deg`,
                });
            },
        },
        { p: 5, f: () => view() },
    ];
    const l: [number, number][] = [];
    let c = 0;
    for (const i of p) {
        l.push([c, c + i.p]);
        c += i.p;
    }
    const r = Math.random() * l.at(-1)[1];
    for (const x of l) {
        if (x[0] <= r && r <= x[1]) {
            return p.at(l.indexOf(x)).f().style({ pointerEvents: "none" });
        }
    }
}

function initBento() {
    b.innerHTML = "";

    fillBento();

    const nl: ((typeof infintyBento)[0] & { r: number })[] = [];
    for (const i of infintyBento) {
        const x0 = i.x % repeatX;
        const x1 = (i.x + i.w) % repeatX;
        const y0 = (i.y % repeatY) - 0.5;
        const y1 = ((i.y + i.h) % repeatY) - 0.5;
        const r = Math.sqrt(Math.min(Math.abs(x0), Math.abs(x1)) ** 2 + Math.min(Math.abs(y0), Math.abs(y1)) ** 2);
        const r1 = Math.sqrt(((x0 + x1) / 2) ** 2 + ((y0 + y1) / 2) ** 2);
        nl.push({ ...i, r: Math.min(r, r1) });
    }

    nl.sort((a, b) => a.r - b.r);

    for (const i of nl) {
        b.append(i.el.class("bento").el);
    }

    moveB(x, y);
}

const lan = navigator.language || "zh-HANS";

let lanMap: { [key: string]: string } = {};

if (lan.split("-")[0] !== "zh") {
    fetch("/language/en.json")
        .then((res) => res.json())
        .then((data) => {
            lanMap = data;
        });
}

const t = (text: string) => {
    if (lan.split("-")[0] === "zh") {
        return text;
    }
    return lanMap[text];
};

const navTipEl = view().class("logo");
import logo from "../assets/icon.svg";
import logoSVG from "../assets/icon.svg?raw";
navTipEl.el.innerHTML = logoSVG;
navTipEl
    .add(view().add([ele("h1").add(t("eSearch")).style({ "font-size": "3rem" }), ele("h2").add(t("识屏 · 搜索"))]))
    .on("transitionend", () => {
        navTipEl.style({ transition: "0s" });
    });

window.onload = window.onclick = reSetLogo;
setTimeout(reSetLogo, 3000);
function reSetLogo() {
    navTipEl.style({
        transform: "scale(1)",
        filter: "none",
        "--op": "1",
    });
}

const downloadEl = view().class("download");

// 根据平台在首页显示下载按钮
const userAgent = navigator.userAgent.toLowerCase();
let platform = "Unknown";
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

const platformSelect = select([
    { value: "Windows", name: "Windows" },
    { value: "macOS", name: "macOS" },
    { value: "Linux", name: "Linux" },
]).on("input", () => {
    cPlatform();
});

const archSelect = radioGroup<"arm64" | "x64">("arch");
archSelect.on(() => {
    cPlatform();
});

const proxy_list: { url: string; replace: boolean; value: string; name: string }[] = [
    { url: "", replace: false, value: "raw", name: "原始链接(Github)" },
    { url: "https://github.moeyy.xyz/", replace: false, value: "0", name: "⚡moeyy镜像" },
    { url: "https://mirror.ghproxy.com/", replace: false, value: "1", name: "⚡ghproxy镜像" },
    { url: "https://kkgithub.com/", replace: true, value: "2", name: "⚡kkgithub镜像" },
];

const useFastGitEl = select(proxy_list).on("input", (_, el) => {
    useFastGit();
});

const mainDownload = view();

let v = "13.0.0";
let up_time = 1702051200000;

function cPlatform(platform: string = platformSelect.gv, arch = archSelect.get()) {
    mainDownload.clear();
    switch (platform) {
        case "Windows":
            mainDownload.add([getDownloadItem("win32", arch, "exe"), getDownloadItem("win32", arch, "zip")]);
            platformSelect.sv("Windows");
            break;
        case "Linux":
            mainDownload.add([
                getDownloadItem("linux", arch, "deb"),
                getDownloadItem("linux", arch, "rpm"),
                getDownloadItem("linux", arch, "AppImage"),
            ]);
            platformSelect.sv("Linux");
            break;
        case "macOS":
            mainDownload.add([getDownloadItem("darwin", arch, "dmg"), getDownloadItem("darwin", arch, "zip")]);
            platformSelect.sv("macOS");
            break;
        case "Android":
            cPlatform("Windows", arch);
            break;
        case "iOS":
            cPlatform("macOS", arch);
            break;
        default:
            cPlatform("Windows", arch);
            break;
    }
}

cPlatform(platform);

function getDownloadItem(platform: "win32" | "linux" | "darwin", arch: "x64" | "arm64", fileType: string) {
    const url = `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-${platform}-${arch}.${fileType}`;
    return a(fasthub(url, useFastGitEl.gv)).attr({ download: "true" }).data({ src: url }).add(fileType);
}

let dev = false;

// 获取软件资源
let result: any[];
let devResult: any[];
setTimeout(() => {
    fetch("https://api.github.com/repos/xushengfeng/eSearch/releases?per_page=20", { method: "GET" })
        .then((response) => response.json())
        .then((r) => releasesX(r))
        .catch((error) => {
            fetch("/releases.json", { method: "GET" })
                .then((response) => response.json())
                .then((r) => releasesX(r));
        });
}, 10);

const releasesX = (r) => {
    devResult = r;
    result = structuredClone(r);

    if (!dev)
        for (const i in result) {
            if (result[i].prerelease) {
                delete result[i];
            }
        }
    result = result.flat();
    useFastGit();

    up_time = new Date(result[0].published_at).getTime();
    v = result[0].name;
    cPlatform();

    showLog();
};

function fasthub(url: string, type: string) {
    const proxy = proxy_list.find((v) => v.value === type);
    if (proxy.replace) {
        return url.replace("https://github.com/", proxy.url);
    }
    return proxy.url + url;
}

function useFastGit(type: string = useFastGitEl.gv) {
    for (const a of mainDownload.queryAll("a")) {
        const src = a.el.getAttribute("data-src");
        a.el.href = fasthub(src, type);
    }
}

if (lan.split("-")[0] === "zh") {
    const list = proxy_list.slice(1);
    const value = list[Math.floor(Math.random() * list.length)].value;
    useFastGit(value);
    useFastGitEl.sv(value);
}

function devEl() {
    return txt("测试版").style({
        "font-size": "12px",
        background: "#e9c018",
        color: "#fff",
        padding: "2px",
        "border-radius": "4px",
    });
}

function title(string: string, posi?: "bottom", dev?: boolean) {
    const s = ele("h2").class("title").add(string);
    if (posi === "bottom") s.class("b");
    if (dev) {
        s.add(devEl());
    }
    return s;
}
function subtitle(string: string) {
    const s = ele("h3").add(string).class("subtitle");
    return s;
}

const center = { class: "center" };
const bg = { ...center, style: { width: "100%" } };
const noBg = { style: { background: "transparent" } };

downloadEl.add([
    txt("立即下载").class("title"),
    view().add([
        view().add([
            platformSelect,
            view("x")
                .style({ gap: "4px" })
                .class("arch")
                .add([archSelect.new("x64"), archSelect.new("arm64")]),
            useFastGitEl,
        ]),
        mainDownload,
    ]),
]);

addStyle({
    ".arch > label": {
        borderRadius: "4px",
        padding: "4px",
        transition: "var(--transition)",
    },
    ".arch > label:has(:checked)": {
        background: "white",
        color: "var(--l-color)",
    },
});

import ppocrDic from "../assets/ppocr_keys_v1.txt?raw";
const ppocrL = ppocrDic.split("\n").filter((i) => i.trim().match(/\p{Ideographic}/u));

function getRandomChineseWord() {
    return ppocrL.at(Math.floor(Math.random() * ppocrL.length));
}

const ocrBg = view()
    .style({
        fontFamily: "sans-serif",
        fontSize: "20px",
        lineHeight: "1",
        color: "#0000000f",
        background: "white",
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
    })
    .attr({ ariaHidden: "true" });
for (let i = 0; i < 1500; i++) {
    ocrBg.add(getRandomChineseWord());
}

const ocrEl = view()
    .class("ocr")
    .add([ocrBg, title("离线文字识别（OCR）", "bottom")]);

const log2El = ele("ul");
const logEl = view()
    .class("log")
    .add([title("更新记录"), log2El, a("https://github.com/xushengfeng/eSearch/releases").add(txt("查看更多"))]);

import markdownit from "markdown-it";
function showLog() {
    const md = markdownit({
        html: true,
        linkify: true,
        typographer: true,
    });
    const defaultRender =
        md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const aIndex = tokens[idx].attrIndex("target");
        if (aIndex < 0) {
            tokens[idx].attrPush(["target", "_blank"]);
        } else {
            tokens[idx].attrs[aIndex][1] = "_blank";
        }
        return defaultRender(tokens, idx, options, env, self);
    };
    log2El.clear();
    for (const i in result) {
        const body = result[i].body as string;
        const bodyL = body.split("\n");
        const newBody = bodyL.slice(
            0,
            bodyL.findIndex((i) => i.trim() === "---"),
        );
        const li = ele("li");
        const h = txt(result[i].tag_name).class("log_v");
        li.add(h);
        const div = view();
        div.el.innerHTML = md.render(newBody.join("\n"));
        li.add([h, div]);
        log2El.add(li);
    }
}

import windowImg from "../assets/window.webp";
import wallPaper1 from "../assets/wallpaper/win11.webp";
import wallPaper2 from "../assets/wallpaper/macos.webp";
const recordEl = view()
    .class("record")
    .add([image(wallPaper1, "").class("wp"), image(windowImg, "").class(center.class), view().class(center.class)]);

import photoImg from "../assets/a-mountain.webp";
import photoImg1 from "../assets/a-mountain1.webp";
const y以图搜图 = view()
    .class("search_photo")
    .add([
        title("以图搜图"),
        aiTip(),
        view()
            .class(center.class)
            .add(image(getImg("colorful-waves-from-center-diverging-in-all-direct.webp"), "")),
        view().class(center.class).add(image(photoImg, "")),
        view()
            .class(center.class)
            .add(view().add(image(photoImg, ""))),
        view()
            .class(center.class)
            .add(view().add(image(photoImg, ""))),
        view()
            .class(center.class)
            .add(view().add(image(photoImg, ""))),
        view()
            .class(center.class)
            .add(view().add(image(photoImg1, ""))),
    ]);

const x形状 = view()
    .class("shape")
    .style({ background: Colors(20) })
    .add([title("多种形状"), p("快速在截屏上标记")]);
const shapeL = [
    getImg("shape/arrow.svg"),
    getImg("shape/circle.svg"),
    getImg("shape/rect.svg"),
    getImg("shape/line.svg"),
    getImg("shape/polyline.svg"),
    getImg("shape/polygon.svg"),
    getImg("shape/number.svg"),
    getImg("shape/mask.svg"),
];
x形状.add(
    view("x", "wrap")
        .style({ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 })
        .add(
            Array(25)
                .fill(1)
                .map((i) => {
                    return image(shapeL.at(Math.floor(Math.random() * shapeL.length)), "").style({
                        opacity: "0.2",
                        width: "20%",
                    });
                }),
        ),
);

function imgL(l: string[]) {
    return l.map((i) => image(i, ""));
}

import t_bing from "../assets/icons/translate/bing.svg";
import t_baidu from "../assets/icons/translate/baidu.svg";
import t_caiyun from "../assets/icons/translate/caiyun.svg";
import t_chatgpt from "../assets/icons/translate/chatgpt.svg";
import t_deepl from "../assets/icons/translate/deepl.svg";
import t_gemini from "../assets/icons/translate/gemini.svg";
import t_niu from "../assets/icons/translate/niu.svg";
import t_youdao from "../assets/icons/translate/youdao.svg";

function t条幅(text: string) {
    const s = view()
        .class("slide")
        .add([txt(text), txt(text)]);
    return s;
}

infintyBento.push({ x: -1, y: 0, w: 2, h: 1, el: navTipEl });
infintyBento.push({ x: 0, y: 1, w: 2, h: 1, el: downloadEl });
infintyBento.push({ x: 1, y: -1, w: 2, h: 2, el: ocrEl });
infintyBento.push({ x: 1, y: 2, w: 1, h: 2, el: logEl });
infintyBento.push({ x: 0, y: -1, w: 1, h: 1, el: recordEl });
infintyBento.push({ x: -1, y: -1, w: 1, h: 1, el: y以图搜图 });
infintyBento.push({ x: 2, y: 1, w: 1, h: 1, el: x形状 });
infintyBento.push({
    x: 2,
    y: 2,
    w: 1,
    h: 1,
    el: view()
        .class("translate_e")
        .add([
            title("多引擎翻译"),
            view().add(imgL([t_chatgpt, t_gemini, t_deepl, t_caiyun, t_bing, t_youdao, t_baidu, t_niu])),
            p("自定义API，聚合显示多个引擎翻译结果"),
            p("方便复制结果"),
            p("保存翻译结果到文件或Anki"),
        ]),
});
const lpCard = {
    width: "200px",
    height: "140px",
    padding: "4px",
    borderRadius: "4px",
    position: "absolute",
    boxShadow: "var(--shadow)",
    background: "white",
    transform: "rotate(5deg)",
    transition: "var(--transition)",
} as const;
infintyBento.push({
    x: 2,
    y: 3,
    w: 1,
    h: 1,
    el: view()
        .add([
            title("连拍"),
            p("捕获精彩瞬间"),
            view()
                .style({ position: "relative", transform: "translateY(50px)" })
                .class("lp")
                .add([
                    view().style(lpCard).style({ left: 0 }),
                    view().style(lpCard).style({ left: "20px" }),
                    view().style(lpCard).style({ left: "40px" }),
                    view().style(lpCard).style({ left: "60px" }),
                    view().style(lpCard).style({ left: "80px" }),
                    view().style(lpCard).style({ left: "100px" }),
                    view().style(lpCard).style({ left: "120px" }),
                    view().style(lpCard).style({ left: "140px" }),
                    view().style(lpCard).style({ left: "160px" }),
                    view().style(lpCard).style({ left: "180px" }),
                    view().style(lpCard).style({ left: "200px" }),
                ]),
        ])
        .style({ background: Colors(270) }),
});

addStyle({
    ".lp>div:hover": {
        transform: "translateY(-60px) scale(1.2) !important",
    },
});

infintyBento.push({
    x: 3,
    y: 3,
    w: 1,
    h: 1,
    el: view().add([title("自动识别元素"), p("利用边缘识别识别所有可见元素")]),
});

const translatePel = view()
    .class(center.class, "translator")
    .add([p("你好世界！\n这是一个屏幕翻译示例\n把其他语言翻译成你的母语"), p("★■•❉\n◍⊛❖✱◎☉\n⊗⌘➞✧✦⚝✸✻")]);
infintyBento.push({
    x: 3,
    y: 2,
    w: 1,
    h: 1,
    el: view()
        .style({ background: Colors(180) })
        .add([title("屏幕翻译"), p("翻译屏幕文字并覆盖在上"), p("可定时翻译"), translatePel]),
});

infintyBento.push({
    x: 1,
    y: -1,
    w: 1,
    h: 1,
    el: view()
        .style(noBg.style)
        .add(
            view()
                .class(center.class)
                .add([subtitle("🛡隐私"), p("本地运行，不依赖网络，不上传数据到服务器")]),
        ),
});
infintyBento.push({
    x: 2,
    y: -1,
    w: 1,
    h: 1,
    el: view()
        .style(noBg.style)
        .add(
            view()
                .class(center.class)
                .add([
                    subtitle("🎯准确"),
                    p("使用PaddleOCR v4模型"),
                    p().add(a("https://webocr.netlify.app").add("在线试用")),
                ]),
        ),
});
infintyBento.push({
    x: 2,
    y: 0,
    w: 1,
    h: 1,
    el: view()
        .style(noBg.style)
        .add(
            view()
                .class(center.class)
                .add([subtitle("🪙0元/万字"), p("不限量使用")]),
        ),
});
infintyBento.push({
    x: 1,
    y: 0,
    w: 1,
    h: 1,
    el: view()
        .style(noBg.style)
        .add(
            view()
                .class(center.class)
                .add([
                    p("基于开源的").add(a("https://github.com/paddle/paddleocr").add("PaddleOCR")),
                    p("开箱即用"),
                    p().add(a("https://github.com/xushengfeng/eSearch-OCR").add("js库")),
                ]),
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
    el: view()
        .class("search_engine")
        .add([
            title("自定义搜索引擎"),
            image(baiduImg, ""),
            image(yandexImg, ""),
            image(googleImg, ""),
            image(bingImg, ""),
        ]),
}); // 搜索引擎

const virtualBgEl = view().add([
    view(),
    image(getImg("blackhole.webp"), ""),
    image(getImg("forest.webp"), ""),
    view().add(image(wallPaper1, "")),
]);
infintyBento.push({
    x: 3,
    y: 0,
    w: 1,
    h: 1,
    el: view()
        .class("virtual_bg")
        .add([title("虚拟背景"), image(getImg("bookshelf.webp"), ""), virtualBgEl, image(manImg, ""), aiTip()]),
});
let virtualBgI = 1;
setInterval(() => {
    virtualBgEl.el.style.left = `${virtualBgI * 100}%`;
    virtualBgI--;
    if (virtualBgI === -4) virtualBgI = 1;
}, 1600);
infintyBento.push({
    x: 3,
    y: 1,
    w: 1,
    h: 1,
    el: view()
        .class("star")
        .add(
            a("https://github.com/xushengfeng/eSearch").add([
                txt("🌟"),
                txt(t("去GitHub点Star")),
                txt(t("或fork，或提issue，这是我开发的动力")),
            ]),
        ),
});
infintyBento.push({
    x: 2,
    y: -2,
    w: 1,
    h: 1,
    el: view()
        .class("lang")
        .add([
            a("./ocr.html").add("下载OCR语言包"),
            t条幅("界面和OCR支持多种语言"),
            t条幅("Interface and OCR support multiple languages "),
            t条幅("Interface et OCR prennent en charge plusieurs langues "),
            t条幅("Interfaz y OCR soportan varios idiomas "),
            t条幅("интерфейс и OCR поддерживает несколько языков "),
        ]),
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
    el: view()
        .class("platform")
        .add([
            title("跨平台"),
            image(electronImg, "").class(center.class),
            view()
                .class(center.class)
                .add([image(windowsImg, ""), image(linuxImg, ""), image(macosImg, "")]),
        ]),
}); // 跨平台

const codeBg = view();
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

codeBg.el.innerText = codeBgC;
infintyBento.push({
    x: -1,
    y: 3,
    w: 2,
    h: 1,
    el: view()
        .class("opensource")
        .add([
            codeBg,
            view()
                .class(center.class)
                .add([
                    a("https://github.com/xushengfeng/eSearch").add(image(getImg("icons/Github.svg"), "github")),
                    a("https://gitee.com/xsf-root/eSearch").add(image(getImg("icons/Gitee.svg"), "gitee")),
                ]),
        ]),
}); // 开源
infintyBento.push({
    x: 1,
    y: 4,
    w: 1,
    h: 1,
    el: view()
        .class("dev")
        .add([
            title("新特性"),
            image(getImg("a-cube-filled-with-mechancial-elements.svg"), ""),
            a("https://github.com/xushengfeng/eSearch/releases")
                .class(center.class)
                .add("测试版尝鲜")
                .on("click", () => {
                    dev = true;
                    releasesX(devResult);
                }),
        ]),
});
infintyBento.push({
    x: 4,
    y: -1,
    w: 1,
    h: 1,
    el: view().add([title("贴图"), p("把图片置顶在屏幕上，可改变透明度、大小、鼠标穿透、位置"), p("一键归位")]),
});
infintyBento.push({
    x: 5,
    y: 5,
    w: 1,
    h: 1,
    el: view()
        .style({ backgroundColor: Colors(300) })
        .add([
            title("高级图片编辑"),
            p("为图片添加圆角、阴影、背景"),
            image(getImg("edit_bg.png"), "一个有圆角的图片").style({
                width: "400px",
                rotate: "15deg",
            }),
        ]),
});
infintyBento.push({
    x: 6,
    y: 5,
    w: 1,
    h: 1,
    el: view()
        .style({ backgroundColor: Colors(240) })
        .add([
            title("移除图片物体"),
            p("使用AI，抹除图片中的特定物体"),
            image(getImg("rm_obj.svg"), "移除东西的线条").style({
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
            }),
        ]),
});
const money = "¥$€£";
let mBg = "";
for (let i = 0; i < 300; i++) {
    mBg += money[Math.floor(Math.random() * 4)];
}
infintyBento.push({
    x: -2,
    y: 0,
    w: 1,
    h: 1,
    el: view()
        .class("free")
        .add([
            title("自由免费"),
            p("所以功能均不受限使用，无订阅与买断"),
            p("只有高级版"),
            p("享受以下所有功能："),
            p("截屏 离线OCR 搜索翻译 以图搜图 贴图 录屏 滚动截屏 等"),
            view().add(mBg).style({ background: "white" }).attr({ ariaHidden: "true" }),
        ])
        .style({ background: "transparent" }),
});

infintyBento.push({
    x: -2,
    y: -1,
    w: 1,
    h: 1,
    el: view().add([
        title("文档与教程"),
        p("快速上手、详细功能教程、高级技巧"),
        view()
            .class(center.class)
            .add(a("https://github.com/xushengfeng/eSearch/blob/master/docs/use").add("点击打开")),
        image(getImg("books_3d.png"), "book 3d").style({
            scale: 1.1,
            rotate: "-25deg",
            transform: "translateY(10px)",
        }),
    ]),
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
        case "HSL": {
            const hsl = color.hsl().round().array();
            return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
        }
        case "HSV": {
            const hsv = color.hsv().round().array();
            return `hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)`;
        }
        case "CMYK": {
            const cmyk = color.cmyk().round().array();
            return `cmyk(${cmyk[0]}, ${cmyk[1]}, ${cmyk[2]}, ${cmyk[3]})`;
        }
        default:
            return "";
    }
}
function pickColor(l: number[]) {
    const color = Color.rgb(l);
    const clipColorTextColor = color.alpha() === 1 ? (color.isLight() ? "#000" : "#fff") : "";
    const div = view().style({ background: color.hex(), color: clipColorTextColor });
    for (const i in allColorFormat) {
        div.add(view().add(colorConversion(color, allColorFormat[i])));
    }
    return div;
}

let canPickColor = false;
let lastPickColor = 0;
const pickColorCanvas = ele("canvas").el;
const pickColorCanvasCtx = pickColorCanvas.getContext("2d", { willReadFrequently: true });
function pickColorXY() {
    if (!canPickColor) return;
    if (new Date().getTime() - lastPickColor < 100) return;
    lastPickColor = new Date().getTime();
    let x = pickColorBg.el.getBoundingClientRect().x;
    let y = pickColorBg.el.getBoundingClientRect().y;
    x = Math.max(0, Math.min(pickColorCanvas.width, x));
    y = Math.max(0, Math.min(pickColorCanvas.height, y));
    const color = pickColorCanvasCtx.getImageData(x, y, 1, 1).data;
    pickColorEl.clear().add(pickColor(Array.from(color)));
}
const img = document.createElement("img");
img.src = getImg("p.webp");
img.onload = () => {
    pickColorCanvas.width = img.naturalWidth;
    pickColorCanvas.height = img.naturalHeight;
    pickColorCanvasCtx.drawImage(img, 0, 0);
    canPickColor = true;
};
const pickColorEl = view()
    .class(center.class)
    .add(pickColor([58, 105, 255]));
const pickColorBg = view();
infintyBento.push({
    x: -1,
    y: 1,
    w: 1,
    h: 1,
    el: view().class("pick_color").add([pickColorBg, pickColorEl]),
});
infintyBento.push({
    x: -1,
    y: 4,
    w: 1,
    h: 1,
    el: view()
        .class("qr")
        .style({ background: Colors(288) })
        .add(image(getImg("qr.svg"), "").style({ opacity: 0.6 }).attr({ width: 200 }).class(center.class)),
});
function aiTip() {
    return txt(t("此插画由AI绘制")).style({
        position: "absolute",
        bottom: "4px",
        right: "4px",
    });
}

const longClipEl = view().add(image(getImg("rockets-and-space-ship.webp"), ""));
function logClip() {
    const h = window.innerHeight - longClipEl.el.getBoundingClientRect().y - 100;
    longClipEl.el.style.height = `${Math.max(h, 200)}px`;
}
infintyBento.push({
    x: -2,
    y: 1,
    w: 1,
    h: 3,
    el: view()
        .class("long_clip")
        .add([title("滚动截屏"), p("万向滚动拼接"), longClipEl, aiTip()]),
});

function autoDeleteEnterEl(t: string) {
    return view()
        .add([txt(t).style({ background: Colors(260), lineHeight: 1.5 }), "↵"])
        .style({ background: "#0005", marginTop: "16px", padding: "4px", borderRadius: "4px" });
}
infintyBento.push({
    x: 7,
    y: -1,
    w: 1,
    h: 2,
    el: view()
        .add([
            title("自动排版"),
            autoDeleteEnterEl(
                "我们日常的文字，特别是一段话，会比较长，在显示时软件采取了自动换行，就像你现在看到的一样，一段文字变成了视觉上的多行文字。",
            ),
            autoDeleteEnterEl(
                "文字识别算法把他们都视为单独的一行，这导致原始的文字识别输出存在很多多余的换行，而我们只需要每一段的换行即可。",
            ),
            autoDeleteEnterEl("eSearch 的文字识别软件支持排版识别，识别后的文字换行符合原始文字。"),
            autoDeleteEnterEl(
                "即使这样，还是会有漏网之鱼，不过，通过“自动删除换行”可以通过识别句子标点进行下一步排版。",
            ),
            autoDeleteEnterEl("同步选择可以帮助你方便校对，确保文字识别的排版严谨。"),
            autoDeleteEnterEl("其实，自动识别文字的排版已经够用了。"),
        ])
        .style({ background: Colors(260) }),
});
infintyBento.push({
    x: 5,
    y: 0,
    w: 1,
    h: 1,
    el: view().add([
        title("置于顶层"),
        p("不仅是贴图，编辑器也可以置于顶层，方便对照编辑"),
        p("支持失去焦点自动关闭窗口"),
    ]),
});
infintyBento.push({
    x: 4,
    y: 1,
    w: 2,
    h: 1,
    el: view()
        .class("muti_screen")
        .add([
            title("多屏幕"),
            image(getImg("a-muti-screen-wall.webp"), ""),
            image(logo, "").class(center.class),
            aiTip(),
        ]),
});
infintyBento.push({
    x: 4,
    y: 2,
    w: 1,
    h: 1,
    el: view().add([
        image(getImg("bw.svg"), "").class(center.class).style({ width: "100%" }),
        title("深色模式").style({ mixBlendMode: "difference", color: "white" }),
        p("自动跟随系统切换").style({ mixBlendMode: "difference", color: "white" }),
    ]),
});
const txtOnImg = {
    filter: "drop-shadow(2px 4px 6px black)",
    color: "white",
};
infintyBento.push({
    x: 4,
    y: 3,
    w: 1,
    h: 1,
    el: view().add([
        image(getImg("filter.webp"), "山 经过多个滤镜处理").style({
            height: "100%",
            position: "absolute",
            top: 0,
            left: "-138px",
        }),
        title("滤镜").style(txtOnImg),
        p("马赛克、模糊、对比度、亮度、色调、黑白等").style(txtOnImg),
    ]),
});

infintyBento.push({
    x: 5,
    y: 2,
    w: 1,
    h: 1,
    el: view()
        .add([
            image(getImg("free.svg"), "").style(bg.style).class(bg.class),
            title("自由截屏"),
            p("不止矩形，创建任意形状的截屏"),
        ])
        .style({ background: Colors(150) }),
});
import film from "../assets/a-film-strip.svg";
infintyBento.push({
    x: 0,
    y: -2,
    w: 1,
    h: 1,
    el: view()
        .class("edit_record")
        .add([
            title("编辑录屏"),
            p(t("并把他们转为mp4、gif、webm……")),
            view().add([image(film, ""), image(film, ""), image(film, ""), image(film, "")]),
            aiTip(),
        ]),
});
import manImg from "../assets/a-professor.webp";
infintyBento.push({
    x: 3,
    y: -2,
    w: 1,
    h: 1,
    el: view()
        .class("camera")
        .add([
            title("录制摄像头"),
            image(wallPaper2, "").class("wp"),
            image(windowImg, "").class(center.class),
            view().add(image(getImg("a-professor.webp"), "")),
        ]),
});
import tools_close from "../assets/tools/close.svg";
import tools_save from "../assets/tools/save.svg";
import tools_copy from "../assets/tools/copy.svg";
import tools_ocr from "../assets/tools/ocr.svg";
import tools_search from "../assets/tools/search.svg";
import tools_record from "../assets/tools/record.svg";
import tools_open from "../assets/tools/open.svg";
import tools_long from "../assets/tools/long_clip.svg";
import tools_scan from "../assets/tools/scan.svg";
import tools_translate from "../assets/tools/translate.svg";

const toolsBar = view().class("tools");
const tools = [
    tools_close,
    tools_save,
    tools_copy,
    tools_ocr,
    tools_search,
    tools_record,
    tools_open,
    tools_long,
    tools_scan,
    tools_translate,
];
for (const i of tools) {
    toolsBar.add(view().add(image(i, "")));
}

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

setInterval(() => {
    const n = Math.floor(random(2, tools.length + 1));
    const size = Math.floor(random(30, 80));
    const icon = random(0.5, 1);
    setProperties({ "--size": `${size}px`, "--n": n.toString(), "--icon": icon.toString() }, toolsBar.el);
    for (const e of toolsBar.queryAll("div")) {
        const order = Math.floor(random(1, tools.length + 1));
        e.style({ order: order.toString() });
    }
}, 1800);
infintyBento.push({
    x: 6,
    y: 1,
    w: 1,
    h: 2,
    el: view().add([
        title("自定义界面"),
        p("在设置可视化地编辑工具栏工具显示"),
        p("自定义取色器、大小栏等的显示"),
        p("自定义界面字体、毛玻璃效果"),
        p(t("自定义强调色、背景色")),
        p("……"),
        toolsBar,
    ]),
});
const syncSelect = view().class("center", "sync");
infintyBento.push({
    x: 4,
    y: 4,
    w: 1,
    h: 1,
    el: view().add([title("同步选择"), syncSelect]),
});
const testText = t("这是测试文字，在图片中选中的文字可以同步到编辑区，方便校对");
const syncOCR = view()
    .class("photo_text")
    .add([testText.slice(0, 4), txt(testText.slice(4, 6)), testText.slice(6)]);
const syncOCR2 = view().add([testText.slice(0, 4), txt(testText.slice(4, 6)), testText.slice(6)]);
syncSelect.add([syncOCR, syncOCR2]);

infintyBento.push({
    x: 8,
    y: 4,
    w: 1,
    h: 1,
    el: view().add([
        title("关于"),
        view().add([
            a("https://www.netlify.com").add(
                image("https://www.netlify.com/v3/img/components/netlify-light.svg", "netlify"),
            ),
            p("网站灵感来源：").add(a("https://www.amie.so/recap").add("amie")),
            p("此网站源码：").add(a("https://github.com/xushengfeng/eSearch-website").add("Github")),
            p("2021 - 2024"),
            ele("address").add([
                a("https://github.com/xushengfeng").add("xushengfeng"),
                ele("br"),
                a("mailto:xushengfeng_zg@163.com").add("xushengfeng_zg@163.com"),
            ]),
        ]),
    ]),
});

const cursorEl = view();
const ctrlEl = view()
    .class("ctrl")
    .add([
        cursorEl,
        title("精确控制"),
        p()
            .add(txt("↑↓←→").style({ "font-family": "code" }))
            .add("自由移动"),
        p()
            .add(txt("+-*/()").style({ "font-family": "code" }))
            .add("四则运算精确分割"),
        p("放大到像素编辑"),
    ]);
infintyBento.push({
    x: 7,
    y: 1,
    w: 1,
    h: 1,
    el: ctrlEl,
});

for (let i = 0; i < 36; i++) {
    cursorEl.add(view());
}

infintyBento.push({
    x: 7,
    y: 2,
    w: 1,
    h: 1,
    el: view().add([title("快捷键"), p("全局"), p("截屏"), p("编辑器"), p("41种可自定义快捷键")]),
});
infintyBento.push({
    x: 5,
    y: 4,
    w: 1,
    h: 1,
    el: view().add([
        title("高效编辑"),
        p("使用正则表达式替换"),
        p("自定义js脚本处理文字").add(devEl()),
        p("联动其他编辑器"),
        txt("(t)=>λt").style({
            position: "absolute",
            bottom: "0",
            width: "100%",
            left: "0",
            "text-align": "center",
            "font-size": "4rem",
            "font-family": "code",
        }),
    ]),
});
const photos = view("x").style({ overflow: "hidden" });
const photos2 = view("x")
    .add([
        image("/readme/1.webp", "截屏页面"),
        image("/readme/8.webp", "主页面"),
        image("/readme/5.webp", "设置页面"),
        image("/readme/6.webp", "深色模式"),
        image("/readme/7.webp", "贴图"),
    ])
    .class("photos")
    .style({ transition: "0.4s", "align-items": "flex-start" });
let photoi = 0;
setInterval(() => {
    photos2.style({ translate: `-${photoi}00%` });
    photoi++;
    if (photoi === 5) photoi = 0;
}, 2000);
infintyBento.push({
    x: 6,
    y: 3,
    w: 2,
    h: 2,
    el: view().add([title("界面展示"), photos.add(photos2).el]),
});
infintyBento.push({
    x: 5,
    y: 3,
    w: 1,
    h: 1,
    el: view().add([
        title("反馈"),
        view()
            .class(center.class)
            .add([
                view().add(
                    a(
                        "https://github.com/xushengfeng/eSearch/issues/new?assignees=&labels=bug&projects=&template=bug_report.yaml&title=%E2%80%A6%E2%80%A6%E5%AD%98%E5%9C%A8%E2%80%A6%E2%80%A6%E9%94%99%E8%AF%AF",
                    ).add("错误报告"),
                ),
                view().add(
                    a(
                        "https://github.com/xushengfeng/eSearch/issues/new?assignees=&labels=%E6%96%B0%E9%9C%80%E6%B1%82&projects=&template=feature_request.md&title=%E5%BB%BA%E8%AE%AE%E5%9C%A8%E2%80%A6%E2%80%A6%E6%B7%BB%E5%8A%A0%E2%80%A6%E2%80%A6%E5%8A%9F%E8%83%BD%2F%E6%94%B9%E8%BF%9B",
                    ).add("功能建议"),
                ),
            ]),
    ]),
});
infintyBento.push({
    x: -1,
    y: 5,
    w: 1,
    h: 1,
    el: view()
        .style({ background: Colors(160) })
        .add([
            title("AI识图"),
            view("y")
                .style({ gap: "8px", marginTop: "16px" })
                .add([
                    view().add("这个图片上的风景在什么地方？").style({
                        background: "#0009",
                        color: "white",
                        padding: "8px",
                        borderRadius: "8px",
                        maxWidth: "80%",
                        marginLeft: "auto",
                    }),
                    view().add("作为一个人工智能助手，我很想为你提供关于这个图片的信息，但说实话，我也不知道。").style({
                        background: "#0009",
                        color: "white",
                        padding: "8px",
                        borderRadius: "8px",
                        maxWidth: "80%",
                        width: "max-content",
                    }),
                ]),
        ]),
});

initBento();

moveToRect({ x: -1, y: 0, w: 2, h: 1 });

const moveAnimate = animate(
    () => {
        const ox = Number.parseFloat(b.style.left.replace("px", ""));
        const oy = Number.parseFloat(b.style.top.replace("px", ""));
        return { x: ox, y: oy };
    },
    (data) => {
        moveB(data.x, data.y);
        x = data.x;
        y = data.y;
    },
    600,
);

document.body.append(
    view()
        .class("tip")
        .add([
            txt(t("滚动或按住鼠标移动")),
            button("🎲").on("click", () => {
                const i = Math.floor(Math.random() * infintyBento.length);
                moveAnimate.set(getToRect(infintyBento[i]), 0);
            }),
        ]).el,
);

function animate<t extends Record<string, number>>(initData: () => t, run: (t: t) => void, duration = 1000) {
    let linearT = 0;
    let start: DOMHighResTimeStamp | null = null;

    let nowState: t | null = null;
    let lastState: t | null = null;
    let lastT = 0;
    let willState: t | null = null;

    stop();

    function r() {
        if (!start) return;
        linearT = (performance.now() - start) / duration;
        if (linearT <= 1 && lastState && willState) {
            const state = structuredClone(lastState);
            for (const [key, o] of Object.entries(state)) {
                const w = willState[key];
                const t = linearT - lastT;
                if (w !== undefined) {
                    // @ts-ignore
                    state[key] = (1 - t) * o + t * w;
                }
            }
            nowState = structuredClone(state);
            run(state);
            requestAnimationFrame(r);
        } else {
            stop();
        }
    }
    function stop() {
        nowState = null;
        lastState = null;
        lastT = 0;
        linearT = 1;
        start = null;
    }
    return {
        set: (state: t, runT?: number | ((t: number) => number)) => {
            if (runT) {
                linearT = typeof runT === "number" ? runT : runT(linearT);
                start = performance.now() - linearT * duration;
            }

            if (linearT >= 1 || linearT === 0) {
                linearT = 0;
                start = performance.now();
                lastState = initData();
                lastT = 0;
            } else {
                lastState = structuredClone(nowState);
                lastT = linearT;
            }

            willState = structuredClone(state);
            r();
        },
        stop: () => {
            stop();
        },
    };
}
