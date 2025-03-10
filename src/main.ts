import './style.css'
import {setup} from "./ui.ts";
import {Game} from "./game.ts";

const $playAgain: HTMLButtonElement = document.querySelector("#play-again")!
const $playArea: HTMLDivElement = document.querySelector(".play-area")!
const $playGame: HTMLButtonElement = document.querySelector("#play-game")!
const $menu: HTMLDivElement = document.querySelector("#menu")!

let game: Game | undefined;

$playGame.addEventListener("click", () => {
    $playArea.style.display = "flex"
    $menu.style.display = "none"
    game = new Game()
    setup(10, 20)
    game.start()
})

$playAgain.addEventListener("click", () => {
    game = new Game()
    setup(10, 20)
    game.start()
})

window.addEventListener("keydown", (event) => {
    console.log(event.key);
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "h") {
        game?.moveLeft()
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "l") {
        game?.moveRight()
    } else if (event.key === "ArrowDown" || event.key === "s" || event.key === "j") {
        game?.moveDown()
    } else if (event.key === " " || event.key === "ArrowUp" || event.key === "w" || event.key === "k") {
        game?.rotate()
    }
})