export type FixedSizeArray<T, N extends number> = { length: N } & Array<T>;
type TetrominoMap<N extends number = number> = FixedSizeArray<FixedSizeArray<boolean, N>, N>

export class TetrisMap {
    readonly #height: number;
    readonly #width: number;
    readonly #board: string[][];
    #isOverflown: boolean;

    get width(): number {
        return this.#width;
    }

    constructor(height: number, width: number) {
        this.#isOverflown = false;
        this.#height = height;
        this.#width = width;
        this.#board = [];
        for (let i = 0; i < height; i++) {
            this.#board[i] = Array(this.#width);
        }
    }

    #isFilled(x: number, y: number) {
        if (y < 0) return false;
        return this.#board[y][x] !== undefined;
    }


    *#placements(t: Tetromino, x: number, y: number): Iterable<[number, number]> {
        for (let [xPos, yPos] of t.blockPositions()) {
            yield [xPos + x, yPos + y];
        }

    }

    #isRowEmpty(i: number): boolean {
        return this.#board[i].every(item => !Boolean(item));
    }

    public get isOverflown(): boolean {
        return this.#isOverflown;
    }

    public spotIsTaken(t: Tetromino, x: number, y: number): boolean {
        for (let [xPlacement, yPlacement] of this.#placements(t, x, y)) {
            if (yPlacement === this.#height || this.#isFilled(xPlacement, yPlacement)) {
                return true;
            }
        }
        return false;
    }

    public isOutOfBounds(t: Tetromino, x: number, y: number): boolean {
        for (let [xPlacement] of this.#placements(t, x, y)) {
            if (xPlacement < 0 || xPlacement >= this.#width) return true;
        }
        return false;
    }

    public place(t: Tetromino, x: number, y: number): void {
        for (let [xPlacement, yPlacement] of this.#placements(t, x, y)) {
            if (yPlacement < 0) {
                this.#isOverflown = true;
            } else {
                this.#board[yPlacement][xPlacement] = t.identifier;
            }
        }
    }

    public clearFullRows(): number {
        let amountDeleted = 0;
        for (let i = this.#height - 1; i >= 0; i--) {
            if (this.#isRowEmpty(i)) break;
            if (this.#isRowFull(i)) {
                amountDeleted++;
                this.#board.splice(i, 1);
                this.#board.unshift(Array(this.#width))
                ++i
            }
        }
        return amountDeleted;
    }

    *getFilledFields(): Iterable<{ x: number, y: number, identifier: string }> {
        for (let i = this.#height -1; i>= 0; i--) {
            if (this.#isRowEmpty(i)) break;
            for (let j = 0; j < this.#width; j++) {
                if (this.#board[i][j] !== undefined) {
                    yield {x: j, y: i, identifier: this.#board[i][j]}
                }
            }
        }
    }


    #isRowFull(r: number) {
        for (let i = 0; i < this.#width; i++) {
            if (this.#board[r][i] == undefined) {
                return false
            }
        }
        return  true;
    }
}


export class Tetromino {
    readonly #map: TetrominoMap;
    readonly #identifier: string;

    public get identifier(): string {
        return this.#identifier;
    }

    constructor(identifier: string, map: TetrominoMap) {
        this.#map = map;
        this.#identifier = identifier;
    }

    *blockPositions(): Iterable<FixedSizeArray<number, 2>> {
        const size= this.#map.length;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.#map[i][j]) {
                    yield [j, i];
                }
            }
        }
    }

    getDimensions(): FixedSizeArray<number, 4> {
        const list = Array.from(this.blockPositions())

        let minX: number | undefined;
        let maxX: number | undefined;
        let minY: number | undefined;
        let maxY: number | undefined;


        for (let [x, y] of list) {
            if (minX === undefined || x < minX) {
                minX = x
            }
            if (maxX === undefined || x > maxX) {
                maxX = x
            }
            if (minY === undefined || y < minY) {
                minY = y
            }
            if (maxY === undefined || y > maxY) {
                maxY = y
            }
        }

        return [minX!, maxX!, minY!, maxY!];

    }

    #transpose(): void {
        const size = this.#map.length
        for (let i = 0; i < size; i++) {
            for (let j = i + 1; j < size;  j++) {
                [this.#map[i][j], this.#map[j][i]] = [this.#map[j][i],this.#map[i][j]]
            }
        }
    }

    public rotate() {
        const size = this.#map.length
        this.#transpose();
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size / 2; j++) {
                [this.#map[i][j], this.#map[i][size - j - 1]] = [this.#map[i][size - j - 1], this.#map[i][j]]
            }
        }
    }

    public rotateCounterClockWise() {
        const size = this.#map.length;
        this.#transpose();
        for (let i = 0; i < size / 2; i++) {
            for (let j = 0; j < size; j++) {
                [this.#map[i][j], this.#map[size - i - 1][j]] = [this.#map[size - i - 1][j], this.#map[i][j]]
            }
        }
    }
}

export const ITetromino: TetrominoMap<4> = [
    [false, true, false, false],
    [false, true, false, false],
    [false, true, false, false],
    [false, true, false, false],
];

export const STetromino: TetrominoMap<3> = [
    [false, true, true],
    [true, true, false],
    [false, false, false],
];

export const FSTetromino: TetrominoMap<3> = [
    [true, true, false],
    [false, true, true],
    [false, false, false]
]

export const TTetromino: TetrominoMap<3> = [
    [false, false, false],
    [true, true, true],
    [false, true, false]
];

export const LTetromino: TetrominoMap<3> = [
    [true, false, false],
    [true, false, false],
    [true, true, false]
];

export const FLTetromino: TetrominoMap<3> = [
    [false, false, true],
    [false, false, true],
    [false, true, true],
];

export const squareTetromino: TetrominoMap<2> = [
    [true, true],
    [true, true]
];

export class Game {
    readonly #map: TetrisMap
    #activeTetromino: Tetromino
    #activePosition: {x: number, y: number}
    #nextTetromino: Tetromino
    #linesCleared: number
    #score: number

    get level(): number {
        return Math.floor(this.#linesCleared / 10)
    }

    get map(): TetrisMap {
        return this.#map
    }

    get activeTetromino(): Tetromino {
        return this.#activeTetromino
    }

    get nextTetromino(): Tetromino {
        return this.#nextTetromino
    }

    get linesCleared(): number {
        return this.#linesCleared
    }

    get score(): number {
        return this.#score
    }

    constructor(height: number, width: number) {
        this.#map = new TetrisMap(height, width)
        this.#activeTetromino = this.#getNextTetromino()
        const [minX, maxX, minY, maxY] = this.#activeTetromino.getDimensions();
        const newXPlace = this.#map.width / 2 - Math.ceil((maxX - minX + 1) / 2)
        const newYPlace = (maxY - minY + 1) * -1 - 1
        this.#activePosition = {x: newXPlace, y: newYPlace}
        this.#nextTetromino = this.#getNextTetromino()
        this.#linesCleared = 0
        this.#score = 0
    }

    #getNextTetromino(): Tetromino {
        const next = this.#getRandomTetromino()
        if (this.#activeTetromino && next.identifier === this.#activeTetromino.identifier) {
            return this.#getNextTetromino()
        }
        return next
    }

    #getRandomTetromino(): Tetromino {
        const number = Math.floor(Math.random() * 7);
        switch (number) {
            case 0:
                return new Tetromino("Q", structuredClone(squareTetromino))
            case 1:
                return new Tetromino("I", structuredClone(ITetromino))
            case 2:
                return new Tetromino("T", structuredClone(TTetromino))
            case 3:
                return new Tetromino("F", structuredClone(FLTetromino))
            case 4:
                return new Tetromino("S", structuredClone(STetromino))
            case 5:
                return new Tetromino("FS", structuredClone(FSTetromino))
            default:
                return new Tetromino("L", structuredClone(LTetromino))
        }
    }

    #updateNumbers(linesCleared: number) {
        const base = [40, 100, 300, 1200][linesCleared - 1] ?? 1200
        this.#score += base * (this.level + 1)
        this.#linesCleared += linesCleared
    }

    #placeTetromino(): void {
        const [minX, maxX, minY, maxY] = this.#nextTetromino.getDimensions();
        const newXPlace = this.#map.width / 2 - Math.ceil((maxX - minX + 1) / 2)
        const newYPlace = (maxY - minY + 1) * -1 - 1
        this.#map.place(this.#activeTetromino, this.#activePosition.x, this.#activePosition.y)
        this.#activePosition = {x: newXPlace, y: newYPlace}
        this.#activeTetromino = this.#nextTetromino
        this.#nextTetromino = this.#getNextTetromino()
        const linesCleared = this.#map.clearFullRows()
        if (linesCleared > 0) {
            this.#updateNumbers(linesCleared)
        }
    }

    *getActivePosition(): Iterable<FixedSizeArray<number, 2>> {
        for (let [x, y] of this.#activeTetromino.blockPositions()) {
            yield [x + this.#activePosition.x, y + this.#activePosition.y]
        }
    }

    moveLeft(): boolean {
        this.#activePosition.x--
        if (this.#map.isOutOfBounds(this.#activeTetromino, this.#activePosition.x, this.#activePosition.y) || this.#map.spotIsTaken(this.#activeTetromino, this.#activePosition.x, this.#activePosition.y)) {
            this.#activePosition.x++
            return false
        }
        return true
    }

    moveRight(): boolean {
        this.#activePosition.x++
        if (this.#map.isOutOfBounds(this.#activeTetromino, this.#activePosition.x, this.#activePosition.y) || this.#map.spotIsTaken(this.#activeTetromino, this.#activePosition.x, this.#activePosition.y)) {
            this.#activePosition.x--
            return false
        }
        return true
    }

    moveDown(): boolean {
        ++this.#activePosition.y
        if (this.#map.spotIsTaken(this.#activeTetromino, this.#activePosition.x, this.#activePosition.y)) {
            --this.#activePosition.y
            this.#placeTetromino()
            return false
        }
        return true
    }

    rotate(): boolean {
        this.#activeTetromino.rotate();
        if (this.#map.isOutOfBounds(this.#activeTetromino, this.#activePosition.x, this.#activePosition.y) || this.#map.spotIsTaken(this.#activeTetromino, this.#activePosition.x, this.#activePosition.y)) {
            this.#activeTetromino.rotateCounterClockWise();
            return false
        }
        return true
    }
}
