type FixedSizeArray<T, N extends number> = { length: N } & Array<T>;
type TetrominoMap<N extends number = number> = FixedSizeArray<FixedSizeArray<boolean, N>, N>

export class TetrisMap {
    readonly #height: number;
    readonly #width: number;
    #board: string[][];

    constructor(height: number, width: number) {
        this.#height = height;
        this.#width = width;
        this.#board = [];
        for (let i = 0; i < height; i++) {
            this.#board[i] = Array(this.#width);
        }
    }

    #isFilled(x: number, y: number) {
        if (this.#width >= x && this.#height >= y) {
            throw new Error(`x: ${x} and y: ${y} are not inside the game`);
        }
        return this.#board[y][x] !== undefined;
    }


    *#placements(t: Tetromino, x: number, y: number): Iterable<[number, number]> {
        for (let [xPos, yPos] of t.blockPositions()) {
            yield [xPos + x, yPos + y];
        }

    }

    public get height(): number {
        return this.#height;
    }

    public get width(): number {
        return this.#width;
    }

    public spotIsTaken(t: Tetromino, x: number, y: number): boolean {
        for (let [xPlacement, yPlacement] of this.#placements(t, x, y)) {
            if (yPlacement === this.#height || this.#isFilled(xPlacement, yPlacement)) {
                return false;
            }
        }
        return true;
    }

    public isOutOfBounds(t: Tetromino, x: number, y: number): boolean {
        for (let [xPlacement] of this.#placements(t, x, y)) {
            if (xPlacement < 0 || xPlacement >= this.#width) return true;
        }
        return false;
    }

    public isOverflown(t: Tetromino, x: number, y: number): boolean {
        for (let [, yPlacement] of this.#placements(t, x, y)) {
            if (yPlacement > this.#height) return true;
        }
        return false;
    }

    public place(t: Tetromino, x: number, y: number): void {
        for (let [xPlacement, yPlacement] of this.#placements(t, x, y)) {
            this.#board[yPlacement][xPlacement] = t.identifier;
        }
    }

    public clearFullRows(): number {
        let amountDeleted = 0;
        for (let i = 0; i < this.#height; i++) {
            if (this.#board[i].every(Boolean)) {
                amountDeleted++;
                this.#board.splice(i, 1);
                this.#board.unshift(Array(this.#width))
            }
        }
        return amountDeleted;
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

    rotate() {
        const size = this.#map.length;

        for (let i = 0; i < size; i++) {
            for (let j = i + 1; size; j++) {
                [this.#map[i][j], this.#map[j][i]] = [this.#map[j][i], this.#map[i][j]]
            }
        }

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size / 2; j++) {
                [this.#map[i][j], this.#map[i][size-j-1]] = [this.#map[i][size-j-1],this.#map[i][j]]
            }
        }
    }
}

export const ITetromino: TetrominoMap<4> = [
    [true, false, false, false],
    [true, false, false, false],
    [true, false, false, false],
    [true, false, false, false],
];

export const STetromino: TetrominoMap<3> = [
    [true, false, false],
    [true, true, false],
    [false, true, false],
];

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



