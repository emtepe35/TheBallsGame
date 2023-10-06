/**
 * This is the doc comment for ball.ts
 *
 * @module Ball
 */

import { balls } from "./pf.js";

export class Ball {
    color: string;
    ball: HTMLDivElement;
    selected: boolean;
    constructor(color: string) {
        this.color = color;
        this.selected = false;

        this.ball = document.createElement("div");
        this.ball.className = 'ball';
        this.ball.style.backgroundColor = this.color;

        this.ball.onclick = () => { this.select() };
        this.ball.onmouseover = () => { this.hover() };
        this.ball.onmouseout = () => { this.out() };
    }
    public get() {
        return this.ball;
    }
    public get_color() {
        return this.color;
    }
    public noclick() {
        this.ball.onclick = () => { };
    }
    private select() {
        if (!this.selected) {
            this.unselectAll();
            this.selected = true;
            this.ball.style.width = '30px';
            this.ball.style.height = '30px';
            this.ball.style.borderRadius = '15px';
        } else { this.unselectAll() };

    }
    private unselect() {
        this.selected = false;
        this.ball.style.width = '40px';
        this.ball.style.height = '40px';
        this.ball.style.borderRadius = '20px';
    }
    private unselectAll() {
        balls.forEach(element => {
            element.unselect();
        });
    }
    private hover() {
        if (!this.selected) {
            this.ball.style.width = '44px';
            this.ball.style.height = '44px';
            this.ball.style.borderRadius = '22px';
        }
    }
    private out() {
        if (!this.selected) {
            this.ball.style.width = '40px';
            this.ball.style.height = '40px';
            this.ball.style.borderRadius = '20px';
        }
    }
    public nohover() {
        this.ball.onmouseover = () => { };
    }
}