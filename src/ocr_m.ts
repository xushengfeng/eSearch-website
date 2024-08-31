import { pack } from "dkh-ui";

const latinLang = [
    "af",
    "az",
    "bs",
    "cs",
    "cy",
    "da",
    "de",
    "es",
    "et",
    "fr",
    "ga",
    "hr",
    "hu",
    "id",
    "is",
    "it",
    "ku",
    "la",
    "lt",
    "lv",
    "mi",
    "ms",
    "mt",
    "nl",
    "no",
    "oc",
    "pi",
    "pl",
    "pt",
    "ro",
    "rs_latin",
    "sk",
    "sl",
    "sq",
    "sv",
    "sw",
    "tl",
    "tr",
    "uz",
    "vi",
    "french",
    "german",
];
const arabicLang = ["ar", "fa", "ug", "ur"];
const cyrillicLang = [
    "ru",
    "rs_cyrillic",
    "be",
    "bg",
    "uk",
    "mn",
    "abq",
    "ady",
    "kbd",
    "ava",
    "dar",
    "inh",
    "che",
    "lbe",
    "lez",
    "tab",
];
const devanagariLang = ["hi", "mr", "ne", "bh", "mai", "ang", "bho", "mah", "sck", "new", "gom", "sa", "bgc"];

const url = {
    ch: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/ch.zip",
    en: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/en.zip",
    chinese_cht: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/chinese_cht.zip",
    korean: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/korean.zip",
    japan: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/japan.zip",
    te: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/te.zip",
    ka: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/ka.zip",
    ta: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/ta.zip",
    latin: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/latin.zip",
    arabic: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/arabic.zip",
    cyrillic: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/cyrillic.zip",
    devanagari: "https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/devanagari.zip",
};

const l = {
    ch: "中英混合",
    en: "英文",
    chinese_cht: "中文繁体",
    korean: "韩文",
    japan: "日文",
    te: "泰卢固文",
    ka: "卡纳达文",
    ta: "泰米尔文",
    latin: "拉丁文",
    arabic: "阿拉伯字母",
    cyrillic: "斯拉夫字母",
    devanagari: "梵文字母",
    af: "南非荷兰语",
    az: "阿塞拜疆语",
    bs: "波斯尼亚语",
    cs: "捷克语",
    cy: "威尔士语",
    da: "丹麦语",
    de: "德语",
    es: "西班牙语",
    et: "爱沙尼亚语",
    fr: "法语",
    ga: "爱尔兰语",
    hr: "克罗地亚语",
    hu: "匈牙利语",
    id: "印度尼西亚语",
    is: "冰岛语",
    it: "意大利语",
    ku: "库尔德语",
    la: "拉丁语",
    lt: "立陶宛语",
    lv: "拉脱维亚语",
    mi: "毛利语",
    ms: "马来语",
    mt: "马耳他语",
    nl: "荷兰语",
    no: "挪威语",
    oc: "奥克语",
    pi: "巴利语",
    pl: "波兰语",
    pt: "葡萄牙语",
    ro: "罗马尼亚语",
    rs_latin: "塞尔维亚语（拉丁文）",
    sk: "斯洛伐克语",
    sl: "斯洛文尼亚语",
    sq: "阿尔巴尼亚语",
    sv: "瑞典语",
    sw: "斯瓦希里语",
    tl: "菲律宾语",
    tr: "土耳其语",
    uz: "乌兹别克语",
    vi: "越南语",
    french: "法语",
    german: "德语",
    ar: "阿拉伯语",
    fa: "波斯语",
    ug: "维吾尔语",
    ur: "乌尔都语",
    ru: "俄语",
    rs_cyrillic: "塞尔维亚语（西里尔文）",
    be: "白俄罗斯语",
    bg: "保加利亚语",
    uk: "乌克兰语",
    mn: "蒙古语",
    abq: "阿布哈兹语",
    ady: "阿迪格语",
    kbd: "卡巴尔达语",
    ava: "阿瓦尔语",
    dar: "达尔格瓦语",
    inh: "印古什语",
    che: "车臣语",
    lbe: "列兹金语",
    lez: "雷兹语",
    tab: "塔巴萨兰语",
    hi: "印地语",
    mr: "马拉地语",
    ne: "尼泊尔语",
    bh: "比哈里语",
    mai: "迈蒂利语",
    ang: "古英语",
    bho: "博杰普尔语",
    mah: "马拉提语",
    sck: "西卡语",
    new: "尼瓦尔语",
    gom: "孔卡尼语",
    sa: "梵语",
    bgc: "哈尔穆克语",
};
const lel = document.getElementById("ocr_l") as HTMLSelectElement;
for (const k in l) {
    const el = document.createElement("option");
    el.innerText = l[k];
    el.value = k;
    lel.append(el);
}
lel.onchange = () => {
    getMName(lel.value);
};

const mListEl = document.getElementById("m_list");
for (const i in url) {
    const el = document.createElement("div");
    const a = document.createElement("a");
    a.href = url[i];
    a.download = "true";
    el.innerText = `${l[i]}`;
    a.setAttribute("data-cursor", "block");
    el.setAttribute("data-m", i);
    a.append(el);
    mListEl.append(a);
}

function getMName(lan: string) {
    let language: keyof typeof url = "ch";
    if (latinLang.includes(lan)) {
        language = "latin";
    } else if (arabicLang.includes(lan)) {
        language = "arabic";
    } else if (cyrillicLang.includes(lan)) {
        language = "cyrillic";
    } else if (devanagariLang.includes(lan)) {
        language = "devanagari";
    } else {
        language = lan as keyof typeof url;
    }
    for (const el of pack(mListEl).queryAll("div")) {
        console.log(el.el.dataset.m, language);

        if (el.el.dataset.m === language) {
            el.class("match_l");
        } else {
            el.el.classList.remove("match_l");
        }
    }
}

getMName("ch");
