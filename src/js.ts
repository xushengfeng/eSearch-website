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

let x = window.innerWidth / 2 - blockSize / 2;
let y = window.innerHeight / 2 - blockSize / 2;
const repeatX = 10;
const repeatY = 6;

document.onwheel = (e) => {
    x -= e.deltaX;
    y -= e.deltaY;
    moveB(x, y);
};

function moveB(x: number, y: number) {
    b.style.left = x + "px";
    b.style.top = y + "px";
    r({ x: -x / blockSize, y: -y / blockSize }, repeatX, repeatY);
}

function initBento() {
    b.innerHTML = "";

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

fetch("https://api.github.com/repos/xushengfeng/eSearch/releases?per_page=100", { method: "GET" })
    .then((response) => response.text())
    .then((r) => {
        let result = JSON.parse(r);
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

const logEl = el("div", title("更新记录"));

const recordEl = el("div", title("录屏"));

const y以图搜图 = el("div", title("以图搜图"));

const x形状 = el("div", title("多种形状"));

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

infintyBento.push({ x: 3, y: -1, w: 1, h: 1, el: el("div", title("自定义搜索引擎")) }); // 搜索引擎
infintyBento.push({ x: 3, y: 0, w: 1, h: 1, el: el("div", title("背景模糊")) }); // 背景模糊
infintyBento.push({
    x: 3,
    y: 1,
    w: 1,
    h: 1,
    el: el(
        "div",
        el("a", { class: "star", href: "https://github.com/xushengfeng/eSearch", target: "_blank" }, [
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
infintyBento.push({ x: 0, y: 2, w: 1, h: 1, el: el("div", title("跨平台")) }); // 跨平台
infintyBento.push({ x: -1, y: 3, w: 2, h: 1, el: el("div", title("开源")) }); // 开源
infintyBento.push({
    x: 1,
    y: 4,
    w: 1,
    h: 1,
    el: el(
        "div",
        title("新特性"),
        el("a", { class: "center", href: "https://github.com/xushengfeng/eSearch/releases" }, t("测试版尝鲜"))
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
infintyBento.push({
    x: -1,
    y: 1,
    w: 1,
    h: 1,
    el: el("div", title("取色器")),
});
infintyBento.push({
    x: -1,
    y: 2,
    w: 1,
    h: 1,
    el: el("div", title("二维码")),
});
infintyBento.push({
    x: 4,
    y: 0,
    w: 1,
    h: 1,
    el: el("div", title("按键提示")),
});
infintyBento.push({
    x: -2,
    y: 1,
    w: 1,
    h: 4,
    el: el("div", title("滚动截屏")),
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
infintyBento.push({
    x: 4,
    y: 1,
    w: 2,
    h: 1,
    el: el("div", title("多屏幕")),
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

initBento();
