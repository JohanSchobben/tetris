import {FixedSizeArray, Game, Tetromino} from "./game.ts";

export class TetrisGame extends HTMLElement {
    #game: Game | undefined
    #canvas: HTMLCanvasElement | undefined
    #ctx: CanvasRenderingContext2D | undefined
    #tileSize: number
    #intervalTime: number
    #colors: Map<string, string>

    get borderSize(): number {
        return Math.floor(this.#tileSize * 0.05)
    }

    get width(): number {
        return Number(this.getAttribute("width"))
    }

    set width(value: number) {
        this.setAttribute("width", String(value))
    }

    get height(): number {
        return Number(this.getAttribute("height"))
    }

    set height(value: number) {
        this.setAttribute("height", String(value))
    }

    get nextTetromino(): Tetromino | undefined {
        return this.#game?.nextTetromino;
    }

    get gameOver(): boolean {
         return this.#game?.map.isOverflown ?? true
    }

    constructor() {
        super();
        this.#game = new Game(this.height, this.width);
        this.#tileSize = 40
        this.#intervalTime = 1000
        this.#colors = new Map<string, string>()
    }

    #clearCanvas(): void {
        if (!this.#ctx) return
        this.#ctx.fillStyle = getComputedStyle(this).getPropertyValue("--tetris-background")
        this.#ctx.fillRect(0, 0, this.#canvas!.width, this.#canvas!.height)
    }

    #drawBlock(x: number, y: number, color: string) {
        if (!this.#ctx) return
        this.#ctx.fillStyle = color
        this.#ctx.beginPath()
        this.#ctx.fillRect(x, y, this.#tileSize, this.#tileSize)
        this.#ctx.fillStyle = "#000"
        this.#ctx.fillRect(x, y, this.#tileSize, this.borderSize)
        this.#ctx.fillRect(x + this.#tileSize - this.borderSize, y, this.borderSize, this.#tileSize)
        this.#ctx.fillRect(x, y+ this.#tileSize - this.borderSize, this.#tileSize, this.borderSize)
        this.#ctx.fillRect(x, y, this.borderSize, this.#tileSize)
        this.#ctx.closePath()
    }

    #clearBlock(x: number, y: number) {
        if (!this.#ctx) return
        this.#ctx.fillStyle = this.#colors.get("background")!
        this.#ctx.fillRect(x * this.#tileSize, y * this.#tileSize, this.#tileSize, this.#tileSize)
    }

    #clearBlocks(blocks: FixedSizeArray<number, 2>[]): void {
        if (!this.#game) return

        for (let [x, y] of blocks) {
            this.#clearBlock(x, y)
        }
    }

    #drawActiveBlock(): void {
        if (!this.#game) return

        for (let block of this.#game.getActivePosition()) {
            this.#drawBlock(block[0] * this.#tileSize, block[1] *this.#tileSize, this.#colors.get(this.#game.activeTetromino.identifier)!)
        }

    }

    #drawMap(): void {
        if (!this.#game) return
        this.#clearCanvas()
        for (let block of this.#game.map.getFilledFields()) {
            this.#drawBlock(block.x * this.#tileSize, block.y * this.#tileSize, this.#colors.get(block.identifier)!)
        }
    }

    #loop(time: number) {
        if (!this.#game || this.#game.map.isOverflown) return
        this.moveDown()
        setTimeout(() => {
            this.#loop(this.#intervalTime)
        }, time);
    }

    moveLeft(): void {
        if (!this.#game || this.gameOver) return
        const activePosition = Array.from(this.#game?.getActivePosition())
        const success = this.#game?.moveLeft()
        if (success) {
            this.#clearBlocks(activePosition)
            this.#drawActiveBlock()
        }
    }

    moveRight(): void {
        if (!this.#game || this.gameOver) return
        const activePosition = Array.from(this.#game?.getActivePosition())
        const success = this.#game?.moveRight()
        if (success) {
            this.#clearBlocks(activePosition)
            this.#drawActiveBlock()
        }
    }

    moveDown(): void {
        if (!this.#game || this.gameOver) return
        const activePosition = Array.from(this.#game.getActivePosition())
        const linesCleared = this.#game.linesCleared
        const level = this.#game.level
        const success = this.#game?.moveDown()
        this.#clearBlocks(activePosition)
        if (!success) {
            this.dispatchEvent(new CustomEvent("place"))
            if (linesCleared !== this.#game.linesCleared) {
                this.dispatchEvent(new CustomEvent("scoreChange", {detail: this.#game.score}))
                this.dispatchEvent(new CustomEvent("linesClearedChange", {detail: this.#game.linesCleared}))
            }
            if (level !== this.#game.level) {
                this.dispatchEvent(new CustomEvent("levelChange", {detail: this.#game.level}))
                this.#intervalTime = 1000 - 200 * this.#game.level
            }
            if (this.#game.map.isOverflown) {
                this.dispatchEvent(new CustomEvent("gameOver"))
            }
            this.#drawMap()

        } else  {
            this.#drawActiveBlock()
        }
    }

    rotate(): void {
        if (!this.#game || this.gameOver) return
        const activePosition = Array.from(this.#game.getActivePosition())
        const success = this.#game?.rotate()
        if (success) {
            this.#clearBlocks(activePosition)
            this.#drawActiveBlock()
        }
    }

    start(): void {
        this.#game = new Game(this.height, this.width);
        this.#tileSize = 40
        this.#intervalTime = 1000
        this.#loop(this.#intervalTime);
        this.#ctx.fillStyle = this.#colors.get("background")!
        this.#clearCanvas()
    }

    connectedCallback(): void {
        const shadow = this.attachShadow({mode: "closed"})
        const styles = getComputedStyle(this)
        this.#canvas = document.createElement("canvas")
        this.#canvas.width = this.width * this.#tileSize
        this.#canvas.height = this.height * this.#tileSize
        shadow.appendChild(this.#canvas)
        this.#ctx = this.#canvas.getContext("2d")!
        this.#colors.set("Q", styles.getPropertyValue("--tetris-square-color"))
        this.#colors.set("I", styles.getPropertyValue("--tetris-line-color"))
        this.#colors.set("T", styles.getPropertyValue("--tetris-t-color"))
        this.#colors.set("F", styles.getPropertyValue("--tetris-flipped-l-color"))
        this.#colors.set("S", styles.getPropertyValue("--tetris-s-color"))
        this.#colors.set("L", styles.getPropertyValue("--tetris-l-color"))
        this.#colors.set("FS", styles.getPropertyValue("--tetris-flipped-s-color"))
        this.#colors.set("background", styles.getPropertyValue("--tetris-background-color"))
        this.#ctx.fillStyle = this.#colors.get("background")!
        this.#ctx.fillRect(0, 0, this.#canvas?.width, this.#canvas?.height)
    }
}

customElements.define("tetris-game", TetrisGame)
