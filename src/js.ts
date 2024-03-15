import { el } from "redom";

let infintyBento: { x: number; y: number; w: number; h: number; gapX: number; gapY: number; el: HTMLElement }[] = [];
const blockSize = 360;

const b = document.getElementById("bento");

function r(rect: { x: number; y: number; w: number; h: number }) {
    for (let i of infintyBento) {
        let cx = Math.floor((rect.x - i.x) / (i.w + i.gapX));
        let cy = Math.floor((rect.y - i.y) / (i.h + i.gapY));
        if (i.x + cx * (i.w + i.gapX) + i.w < rect.x) cx++;
        if (i.y + cy * (i.h + i.gapY) + i.h < rect.y) cy++;
        let el = i.el;
        el.style.left = (i.x + cx * (i.w + i.gapX)) * blockSize + "px";
        el.style.top = (i.y + cy * (i.w + i.gapY)) * blockSize + "px";
        el.style.width = i.w * blockSize + "px";
        el.style.height = i.h * blockSize + "px";
        console.log(cx, cy);
    }
}

let x = 0;
let y = 0;
document.onwheel = (e) => {
    x -= e.deltaX;
    y -= e.deltaY;
    b.style.left = x + "px";
    b.style.top = y + "px";
    r({ x: -x / blockSize, y: -y / blockSize, w: 10, h: 10 });
};

function initBento() {
    b.innerHTML = "";

    for (let i of infintyBento) {
        b.append(i.el);
    }

    r({ x: 0, y: 0, w: 10, h: 10 });
}

const navTipEl = el("div");
navTipEl.append("滚动或拖动来查看");

infintyBento.push({ x: 0, y: 0, w: 1, h: 1, gapX: 4, gapY: 4, el: navTipEl });

initBento();
