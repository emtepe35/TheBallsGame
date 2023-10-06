import { Game } from "./classes/pf.js";

let ob = new Game();
console.log(ob)

export let compareArr = (a: { x: number, y: number }[], b: { x: number, y: number }[]) => {
    if (a.length == b.length) {
        for (let i = 0; i < a.length; i++) {
            if (a[i].x != b[i].x || a[i].y != b[i].y) { return false; }
        }
    }
    return true;
}

