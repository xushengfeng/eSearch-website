import photo_svg from "../assets/p.jpg";

// 导航栏跳转
document.getElementById("nav").onclick = (e) => {
    let el = <HTMLElement>e.target;
    if (el.dataset.id) {
        if (el.dataset.id == "eSearch") {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo(0, document.getElementById(el.dataset.id).offsetTop - 48);
        }
    }
};

var en_lang = document.querySelector("html").lang == "en";

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

var main_download = document.getElementById("main_download");
var platform_select = <HTMLSelectElement>document.getElementById("platform");

function c_platform(platform: string) {
    let d = en_lang ? "Donwload" : "下载";
    switch (platform) {
        case "Windows":
            main_download.innerHTML = `<button id=".exe">${d}</button>`;
            platform_select.value = "Windows";
            break;
        case "Linux":
            main_download.innerHTML = `<button id="_amd64.deb">${d} deb</button><button id=".x86_64.rpm">${d} rpm</button>`;
            platform_select.value = "Linux";
            break;
        case "macOS":
            main_download.innerHTML = `<button id=".dmg">${d}</button>`;
            platform_select.value = "macOS";
            break;
        case "Android":
            main_download.innerHTML = `<button id=".exe">${d}</button>`;
            platform_select.value = "Windows";
            break;
        case "iOS":
            main_download.innerHTML = `<button id=".dmg">${d}</button>`;
            platform_select.value = "macOS";
            break;
    }
}

c_platform(platform);

platform_select.oninput = () => {
    c_platform(platform_select.value);
};

var is_phone = window.matchMedia("(max-width: 900px)").matches;

// 获取软件资源
var result;
var v = "1.9.7";
var up_time = 1672486590000;
var files_object = {
    "-win.zip": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-win.zip`,
        size: `未知`,
    },
    ".exe": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch.Setup.${v}.exe`,
        size: `未知`,
    },
    ".tar.gz": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}.tar.gz`,
        size: `未知`,
    },
    "_amd64.deb": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch_${v}_amd64.deb`,
        size: `未知`,
    },
    ".x86_64.rpm": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}.x86_64.rpm`,
        size: `未知`,
    },
    ".aur": { url: ``, size: `未知` },
    ".dmg": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}.dmg`,
        size: `未知`,
    },
    "-mac.zip": {
        url: `https://github.com/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-mac.zip`,
        size: `未知`,
    },
};

var requestOptions = {
    method: "GET",
    redirect: "follow",
};
fetch("https://api.github.com/repos/xushengfeng/eSearch/releases", { method: "GET" })
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
            if (!files_object[hz]) continue;
            files_object[hz].size = (result[0].assets[i].size / 1024 / 1024).toFixed(2);
            files_object[hz].url = url;
        }
        up_time = new Date(result[0].published_at).getTime();
        v = result[0].name;
        show_download();
        show_log();
        show_push_time();
        load_other_download();
    })
    .catch((error) => {
        console.error("error", error);
        show_download();
        show_log_2();
    });
// 首页下载提示大小
main_download.onmouseover = (e) => {
    let el = <HTMLElement>e.target;
    var hz = el.id;
    if (el.id != "main_download")
        if (hz != "none") {
            el.title = `${en_lang ? "Click to download, total " : "点击下载，共需"}${files_object[hz].size}MB`;
        } else {
            el.title = `${files_object[hz].size}`;
        }
};
main_download.onclick = (e) => {
    let el = <HTMLElement>e.target;
    var url = fasthub(files_object[el.id].url);
    window.open(url);
};

// 中文地区使用fastgit
var fasturl = !en_lang;
if (document.getElementById("fastdownload"))
    document.getElementById("fastdownload").onclick = () => {
        fasturl = !fasturl;
        if (fasturl) {
            document.getElementById("fastdownload").innerText = "已使用快速下载链接";
        } else {
            document.getElementById("fastdownload").innerText = "已使用初始下载链接";
        }
        show_download();
        c_other_version_link();
    };
function fasthub(url: string) {
    const proxy_list = [
        "https://github.91chi.fun/",
        "https://ghproxy.com/",
        "https://proxy.zyun.vip/",
        "https://github.91chi.fun/",
        "https://git.xfj0.cn/",
        "https://ghps.cc/",
        "https://ghdl.feizhuqwq.cf/",
        "https://gh2.yanqishui.work/",
    ];
    let proxy = proxy_list[Math.floor(Math.random() * proxy_list.length)];
    if (fasturl) {
        return proxy + url;
    } else {
        return url;
    }
}

// 下载界面添加按钮
function show_download() {
    let a_l = document.getElementById("download").querySelectorAll("a");
    a_l[0].href = fasthub(files_object[".exe"].url);
    a_l[1].href = fasthub(files_object["-win.zip"].url);
    a_l[2].href = fasthub(files_object["_amd64.deb"].url);
    a_l[3].href = fasthub(files_object[".x86_64.rpm"].url);
    a_l[4].href = fasthub(files_object[".tar.gz"].url);
    a_l[5].href = fasthub(files_object[".dmg"].url);
    a_l[6].href = fasthub(files_object["-mac.zip"].url);
    a_l[7].href = fasthub(`https://github.com/xushengfeng/eSearch/archive/refs/tags/${v}.tar.gz`);
    a_l[8].href = fasthub(`https://github.com/xushengfeng/eSearch/archive/refs/tags/${v}.zip`);
}
// 旧版本下载
document.getElementById("download_old_b").onclick = () => {};
function c_other_version_link() {
    (<HTMLLinkElement>(
        document.querySelector("#download_old_b > a")
    )).href = `https://github.com/xushengfeng/eSearch/releases`;
}

var other_download_el = document.querySelector(".other_download").querySelectorAll("a");
function load_other_download() {
    other_download_el[1].href = "https://sourceforge.net/projects/e-search/files/" + v;
    other_download_el[2].href = "https://gitee.com/xsf-root/eSearch/releases/" + v;
}
load_other_download();

import markdownit from "markdown-it";
// 获取更新日志
function show_log() {
    // markdown渲染
    var md = markdownit({
        html: true,
        linkify: true,
        typographer: true,
    });
    // Remember old renderer, if overridden, or proxy to default renderer
    // 官方示例，链接新窗口打开
    var defaultRender =
        md.renderer.rules.link_open ||
        function (tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        // If you are sure other plugins can't add `target` - drop check below
        var aIndex = tokens[idx].attrIndex("target");

        if (aIndex < 0) {
            tokens[idx].attrPush(["target", "_blank"]); // add new attribute
        } else {
            tokens[idx].attrs[aIndex][1] = "_blank"; // replace value of existing attr
        }

        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
    };

    for (let i in result) {
        var li = document.createElement("li");
        var h = document.createElement("span");
        h.className = "log_v";
        h.innerText = result[i].tag_name;
        li.appendChild(h);
        var div = document.createElement("div");
        div.innerHTML = md.render(result[i].body);
        li.append(h, div);
        document.getElementById("log").appendChild(li);
    }
}
function show_log_2() {
    document.getElementById(
        "log"
    ).outerHTML = `<a href="https://github.com/xushengfeng/eSearch/releases" target="_bank">无法获取所有日志，请前往此镜像链接查看</a>`;
}

const push_time_text = document.getElementById("main_left").querySelector("h3").innerText;
function show_push_time() {
    let t = new Date().getTime();
    let dt = t - up_time;
    let dd = String((dt / (24 * 60 * 60 * 1000)) >> 0);

    document.getElementById("main_left").querySelector("h3").innerText = push_time_text
        .replace("{v}", v)
        .replace("{dd}", dd);
}
show_push_time();

document.getElementById("gn_tz").onclick = (e) => {
    for (let i in document.getElementById("gn_tz").querySelectorAll("div")) {
        if (document.getElementById("gn_tz").querySelectorAll("div")[i] == e.target) {
            window.scrollTo(0, (<HTMLElement>document.querySelectorAll(".gn_b")[i]).offsetTop);
        }
    }
};

const clip_editor = document.getElementById("clip_editor") as HTMLCanvasElement;
let img = document.createElement("img");
img.src = photo_svg;
img.onload = () => {
    clip_editor.getContext("2d").drawImage(img, 0, -100);
};
const editor_t = document.querySelector(".gn_clip_editor > .editor_t") as HTMLElement;
let ob = new IntersectionObserver(
    (e) => {
        console.log(e[0]);
        if (e[0].intersectionRatio > 0.5) {
            clip_editor.style.transform = `scale(200)`;
            editor_t.classList.add("editor_t_big");
        } else {
            clip_editor.style.transform = ``;
            editor_t.classList.remove("editor_t_big");
        }
    },
    { threshold: 0.5 }
);
ob.observe(clip_editor.parentElement);

setInterval(() => {
    var i = Math.random();
    document.getElementById("opacity_b").style.left = i * 184 + "px";
    document.getElementById("opacity_p").innerHTML = Math.round(i * 100) + "%";
    (<HTMLElement>document.querySelector(".opacity_win")).style.opacity = String(i);
}, 1000);

var back = false;
(<HTMLElement>document.querySelector(".desk")).onclick = () => {
    back = !back;
    let back_win = <HTMLElement>document.querySelector(".back_win");
    if (back) {
        back_win.style.left = "20px";
        back_win.style.top = "20px";
    } else {
        back_win.style.left = "";
        back_win.style.top = "";
    }
};

(<HTMLElement>document.querySelector("#ding_p > :nth-child(3)")).style.height =
    (<HTMLElement>document.querySelector("#ding_p > :nth-child(2)")).offsetHeight - 16 + "px";
(<HTMLElement>document.querySelector(".ct_win")).style.top =
    (<HTMLElement>document.querySelector("#ding_p > :nth-child(3) > :nth-child(3)")).offsetTop + "px";
