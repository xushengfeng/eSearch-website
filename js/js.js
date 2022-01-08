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

// 'https://download.fastgit.org/xushengfeng/eSearch/releases/download/1.2.6/esearch-1.2.6-1.x86_64.rpm'
host = "https://download.fastgit.org/xushengfeng/eSearch/releases/download/";
version = "1.2.6/";
main_download.onclick = (e) => {
    switch (e.target.id) {
        case "exe":
            window.open(host + version + "esearch.exe");
            break;
        case "zip":
            window.open(host + version + "eSearch-win32-x64.zip");
            break;
        case "deb":
            window.open(host + version + "esearch_1.2.6_amd64.deb");
            break;
        case "rpm":
            window.open(host + version + "esearch-1.2.6-1.x86_64.rpm");
            break;
        case "targz":
            window.open(host + version + "eSearch-linux-x64.tar.gz");
            break;
        case "mac":
            window.open(host + version + "");
            break;
    }
};
