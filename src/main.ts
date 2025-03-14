import './style.css'
import "./element.ts"
import {TetrisGame} from "./element.ts";
import {drawNext, setup, updateScore} from "./ui.ts";

const $playAgain: HTMLButtonElement = document.querySelector("#play-again")!
const $playArea: HTMLDivElement = document.querySelector(".play-area")!
const $playGame: HTMLButtonElement = document.querySelector("#play-game")!
const $menu: HTMLDivElement = document.querySelector("#menu")!
const $tetisGame: TetrisGame = document.querySelector("tetris-game")
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
    $tetisGame.start()
    drawNext($tetisGame.nextTetromino!)
})

$playAgain.addEventListener("click", () => {
    $dialog.close()
    $tetisGame.start()
})

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "h") {
        $tetisGame.moveLeft()
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "l") {
        $tetisGame.moveRight()
    } else if (event.key === "ArrowDown" || event.key === "s" || event.key === "j") {
        $tetisGame.moveDown()
    } else if (event.key === " " || event.key === "ArrowUp" || event.key === "w" || event.key === "k") {
        $tetisGame.rotate()
    }
})

$tetisGame.addEventListener("gameOver", () => {
    $scoreTable.textContent  = $score.textContent
    $linesTable.textContent = $lines.textContent
    $levelTable.textContent = $level.textContent
    $dialog.showModal()
});

// @ts-ignore
$tetisGame.addEventListener("linesClearedChange", (event: CustomEvent<number>) => {
    $lines.textContent = String(event.detail)
})

// @ts-ignore
$tetisGame.addEventListener("levelChange", (event: CustomEvent<number>) => {
    $level.textContent = String(event.detail)
})

// @ts-ignore
$tetisGame.addEventListener("scoreChange", (event: CustomEvent<number>) => {
    updateScore(event.detail)
})

$tetisGame.addEventListener("place", () => {
    drawNext($tetisGame.nextTetromino!)
})

setup()
$playGame.click()
