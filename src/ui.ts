import {Tetromino} from "./game.ts";

const $next: HTMLCanvasElement = document.querySelector("#next")!
const nextCtx: CanvasRenderingContext2D = $next?.getContext("2d")!
const $score: HTMLSpanElement = document.querySelector("#score")!
const $levelTable: HTMLTableCellElement = document.querySelector("#level-table")!
const $scoreTable: HTMLTableCellElement = document.querySelector("#score-table")!
const $linesTable: HTMLTableCellElement = document.querySelector("#lines-table")!
const $dialog: HTMLDialogElement = document.querySelector("#dialog")!
const TILE_SIZE = 40;
const BORDER_SIZE = 2;
const colors = new Map<string, string>()

export function setup(): void {
    const styles = getComputedStyle($next)
    colors.set("Q", styles.getPropertyValue("--tetris-square-color"))
    colors.set("I", styles.getPropertyValue("--tetris-line-color"))
    colors.set("T", styles.getPropertyValue("--tetris-t-color"))
    colors.set("F", styles.getPropertyValue("--tetris-flipped-l-color"))
    colors.set("S", styles.getPropertyValue("--tetris-s-color"))
    colors.set("L", styles.getPropertyValue("--tetris-l-color"))
    colors.set("FS", styles.getPropertyValue("--tetris-flipped-s-color"))
    colors.set("background", styles.getPropertyValue("--tetris-background-color"))
    $next.height = 5 * TILE_SIZE;
    $next.width = 5 * TILE_SIZE;
    nextCtx.fillStyle = colors.get("background")!
    nextCtx.fillRect(0, 0, $next.width, $next.height)
}

export function drawNext(t: Tetromino): void {
    console.log("drawing", t)
    const [minX, maxX, minY, maxY] = t.getDimensions()
    const width = (maxX - minX + 1) * TILE_SIZE
    const height = (maxY - minY + 1) * TILE_SIZE
    const top = (5 * TILE_SIZE - height) / 2
    const left = (5 * TILE_SIZE - width) / 2

    nextCtx.fillStyle = colors.get("background")!
    nextCtx.fillRect(0, 0, $next.width, $next.height)


    for (let [x, y] of t.blockPositions()) {
        x = (x - minX) * TILE_SIZE + left
        y = (y - minY) * TILE_SIZE + top
        nextCtx.fillStyle = colors.get(t.identifier)!
        nextCtx.fillRect(x,  y, TILE_SIZE, TILE_SIZE)
        nextCtx.fillStyle = "#000"
        nextCtx.fillRect(x, y, TILE_SIZE, BORDER_SIZE)
        nextCtx.fillRect(x + TILE_SIZE - BORDER_SIZE, y, BORDER_SIZE, TILE_SIZE)
        nextCtx.fillRect(x, y+ TILE_SIZE - BORDER_SIZE, TILE_SIZE, BORDER_SIZE)
        nextCtx.fillRect(x, y, BORDER_SIZE, TILE_SIZE)

    }

}

export function updateScore(score: number): void {
    const oldScore = Number($score.textContent)!
    const incrementer = score - oldScore < 600 ? 1 : 3;
    let shownScore = oldScore
    const timer = setInterval(() => {
        shownScore = Math.min(shownScore + incrementer, score)
        $score.textContent = String(shownScore)
        if (shownScore >= score) {
            clearInterval(timer)
        }
    }, 32)
}
