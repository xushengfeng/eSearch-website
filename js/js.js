// 导航栏跳转
document.getElementById("nav").onclick = (e) => {
    let el = e.target;
    if (el.dataset.id) {
        if (el.dataset.id == "eSearch") {
            window.scrollTo(0, 0);
        }
        else {
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
}
else if (userAgent.indexOf("iphone") > -1) {
    platform = "iOS";
}
else if (userAgent.indexOf("mac") > -1) {
    platform = "macOS";
}
else if (userAgent.indexOf("linux") > -1) {
    if (userAgent.indexOf("android") > -1) {
        platform = "Android";
    }
    else {
        platform = "Linux";
    }
}
else {
    platform = "Unknown";
}
var main_download = document.getElementById("main_download");
var platform_select = document.getElementById("platform");
function c_platform(platform) {
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
var v = "1.6.0";
var files_object = {
    "-win.zip": {
        url: `https://hub.fastgit.xyz/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-win.zip`,
        size: `未知`,
    },
    ".exe": {
        url: `https://hub.fastgit.xyz/xushengfeng/eSearch/releases/download/${v}/eSearch.Setup.${v}.exe`,
        size: `未知`,
    },
    ".tar.gz": {
        url: `https://hub.fastgit.xyz/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}.tar.gz`,
        size: `未知`,
    },
    "_amd64.deb": {
        url: `https://hub.fastgit.xyz/xushengfeng/eSearch/releases/download/${v}/eSearch_${v}_amd64.deb`,
        size: `未知`,
    },
    ".x86_64.rpm": {
        url: `https://hub.fastgit.xyz/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}.x86_64.rpm`,
        size: `未知`,
    },
    ".aur": { url: ``, size: `未知` },
    ".dmg": {
        url: `https://hub.fastgit.xyz/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}.dmg`,
        size: `未知`,
    },
    "-mac.zip": {
        url: `https://hub.fastgit.xyz/xushengfeng/eSearch/releases/download/${v}/eSearch-${v}-mac.zip`,
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
    for (let i in result[0].assets) {
        let url = result[0].assets[i].browser_download_url;
        let name = result[0].assets[i].name;
        let hz = name.replace(/e-?[sS]earch.+[0-9]\.[0-9]\.[0-9]/, "");
        files_object[hz].url = fasthub(url);
        files_object[hz].size = (result[0].assets[i].size / 1024 / 1024).toFixed(2);
    }
    show_download();
    show_log();
})
    .catch((error) => {
    console.error("error", error);
    show_download();
    show_log_2();
});
// 首页下载提示大小
main_download.onmouseover = (e) => {
    let el = e.target;
    var hz = el.id;
    if (el.id != "main_download")
        if (hz != "none") {
            el.title = `${en_lang ? "Click to download, total " : "点击下载，共需"}${files_object[hz].size}MB`;
        }
        else {
            el.title = `${files_object[hz].size}`;
        }
};
main_download.onclick = (e) => {
    let el = e.target;
    var url = fasthub(files_object[el.id].url);
    window.open(url);
};
// 中文地区使用fastgit
var fasturl = !en_lang;
if (document.getElementById("fastdownload"))
    document.getElementById("fastdownload").onclick = () => {
        fasturl = !fasturl;
        for (let i in files_object) {
            files_object[i].url = fasthub(files_object[i].url);
        }
        if (fasturl) {
            document.getElementById("fastdownload").innerText = "已使用快速下载链接";
        }
        else {
            document.getElementById("fastdownload").innerText = "已使用初始下载链接";
        }
        show_download();
        c_other_version_link();
    };
function fasthub(url) {
    if (fasturl) {
        return url.replace("https://github.com", "https://download.fastgit.org");
    }
    else {
        return url.replace("https://download.fastgit.org", "https://github.com");
    }
}
// 下载界面添加按钮
function show_download() {
    let a_l = document.getElementById("download").querySelectorAll("a");
    a_l[0].href = files_object[".exe"].url;
    a_l[1].href = files_object["-win.zip"].url;
    a_l[2].href = files_object["_amd64.deb"].url;
    a_l[3].href = files_object[".x86_64.rpm"].url;
    a_l[4].href = files_object[".tar.gz"].url;
    a_l[5].href = files_object[".dmg"].url;
    a_l[6].href = files_object["-mac.zip"].url;
    a_l[7].href = `https://${fasturl ? "hub.fastgit.xyz" : "github.com"}/xushengfeng/eSearch/archive/refs/tags/${v}.tar.gz`;
    a_l[8].href = `https://${fasturl ? "hub.fastgit.xyz" : "github.com"}/xushengfeng/eSearch/archive/refs/tags/${v}.zip`;
}
// 旧版本下载
document.getElementById("download_old_b").onclick = () => { };
function c_other_version_link() {
    document.querySelector("#download_old_b > a").href = `https://${fasturl ? "hub.fastgit.xyz" : "github.com"}/xushengfeng/eSearch/releases`;
}
var other_download_el = document.querySelector(".other_download").querySelectorAll("a");
other_download_el[1].href += v;
other_download_el[2].href += v;
// 获取更新日志
function show_log() {
    // markdown渲染
    var md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true,
    });
    // Remember old renderer, if overridden, or proxy to default renderer
    // 官方示例，链接新窗口打开
    var defaultRender = md.renderer.rules.link_open ||
        function (tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        // If you are sure other plugins can't add `target` - drop check below
        var aIndex = tokens[idx].attrIndex("target");
        if (aIndex < 0) {
            tokens[idx].attrPush(["target", "_blank"]); // add new attribute
        }
        else {
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
    document.getElementById("log").outerHTML = `<a href="https://hub.fastgit.xyz/xushengfeng/eSearch/releases" target="_bank">无法获取所有日志，请前往此镜像链接查看</a>`;
}
document.onscroll = () => {
    main_an();
    ocr_an();
    search_an();
};
var animation_main = anime({
    targets: "#eSearch",
    easing: "easeInOutCubic",
    autoplay: false,
    update: (anim) => {
        if (Math.round(anim.progress) >= 30) {
            document.getElementById("eSearch").style.pointerEvents = "none";
        }
        else {
            document.getElementById("eSearch").style.pointerEvents = "";
        }
        // 导航栏logo自动隐藏
        if (Math.round(anim.progress) >= 100) {
            document.getElementById("icon").className = "";
        }
        else {
            document.getElementById("icon").className = "icon_h";
        }
    },
});
function main_an() {
    var bcr = document.querySelector("body").getBoundingClientRect();
    var scroll_percent = (bcr.top + document.documentElement.clientHeight) / document.documentElement.clientHeight;
    scroll_percent = 1 - scroll_percent;
    scroll_percent = scroll_percent * 1.2;
    animation_main.seek(animation_main.duration * scroll_percent);
}
var animation = anime({
    targets: "#search span, #translate span",
    translateY: function () {
        var i = anime.random(0, 1);
        i = (i - 0.5) * 2;
        return i * 40 + "vh";
    },
    opacity: 0,
    delay: function () {
        return anime.random(0, 100);
    },
    easing: "easeInQuint",
    autoplay: false,
});
function search_an() {
    var bcr = document.getElementById("search_p").getBoundingClientRect();
    var scroll_percent = bcr.top / document.documentElement.clientHeight;
    scroll_percent = scroll_percent * 1.2 - 0.2;
    animation.seek(animation.duration * scroll_percent);
}
var tl2 = anime.timeline({
    easing: "easeInOutCubic",
    duration: 800,
});
// Add children
if (!is_phone)
    tl2.add({
        targets: "#ocr_p > :nth-child(2)",
        width: "0",
    }).add({
        targets: "#ocr_p > :nth-child(3)",
        opacity: 0,
    }, "-=800");
function ocr_an() {
    var bcr = document.getElementById("ocr_p").getBoundingClientRect();
    var scroll_percent = bcr.top / document.documentElement.clientHeight;
    scroll_percent = scroll_percent * 1.2 - 0.2;
    tl2.seek(tl2.duration * scroll_percent);
}
document.onkeydown = (e) => {
    var bcr = document.getElementById("gn_keyboard").getBoundingClientRect();
    var o = {
        ArrowUp: "up",
        w: "up",
        ArrowRight: "right",
        d: "right",
        ArrowDown: "down",
        s: "down",
        ArrowLeft: "left",
        a: "left",
    };
    var arrow, d;
    arrow = o[e.key];
    if (document.getElementById(`key_${e.key}`)) {
        document.getElementById(`key_${e.key}`).className = "kbd_b";
        if (bcr.top + bcr.height >= 0)
            e.preventDefault();
    }
    if (e.ctrlKey) {
        document.getElementById("key_ctrl").className = "kbd_b";
        d = 5;
    }
    else if (e.shiftKey) {
        document.getElementById("key_shift").className = "kbd_b";
        d = 10;
    }
    else {
        d = 1;
    }
    let key_el = document.querySelector(".gn_clip_keyboard_c > :nth-child(4)");
    let xx = key_el.style.left || "0";
    let yy = key_el.style.top || "0";
    let x = Number(xx.replace("px", ""));
    let y = Number(yy.replace("px", ""));
    switch (arrow) {
        case "up":
            key_el.style.left = x + "px";
            key_el.style.top = y - d + "px";
            break;
        case "right":
            key_el.style.left = x + d + "px";
            key_el.style.top = y + "px";
            break;
        case "down":
            key_el.style.left = x + "px";
            key_el.style.top = y + d + "px";
            break;
        case "left":
            key_el.style.left = x - d + "px";
            key_el.style.top = y + "px";
            break;
    }
};
document.onkeyup = (e) => {
    if (document.getElementById(`key_${e.key}`))
        document.getElementById(`key_${e.key}`).className = "";
    if (e.key == "Control")
        document.getElementById("key_ctrl").className = "";
    if (e.key == "Shift")
        document.getElementById("key_shift").className = "";
};
setInterval(() => {
    var i = Math.random();
    document.getElementById("opacity_b").style.left = i * 184 + "px";
    document.getElementById("opacity_p").innerHTML = Math.round(i * 100) + "%";
    document.querySelector(".opacity_win").style.opacity = String(i);
}, 1000);
var back = false;
document.querySelector(".desk").onclick = () => {
    back = !back;
    let back_win = document.querySelector(".back_win");
    if (back) {
        back_win.style.left = "20px";
        back_win.style.top = "20px";
    }
    else {
        back_win.style.left = "";
        back_win.style.top = "";
    }
};
document.querySelector("#ding_p > :nth-child(3)").style.height =
    document.querySelector("#ding_p > :nth-child(2)").offsetHeight - 16 + "px";
document.querySelector(".ct_win").style.top =
    document.querySelector("#ding_p > :nth-child(3) > :nth-child(3)").offsetTop + "px";
