# Knight's Tour ♞

The Knight's Tour is a classic chess puzzle where the goal is to move a knight to every square on a chessboard exactly once. Here's a brief overview to help you get started with coding the game:

## Objective

- **Move the knight** to every square on the board exactly once.

## Rules

1. The knight moves in an **"L" shape**: two squares in one direction and then one square perpendicular, or one square in one direction and then two squares perpendicular.
2. The knight **cannot move outside** the boundaries of the board.
3. Each square must be **visited exactly once**.

## Approach

### Backtracking Algorithm

Use a recursive approach to try all possible moves from the current position. If a move leads to a solution, continue; otherwise, backtrack and try the next move.

### Warnsdorff's Rule

To optimize, always move the knight to the square with the fewest onward moves.

## Example Code Structure

```typescript
class KnightsTour {
    private board: number[][];
    private moves: number[][] = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
    ];

    constructor(size: number) {
        this.board = Array.from({ length: size }, () => Array(size).fill(-1));
    }

    public solve(): boolean {
        this.board[0][0] = 0; // Start from the first cell
        return this.solveTour(0, 0, 1);
    }

    private solveTour(x: number, y: number, moveCount: number): boolean {
        if (moveCount === this.board.length * this.board.length) return true;

        for (const [dx, dy] of this.moves) {
            const nx = x + dx, ny = y + dy;
            if (this.isValidMove(nx, ny)) {
                this.board[nx][ny] = moveCount;
                if (this.solveTour(nx, ny, moveCount + 1)) return true;
                this.board[nx false;
    }

    private isValidMove(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.board.length && y < this.board.length && this.board[x][y] === -1;
    }
}
