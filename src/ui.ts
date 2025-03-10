const $canvas: HTMLCanvasElement = document.querySelector("#canvas")!
const ctx: CanvasRenderingContext2D = $canvas.getContext("2d")!
const $next: HTMLCanvasElement = document.querySelector("#next")!
const nextCtx: CanvasRenderingContext2D = $next.getContext("2d")!
const $lines: HTMLSpanElement = document.querySelector("#lines")!
const $score: HTMLSpanElement = document.querySelector("#score")!
const $level: HTMLSpanElement = document.querySelector("#level")!
const $levelTable: HTMLTableCellElement = document.querySelector("#level-table")!
const $scoreTable: HTMLTableCellElement = document.querySelector("#score-table")!
const $linesTable: HTMLTableCellElement = document.querySelector("#lines-table")!
const $dialog: HTMLDialogElement = document.querySelector("#dialog")!
const TILE_SIZE = 40;
const BORDER_SIZE = 2;
const backgroundColor = "#b3c3dc";


function draw(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
    ctx.fillStyle = "#000"
    ctx.fillRect(x, y, TILE_SIZE, BORDER_SIZE)
    ctx.fillRect(x + TILE_SIZE - BORDER_SIZE, y, BORDER_SIZE, TILE_SIZE)
    ctx.fillRect(x, y+ TILE_SIZE - BORDER_SIZE, TILE_SIZE, BORDER_SIZE)
    ctx.fillRect(x, y, BORDER_SIZE, TILE_SIZE)
    ctx.closePath()
}

function clear(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function setup(width: number, height: number): void {
    $canvas.width = width * TILE_SIZE
    $canvas.height = height * TILE_SIZE

    $next.height = 5 * TILE_SIZE;
    $next.width = 5 * TILE_SIZE;

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, $canvas.width, $canvas.height)

    nextCtx.fillStyle = backgroundColor
    nextCtx.fillRect(0, 0, $next.width, $next.height)
}

export function drawBlock(x: number, y: number, color: string) {
    const xPos = x * TILE_SIZE
    const yPos = y * TILE_SIZE

    draw(ctx, xPos, yPos, color)
}


export function clearBlock(x: number, y:number) {
    const xPos = x * TILE_SIZE
    const yPos = y * TILE_SIZE
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(xPos, yPos, TILE_SIZE, TILE_SIZE)
}

export function clearAll() {
    clear(ctx)
}

export function updateCounts(linesCleared: number, score: number, level: number) {
    // $score.textContent = String(score)
    $lines.textContent = String(linesCleared)
    $level.textContent = String(level)
    updateScore(score)
}

function updateScore(score: number): void {
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

export function paintNext(width: number, height: number, x: number, y: number, color: string) {
    const yOffset = ($next.height - height * TILE_SIZE) / 2
    const xOffset = ($next.width - width * TILE_SIZE) / 2
    const xPos = x * TILE_SIZE + xOffset
    const yPos = y * TILE_SIZE + yOffset
    draw(nextCtx, xPos, yPos, color)
}

export function clearNext() {
    clear(nextCtx)
}

export function getColor(identifier: string): string {
    switch (identifier) {
        case "Q":
            return "red"
        case "I":
            return "lightskyblue"
        case "T":
            return "lime"
        case "F":
            return "blue"
        case "S":
            return "yellow"
        case "L":
            return "rebeccapurple"
        default:
            return "orange"
    }
}


export function showGameOverDialog(lines: number, level: number, score: number): void {
    $linesTable.textContent = String(lines)
    $levelTable.textContent = String(level)
    $scoreTable.textContent = String(score)

    $dialog.showModal()
}
