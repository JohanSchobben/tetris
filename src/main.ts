import './style.css'
import {setup} from "./ui.ts";
import {Game} from "./game.ts";

setup(10, 20)
const game = new Game()

game.start()

window.addEventListener("keydown", (event) => {
    console.log(event.key);
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "h") {
        game.moveLeft()
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "l") {
        game.moveRight()
    } else if (event.key === "ArrowDown" || event.key === "s" || event.key === "j") {
        game.moveDown()
    } else if (event.key === " " || event.key === "ArrowUp" || event.key === "w" || event.key === "k") {
        game.rotate()
    }
})