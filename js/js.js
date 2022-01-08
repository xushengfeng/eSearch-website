var userAgent = navigator.userAgent.toLowerCase();
var platform = "Unknown";
if (userAgent.indexOf("win") > -1) {
    platform = "Windows";
} else if (userAgent.indexOf("iphone") > -1) {
    platform = "Iphone";
} else if (userAgent.indexOf("mac") > -1) {
    platform = "Mac";
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
switch (platform) {
    case "Windows":
        main_download.innerHTML = `<button id="exe"></button>`;
        platform_select.value = "win";
        break;
    case "Linux":
        main_download.innerHTML = `<button id="deb">下载deb</button><button id="rpm">下载rpm</button>`;
        platform_select.value = "linux";
        break;
    case "Mac":
        main_download.innerHTML = `<button id="mac"></button>`;
        platform_select.value = "mac";
        break;
    case "Android":
        main_download.innerHTML = `<button id="exe"></button>`;
        platform_select.value = "win";
        break;
    case "Iphone":
        main_download.innerHTML = `<button id="mac"></button>`;
        platform_select.value = "mac";
        break;
}

var result;
var files_object = {};

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
        show_log();
    })
    .catch((error) => console.log("error", error));

main_download.onmouseover = (e) => {
    if (e.target.id != "main_download") e.target.title = `点击下载，共需${files_object[e.target.id].size}MB`;
};
main_download.onclick = (e) => {
    var url = files_object[e.target.id].url;
    url = url.replace("https://github.com", "https://download.fastgit.org");
    window.open(url);
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
