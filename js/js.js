document.getElementById("nav").onclick = (e) => {
    window.scrollTo(0, document.getElementById(e.target.dataset.id).offsetTop);
};

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
        console.log(result);
        version = `${result[0].tag_name}`;
        for (i in result[0].assets) {
            var url = result[0].assets[i].browser_download_url;
            var hz = url.split(".");
            hz = hz[hz.length - 1];
            files_object[hz] = {};
            files_object[hz].url = url;
            files_object[hz].size = (result[0].assets[i].size / 1024 / 1024).toFixed(2);
        }
        show_download_old();
        show_log();
    })
    .catch((error) => console.log("error", error));

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
    var url = files_object[get_pl(e.target.id)].url;
    url = url.replace("https://github.com", "https://download.fastgit.org");
    window.open(url);
};

function show_download_old() {
    t = "";
    for (i = 1; i < result.length; i++) {
        t += `<div><h2>${result[i].tag_name}</h2>`;
        for (j in result[i].assets)
            t += `<a target="_blank" href="${result[i].assets[j].browser_download_url}">${result[i].assets[j].name}</a><br>`;
        t += "</div>";
    }
    document.getElementById("download_old").innerHTML = t;
}

download_old_showed = false;
document.getElementById("download_old_b").onclick = () => {
    download_old_showed = !download_old_showed;
    if (download_old_showed) {
        document.getElementById("download_old").className = "download_old_showed";
    } else {
        document.getElementById("download_old").className = "";
    }
};

function show_log() {
    for (i in result) {
        var li = document.createElement("li");
        var h = document.createElement("h2");
        h.innerText = result[i].tag_name;
        li.appendChild(h);
        var div = document.createElement("div");
        div.innerText = result[i].body;
        li.append(h, div);
        document.getElementById("log").appendChild(li);
    }
}
