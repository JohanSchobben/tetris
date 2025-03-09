const canvas: HTMLCanvasElement = document.querySelector("#canvas")!;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
const TILE_SIZE = 40;
const BORDER_SIZE = 2;
const backgroundColor = "#b3c3dc";


export function setup(width: number, height: number): void {
    canvas.width = width * TILE_SIZE
    canvas.height = height * TILE_SIZE
    ctx.fillStyle = backgroundColor
    ctx.beginPath()
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.closePath()
}

export function drawBlock(x: number, y: number, color: string) {
    const xPos = x * TILE_SIZE
    const yPos = y * TILE_SIZE

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.fillRect(xPos, yPos, TILE_SIZE, TILE_SIZE)
    ctx.fillStyle = "#000"
    ctx.fillRect(xPos, yPos, TILE_SIZE, BORDER_SIZE)
    ctx.fillRect(xPos + TILE_SIZE - BORDER_SIZE, yPos, BORDER_SIZE, TILE_SIZE)
    ctx.fillRect(xPos, yPos + TILE_SIZE - BORDER_SIZE, TILE_SIZE, BORDER_SIZE)
    ctx.fillRect(xPos, yPos, BORDER_SIZE, TILE_SIZE)
    ctx.closePath()
}


export function clearBlock(x: number, y:number) {
    const xPos = x * TILE_SIZE
    const yPos = y * TILE_SIZE
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.fillRect(xPos, yPos, TILE_SIZE, TILE_SIZE)
    ctx.closePath();
}

export function clearAll() {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

}