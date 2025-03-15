import './style.css'
import "./element.ts"
import {TetrisGame} from "./element.ts";
import {drawNext, setup, updateScore} from "./ui.ts";
import {challenge} from "./network.ts"

const $playAgain: HTMLButtonElement = document.querySelector("#play-again")!
const $playArea: HTMLDivElement = document.querySelector(".play-area")!
const $playGame: HTMLButtonElement = document.querySelector("#play-game")!
const $menu: HTMLDivElement = document.querySelector("#menu")!
const $tetrisGame: TetrisGame = document.querySelector("tetris-game")!
const $lines: HTMLSpanElement = document.querySelector("#lines")!
const $score: HTMLSpanElement = document.querySelector("#score")!
const $level: HTMLSpanElement = document.querySelector("#level")!
const $levelTable: HTMLTableCellElement = document.querySelector("#level-table")!
const $scoreTable: HTMLTableCellElement = document.querySelector("#score-table")!
const $linesTable: HTMLTableCellElement = document.querySelector("#lines-table")!
const $dialog: HTMLDialogElement = document.querySelector("#dialog")!

$playGame.addEventListener("click", () => {
    $playArea.style.display = "flex"
    $menu.style.display = "none"
    $tetrisGame.start()
    drawNext($tetrisGame.nextTetromino!)
})

$playAgain.addEventListener("click", () => {
    $dialog.close()
    $tetrisGame.start()
})

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "h") {
        $tetrisGame.moveLeft()
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "l") {
        $tetrisGame.moveRight()
    } else if (event.key === "ArrowDown" || event.key === "s" || event.key === "j") {
        $tetrisGame.moveDown()
    } else if (event.key === " " || event.key === "ArrowUp" || event.key === "w" || event.key === "k") {
        $tetrisGame.rotate()
    }
})

$tetrisGame.addEventListener("gameOver", () => {
    $scoreTable.textContent  = $score.textContent
    $linesTable.textContent = $lines.textContent
    $levelTable.textContent = $level.textContent
    $dialog.showModal()
});

// @ts-ignore
$tetrisGame.addEventListener("linesClearedChange", (event: CustomEvent<number>) => {
    $lines.textContent = String(event.detail)
})

// @ts-ignore
$tetrisGame.addEventListener("levelChange", (event: CustomEvent<number>) => {
    $level.textContent = String(event.detail)
})

// @ts-ignore
$tetrisGame.addEventListener("scoreChange", (event: CustomEvent<number>) => {
    updateScore(event.detail)
})

$tetrisGame.addEventListener("place", () => {
    drawNext($tetrisGame.nextTetromino!)
})

setup()
$playGame.click()

challenge("bob ross")