/**
 * This is the doc comment for pf.ts
 *
 * @module Game
 */

import { Block } from './block.js'
import { Ball } from './ball.js';

export class Game implements kulki {
    tab: number[][] = []; /* Keeps the number representation of game elements*/
    block_tab: Block[][] = [];
    selected: { x: number, y: number, value: number }[] = [];
    x_size: number;
    y_size: number;
    toPush: number[];
    direction: xy[];
    colors: string[];
    clickcount: number = 0;
    found: boolean = false;
    next_colors: string[] = [];
    pathExists: boolean = true;
    pause: boolean = false;
    score: number = 0;
    lastWasKill: boolean = false;

    constructor() {
        this.x_size = 9;
        this.y_size = 9;
        this.toPush = [-3, -2];
        this.direction = [{ x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 1 }];
        this.colors = ['red', 'lime', 'yellow', 'purple', 'DarkCyan', 'blue', 'black'];

        this.fillArr();
        this.print();
        this.makeThreeRandomColors();
        this.updateNextBalls();
        this.makeRandomBalls(3);
    }

    /**
       * Internal method used by Game
       * fills the array with zeros and empty Blocks
       * @public
       */
    private fillArr() {
        for (let x = 0; x < this.x_size; x++) {
            this.tab[x] = [];
            this.block_tab[x] = [];
            for (let y = 0; y < this.y_size; y++) {
                this.tab[x][y] = 0;
                this.block_tab[x][y] = new Block('', '');
            }
        }
    }

    /**
   * Internal method used by Game
   * @param quant number of balls to generate
   * @param col color of the new ball
   * @public
   */
    private makeRandomBalls = (quant: number, col?: string): void => {     //Dodaje losowe kulki (quant = ilość)
        if (this.countZeros() >= quant) {
            for (let i = 0; i < quant; i++) {
                let _x: number = this.getRandomInt(0, this.x_size - 1);
                let _y: number = this.getRandomInt(0, this.y_size - 1);
                let _color: string;
                if (col == undefined) { _color = this.next_colors[i] }
                else { _color = col }
                if (this.tab[_x][_y] == 0) {
                    this.tab[_x][_y] = this.colors.indexOf(_color) - 10;
                    let ball = this.createBall(_color)
                    this.block_tab[_x][_y].addBall(ball.get(), this.checkScore);
                }
                else { this.makeRandomBalls(1, _color) }
            }
            if (quant > 1) {
                this.makeThreeRandomColors();
                this.updateNextBalls();
            }
        } else {
            alert('PRZEGRALES, twój wynik to ' + String(this.score))
        }

    }
    private countZeros(): number {
        let counter = 0;
        this.tab.forEach(x => {
            x.forEach(y => {
                if (y == 0) {
                    counter++;
                }
            });
        });
        return counter;
    }
    /**
   * Internal method used by Game
   * generates three random colors for the next balls to render
   * @public
   */
    private makeThreeRandomColors(): void {
        this.next_colors = []
        for (let i = 0; i < 3; i++) {
            let _color: number = this.getRandomInt(0, 6);
            this.next_colors.push(this.colors[_color]);
        }
    }

    /**
   * Internal method used by Game
   * Updates the box with next balls prediction with generated colors
   * @public
   */
    private updateNextBalls(): void {
        this.checkWin();
        document.getElementById("next")!.innerHTML = '';
        this.next_colors.forEach(element => {
            let ball = new Ball(element);
            ball.noclick();
            ball.nohover();
            document.getElementById("next")?.appendChild(ball.get());
        });
    }

    /**
   * Internal method used by Game
   * Creates the new Ball with color
   * @param color color of the new ball
   * @returns Ball class element
   * @public
   */
    private createBall(color: string): Ball { //TWORZY KULKĘ O DANYM KOLORZE
        let ball = new Ball(color);
        balls.push(ball)
        return ball;
    }

    /**
   * Internal method used by Game
   * generates random int
   * @param min minimum value
   * @param max maximum value
   * @public
   */
    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    /**
   * Internal method used by Game
   * void method to print div elements by tab
   * @public
   */
    private print(): void {
        let parent = document.createElement("div")
        parent.id = "box"
        for (let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                let div = new Block("block-" + String(x) + '-' + String(y), "block")
                this.block_tab[x][y] = div;
                this.clickEvent(div.get_div(), x, y);
                parent.appendChild(div.get_div())
            }
        }
        this.mouseoverEvent(parent);

        let next_box = document.createElement("div");
        next_box.id = "next_box";
        let next = document.createElement("div")
        next.id = "next";
        let next_text = document.createElement("div")
        next_text.id = "next_text";
        next_text.innerHTML = 'Następne:'

        let score_box = document.createElement("div");
        score_box.id = "score_box";
        let score = document.createElement("p")
        score.id = "score_text";
        score.innerHTML = 'Wynik: 0'

        score_box.appendChild(score);

        next_box.appendChild(score_box);
        next_box.appendChild(next_text);
        next_box.appendChild(next)

        document.getElementById("body")?.appendChild(next_box);
        document.getElementById("body")?.appendChild(parent);
    }

    /**
   * Internal method used by Game
   * @param element div block which was clicked
   * @param x x location
   * @param y y location
   * @public
   */
    private clickEvent(element: HTMLDivElement, x: number, y: number): void {
        element.onclick = () => {
            if (this.neighbourIsRed({ x: x, y: y }) || this.block_tab[x][y].haveBall() && !this.pause) {
                this.lastWasKill = false;
                this.selectService(x, y);
            }

        }
    }
    /**
   * Internal method used by Game
   * reads the element under the mouse and sets the target for the path if starting point exists
   * @event onmouseover mouseover
   * @param box element under the mouse cursor
   * @public
   */
    private mouseoverEvent(box: HTMLDivElement): void {
        box.onmouseover = () => {
            if (hover && this.clickcount == 1) {
                let loc = hover.id.split('-')
                let pos = { x: parseInt(loc[1]), y: parseInt(loc[2]) };
                if (this.tab[pos.x][pos.y] >= 0) {
                    this.clear2ndStep();
                    this.tab[pos.x][pos.y] = -2;
                    this.found = false;
                    this.findPath([{ x: pos.x, y: pos.y }], 1);
                    if (this.neighbourIsRed({ x: pos.x, y: pos.y })) {
                        this.block_tab[pos.x][pos.y].update_color('rgba(255,0,0,0.5)');
                    }

                } else if (this.tab[pos.x][pos.y] == -3) {
                    this.clear2ndStep();
                }
            }
        }
    }
    /**
   * Internal method used by Game
   * checks if any element close to selected is highlighted
   * @param m xy location of block
   * @public
   */
    private neighbourIsRed(m: xy): boolean {
        let a = this.getAnyNeighbour({ x: m.x, y: m.y })
        for (let i = 0; i < a.length; i++) {
            if (this.block_tab[a[i].x][a[i].y].div.style.backgroundColor === 'rgba(255, 0, 0, 0.5)') {
                return true;
            } else if (i == a.length - 1) {
                return false;
            }
        }
        return false;

    }
    /**
       * Internal method used by Game
       * cancels the target point
       * @example player moved the mouse to another target block
       * @public
       */
    private clear2ndStep(): void {
        for (let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                if (this.tab[x][y] == -2 || this.tab[x][y] > 0) {
                    this.tab[x][y] = 0;
                    this.block_tab[x][y].update_color('rgba(255,255,255,1)')
                }
            }
        }
    }
    /**
   * Internal method used by Game
   * clears the path
   * @example player deselected the ball and path need to disappear
   * @public
   */
    private clearSelection(): void {  //USUWA CAŁĄ SCIEŻKĘ
        for (let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                if (this.tab[x][y] == -2 || this.tab[x][y] > 0) {
                    this.tab[x][y] = 0;
                }
                if (this.tab[x][y] == -3) {
                    this.tab[x][y] = this.selected[0].value;
                }
                this.block_tab[x][y].update_color('rgba(255,255,255,1)')
            }
        }
        this.clickcount = 0;
        this.selected = [];
    }
    /**
   * Internal method used by Game
   * highlights the confirmed path to gray color
   * @public
   */
    private markOldPath(): void { //Zaznacza na szaro starą ścieżkę
        for (let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                if (this.block_tab[x][y].div.style.backgroundColor === 'rgba(255, 0, 0, 0.5)') {
                    this.block_tab[x][y].update_color('rgba(120,120,120,0.8)')
                }
            }
        }
    }
    /**
       * Internal method used by Game
       * selects the block and puts the ball if it's free
       * @param x x location
       *  @param y y location
       * @public
       */
    private selectService(x: number, y: number): void {
        if (this.clickcount < this.toPush.length) {
            let war1 = this.block_tab[x][y].haveBall() && this.clickcount == 0;
            let war2 = !this.block_tab[x][y].haveBall() && this.clickcount > 0;
            if (war1 || war2) {
                this.selected.push({ x: x, y: y, value: this.tab[x][y] })
                this.tab[x][y] = this.toPush[this.clickcount];
                this.block_tab[x][y].update_color('rgba(255,0,0,0.5)');
                this.clickcount++;
                if (this.clickcount == 2) {
                    this.markOldPath();
                    this.pause = true;
                    setTimeout(() => {
                        this.moveBall(this.selected[0], x, y);
                        this.clearSelection();
                        if (!this.lastWasKill) { this.makeRandomBalls(3); }

                        this.pause = false;
                    }, 1000)

                }
            } else if (this.selected[0] && (this.selected[0].x == x && this.selected[0].y == y)) {
                this.clearSelection();
            } else {
                this.clearSelection();
                this.selectService(x, y);
            }
        }
    }
    /**
   * Internal method used by Game
   * moves the ball to new location
   * @param from x,y position and value of the ball to move
   * @param to_x target x position
   * @param to_y target y postion
   *  @example player deselected the ball and path need to disappear
   * @public
   */
    private moveBall(from: { x: number, y: number, value: number }, to_x: number, to_y: number): void {   //PRZENOSI KULKE W WYBRANE MIEJSCE
        //UPDATE TAB
        this.tab[from.x][from.y] = 0;
        this.tab[to_x][to_y] = from.value;

        //ESSENTIALS
        let from_block = this.block_tab[from.x][from.y];
        let to_block = this.block_tab[to_x][to_y];
        let new_ball = new Ball(this.colors[from.value + 10])

        //UPDATE GRAPHICS
        from_block.removeBall();
        to_block.addBall(new_ball.get(), this.checkScore);

    }
    /**
   * Internal method used by Game
   * finds the shortest path from start to target
   * @param list path steps {x,y}
   * @param stem step quantity for measuring the length
   * @public
   */
    private findPath(list: xy[], step: number): void {  //SZUKA NAJBLIŻSZEJ ŚCIEŻKI
        let mem: xy[] = [];
        this.pathExists = (!this.found && list.length > 0);
        if (!this.found && list.length > 0) {
            list.forEach(el => {
                this.direction.forEach(z => {
                    if (this.checkBorders(el.x, el.y, z)) {
                        if (this.tab[el.x + z.x][el.y + z.y] == 0) {
                            this.tab[el.x + z.x][el.y + z.y] = step;
                            mem.push({ x: el.x + z.x, y: el.y + z.y })
                        } else if (this.tab[el.x + z.x][el.y + z.y] == -3) {
                            this.found = true;
                            this.drawPath(this.selected[0], this.x_size * this.y_size, []);
                        }
                    }
                });
            });
            this.findPath(mem, step + 1);
        }
    }
    /**
   * Internal method used by Game
   * checks if provided x and y values will fit the array
   * @param x x start pos
   * @param y y start pos
   * @param z {x:value,y:value} offset to move the point
   * @returns true or false
   * @public
   */
    private checkBorders(x: number, y: number, z: xy): boolean {   //SPRAWDZA CZY ELEMENT JEST WEWNĄTRZ TABLICY
        return (x + z.x >= 0 && y + z.y >= 0) && (x + z.x < this.x_size && y + z.y < this.y_size);
    }
    /**
     * Internal method used by Game
     * draws path in the tab array if everything is correct
     * @param m xy position
     * @param previous block set previously
     * @param path array of locations to highlight
     * @public
     */
    private drawPath(m: xy, previous: number, path: xy[]): void { // RYSOWANIE SCIEZKI
        let neighbour = this.getNeighbour(m, previous)
        let lowest = this.findLowestNeighbour(neighbour);
        if (lowest != undefined) {
            path.push({ x: lowest.x, y: lowest.y })
            this.drawPath({ x: lowest.x, y: lowest.y }, lowest.value, path)
        }
        this.highlightPath(path);
    }
    /**
     * Internal method used by Game
     * draws red path on the screen by the values in tab
     * @param path xy array with elements to highlight
     * @public
     */
    private highlightPath(path: xy[]): void {  //ZAZNACZENIE SCIEZKI NA PLANSZY
        if (path.length > 0) {
            path.forEach(element => {
                this.block_tab[element.x][element.y].update_color('rgba(255,0,0,0.5)');
            });
        }
    }
    private checkWin(): void {
        let counter = 0;
        this.tab.forEach(x => {
            x.forEach(y => {
                if (y == 0) { counter++ }
            });
        });
        if (counter <= 1) { alert('Przegrałeś, twój wynik to ' + String(this.score)) }
    }
    private checkScore = (id: xy): void => {
        let rowList: xy[][] = [[], [], [], []]
        let value = this.tab[id.x][id.y]
        let updateList = (item: xy, orient: number) => {
            if (!rowList[orient].includes(item)) {
                rowList[orient].push(item)
            }

        }
        let finish = (x: number): void => {
            if (rowList[x].length >= 5) {
                this.lastWasKill = true;
                this.score += rowList[x].length;
                let score_box: HTMLDivElement | null = document.querySelector('#score_box')
                if (score_box != null) {
                    score_box.innerHTML = 'Wynik: ' + String(this.score)
                }
                rowList[x].forEach(element => {
                    this.block_tab[element.x][element.y].removeBall();
                    this.tab[element.x][element.y] = 0;
                });
                rowList[x] = [];
            }
        }

        //0-vertical 1-horizontal 
        this.checkLine(id, value, 0, updateList, finish)
        this.checkLine(id, value, 1, updateList, finish)

        //2-left 3-right 
        this.checkSkos(id, value, 2, { x: 1, y: 1 }, updateList, finish, true)
        this.checkSkos(id, value, 2, { x: -1, y: -1 }, updateList, finish, false)
        this.checkSkos(id, value, 3, { x: -1, y: 1 }, updateList, finish, true)
        this.checkSkos(id, value, 3, { x: 1, y: -1 }, updateList, finish, false)
    }
    private checkLine(id: xy, value: number, dir: number, update: Function, finish: Function): void {
        let dirs = [{ x: 1, y: 0 }, { x: 0, y: 1 }]
        let checkers = [[this.x_size - id.x, id.x], [this.y_size - id.y, id.y]]
        update({ x: id.x, y: id.y }, dir);
        for (let i = 1; i < checkers[dir][0]; i++) {
            if (this.tab[id.x + i * dirs[dir].x][id.y + i * dirs[dir].y] == value) {
                update({ x: id.x + i * dirs[dir].x, y: id.y + i * dirs[dir].y }, dir);
            } else { i = 100 }
        }
        for (let i = 1; i <= checkers[dir][1]; i++) {
            if (this.tab[id.x - i * dirs[dir].x][id.y - i * dirs[dir].y] == value) {
                update({ x: id.x - i * dirs[dir].x, y: id.y - i * dirs[dir].y }, dir);
            } else { i = 100 }
        }
        finish(dir);
    }
    private checkSkos(id: xy, value: number, dir: number, dirs: { x: number, y: number }, update: Function, finish: Function, main: boolean): void {
        if (main) { update({ x: id.x, y: id.y }, dir) }
        for (let i = 1; i < 8; i++) {
            if ((id.x + dirs.x * i >= 0 && id.x + dirs.x * i <= 8) && (id.y + dirs.y * i >= 0 && id.y + dirs.y * i <= 8)) {
                let point = this.tab[id.x + dirs.x * i][id.y + dirs.y * i]
                if (point != undefined) {
                    if (point == value) {
                        update({ x: id.x + dirs.x * i, y: id.y + dirs.y * i }, dir)
                    } else { i = 100 };
                }
            }
        }
        finish(dir)
    }

    private getNeighbour(m: xy, previous: number): { x: number, y: number, value: number }[] {   //POBIERANIE SĄSIADÓW
        let neighbour: { x: number, y: number, value: number }[] = [];
        this.direction.forEach(z => {
            if (this.checkBorders(m.x, m.y, z)) {
                let op_block = this.tab[m.x + z.x][m.y + z.y];
                if (op_block > 0 && op_block < previous) {
                    neighbour.push({ x: m.x + z.x, y: m.y + z.y, value: op_block });
                }
            }
        });
        return neighbour;
    }
    private getAnyNeighbour(m: xy): xy[] {   //POBIERANIE SĄSIADÓW
        let neighbour: xy[] = [];
        this.direction.forEach(z => {
            if (this.checkBorders(m.x, m.y, z)) {
                neighbour.push({ x: m.x + z.x, y: m.y + z.y });
            }
        });
        return neighbour;
    }
    private findLowestNeighbour(neighbour: locationAndValue[]) { //SZUKANIE NAJMNIEJSZEJ LICZBY WŚRÓD SĄSIADÓW
        while (!Game.allEqual(neighbour)) {
            for (let i = 0; i < neighbour.length - 1; i++) {
                if (neighbour[i].value < neighbour[i + 1].value) {
                    neighbour.splice(i + 1, 1);
                }
            }
        }
        return neighbour[0];
    }
    static allEqual(neighbour: locationAndValue[]) { // CZY WSZYSTKIE WARTOŚCI W SĄSIEDZTWIE SĄ RÓWNE
        let equal = true;
        for (let i = 0; i < neighbour.length - 1; i++) {
            equal = equal && (neighbour[i].value == neighbour[i + 1].value);
        }
        return equal;
    }

}



export let balls: Ball[] = [];

export let hover: HTMLDivElement;

export let setHover = function (a: HTMLDivElement) {
    hover = a;
};

interface locationAndValue {
    x: number;
    y: number;
    value: number;
}

interface xy {
    x: number;
    y: number;
}

interface kulki {
    tab: number[][];
    block_tab: Block[][];
    selected: { x: number, y: number, value: number }[];

    clickcount: number;
    found: boolean;
    next_colors: string[];
    pathExists: boolean;
    pause: boolean;
    score: number;
    lastWasKill: boolean

    readonly x_size: number;
    readonly y_size: number;
    readonly toPush: number[];
    readonly direction: xy[];
    readonly colors: string[];
}