/**
 * This is the doc comment for block.ts
 *
 * @module Block
 */

import { setHover } from "./pf.js";

export class Block {
    id: string
    className: string
    div: HTMLDivElement

    constructor(id: string, className: string) {
        this.id = id;
        this.className = className;

        this.div = document.createElement("div");
        this.div.id = this.id;
        this.div.className = this.className;

        this.hover();
    }
    public get_div() { //ZWRACA BLOK
        return this.div;
    }
    public update_color(rgba: string) { //ZMIENIA KOLOR BLOKU
        this.div.style.backgroundColor = rgba;
    }
    public get_ball() {
        if (this.div.children.length > 0) {
            return this.div.children[0];
        }
        return null;
    }
    public addBall(ball: HTMLDivElement, callback: Function) { //DODAJE KULKE DO BLOKU
        this.div.appendChild(ball);
        let pom = this.id.split('-')
        let id = { x: parseInt(pom[1]), y: parseInt(pom[2]) };
        callback(id)
    }
    public removeBall() {  //USUWA KULKE Z BLOKU
        this.div.innerHTML = '';
    }
    public haveBall() {    //ZWRACA TRUE JESLI BLOCK ZAWIERA KULKE
        if (this.div.children.length > 0) {
            return true;
        }
        return false;
    }
    private hover() {   //ZWRACA BLOK NAD KTORYM JEST MYSZKA DO hover W GAME
        this.div.onmouseover = () => { setHover(this.get_div()) }
    }
}
