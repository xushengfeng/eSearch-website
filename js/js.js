// 导航栏跳转
document.getElementById("nav").onclick = (e) => {
    window.scrollTo(0, document.getElementById(e.target.dataset.id).offsetTop - 48);
};

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
var platform_select = document.getElementById("platform");

function c_platform(platform) {
    switch (platform) {
        case "Windows":
            main_download.innerHTML = `<button id="exe">下载</button>`;
            platform_select.value = "Windows";
            break;
        case "Linux":
            main_download.innerHTML = `<button id="deb">下载deb</button><button id="rpm">下载rpm</button>`;
            platform_select.value = "Linux";
            break;
        case "macOS":
            main_download.innerHTML = `<button id="mac">下载</button>`;
            platform_select.value = "macOS";
            break;
        case "Android":
            main_download.innerHTML = `<button id="exe">下载</button>`;
            platform_select.value = "Windows";
            break;
        case "iOS":
            main_download.innerHTML = `<button id="mac">下载</button>`;
            platform_select.value = "macOS";
            break;
    }
}

c_platform(platform);

platform_select.oninput = () => {
    c_platform(platform_select.value);
};

// 首页动画
var tl = anime.timeline({
    easing: "easeOutExpo",
    duration: 800,
});

// Add children
tl.add({
    targets: "#svg_rect",
    width: "60%",
    height: "60%",
})
    .add({
        targets: "#svg_window",
        stroke: "#000",
        opacity: 1,
    })
    .add(
        {
            targets: "#svg_rect, #svg_bg",
            opacity: 0,
            duration: 100,
        },
        "-=800"
    )
    .add({
        targets: "#svg_selection",
        width: 60,
    })
    .add(
        {
            targets: "#svg_text",
            offset: "100%",
            "stop-color": "#fff",
        },
        "-=800"
    )
    .add({
        targets: "#svg_window",
        opacity: 0,
    })
    .add(
        {
            targets: "#svg_icon",
            x: 30,
            y: 0,
            width: 200,
            height: 200,
            opacity: 1,
        },
        "-=800"
    )
    .add(
        {
            targets: "#svg",
            width: "50%",
            height: 200,
            left: "50%",
            top: "50%",
            translateY: "-50%",
        },
        "-=800"
    )
    .add(
        {
            targets: "#main_left",
            opacity: 1,
        },
        "-=800"
    );

// 获取软件资源
var result;
var files_object = { none: { url: "", size: "暂无资源" } };

var requestOptions = {
    method: "GET",
    redirect: "follow",
};
fetch("https://api.github.com/repos/xushengfeng/eSearch/releases", requestOptions)
    .then((response) => response.text())
    .then((r) => {
        result = JSON.parse(r);
        version = `${result[0].tag_name}`;
        for (i in result[0].assets) {
            var url = result[0].assets[i].browser_download_url;
            var hz = url.split(".");
            hz = hz[hz.length - 1];
            files_object[hz] = {};
            files_object[hz].url = fasthub(url);
            files_object[hz].size = (result[0].assets[i].size / 1024 / 1024).toFixed(2);
        }
        show_download();
        show_log();
    })
    .catch((error) => console.log("error", error));
// 单资源没有时，转换为代替资源索引
function get_pl(hz) {
    var hz_list = { exe: "zip", deb: "gz", rpm: "deb", gz: "none" };
    i = 0;
    while (!files_object[hz]) {
        if (hz_list[hz]) {
            hz = hz_list[hz];
            i += 1;
            break;
        } else {
            hz = "none";
            break;
        }
    }
    return hz;
}
// 首页下载提示大小
main_download.onmouseover = (e) => {
    var hz = get_pl(e.target.id);
    if (e.target.id != "main_download")
        if (hz != "none") {
            e.target.title = `点击下载，共需${files_object[hz].size}MB`;
        } else {
            e.target.title = `${files_object[hz].size}`;
        }
};
main_download.onclick = (e) => {
    var url = fasthub(files_object[get_pl(e.target.id)].url);
    window.open(url);
};

fasturl = true;
document.getElementById("fastdownload").onclick = () => {
    fasturl = !fasturl;
    for (let i in files_object) {
        files_object[i].url = fasthub(files_object[i].url);
    }
    if (fasturl) {
        document.getElementById("fastdownload").innerText = "已使用快速下载链接";
        show_download();
    } else {
        document.getElementById("fastdownload").innerText = "已使用初始下载链接";
        show_download();
    }
};
function fasthub(url) {
    if (fasturl) {
        return url.replace("https://github.com", "https://download.fastgit.org");
    } else {
        return url.replace("https://download.fastgit.org", "https://github.com");
    }
}

// 下载界面添加按钮
function show_download() {
    var Windows_d = `<a target="_blank" href="${files_object.zip.url}"><div class="download_b"><span>.zip</span>绿色版 适用于Windows7+</div></a>`;
    document.querySelector("#Windows_d > div").innerHTML = Windows_d;
    var Linux_d = `<a target="_blank" href="${files_object.deb.url}"><div class="download_b"><span>.deb</span>适用于Debian, Ubuntu</div></a>
    <a target="_blank" href="${files_object.rpm.url}"><div class="download_b"><span>.rpm</span>适用于Red Hat, Fedora, SUSE</div></a>
    <a target="_blank" href="${files_object.gz.url}"><div class="download_b"><span>.tar.gz</span>适用于所有Linux</div></a>`;
    document.querySelector("#Linux_d > div").innerHTML = Linux_d;
    var macOS_d = `<a target="_blank" href="${result[0].zipball_url}"><div class="download_b"><span>.zip</span>从源代码编译</div></a>`;
    document.querySelector("#macOS_d > div").innerHTML = macOS_d;
    var source_d = `<a target="_blank" href="${result[0].tarball_url}"><div class="download_b"><span>.tar</span>tar压缩源代码</div></a>
    <a target="_blank" href="${result[0].zipball_url}"><div class="download_b"><span>.zip</span>zip压缩源代码</div></a>`;
    document.querySelector("#source_d > div").innerHTML = source_d;
}
// 旧版本下载
document.getElementById("download_old_b").onclick = () => {
    window.open("https://hub.fastgit.org/xushengfeng/eSearch/releases");
};

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

    for (i in result) {
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

// 导航栏logo自动
window.onscroll = () => {
    var cr = document.getElementById("svg_icon").getBoundingClientRect();
    if (cr.y + cr.height < 0) {
        document.getElementById("icon").className = "";
    } else {
        document.getElementById("icon").className = "icon_h";
    }
};
