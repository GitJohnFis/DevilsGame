"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Board = (0 | 1 | 2)[][]; // 0: unvisited, 1: visited, 2: current knight position
type Position = { r: number; c: number } | null;

interface KnightTourBoardProps {
  size: number;
  onGameEnd: (result: { status: 'win' | 'loss'; moves: number; time?: number }) => void;
  onMove: () => void; // Callback when a move is made, to start timer
  gameActive: boolean; // To control interaction based on game state in parent
}

const knightMoves = [
  { r: -2, c: -1 }, { r: -2, c: 1 },
  { r: -1, c: -2 }, { r: -1, c: 2 },
  { r: 1, c: -2 }, { r: 1, c: 2 },
  { r: 2, c: -1 }, { r: 2, c: 1 },
];

export default function KnightTourBoard({ size, onGameEnd, onMove, gameActive }: KnightTourBoardProps) {
  const [board, setBoard] = useState<Board>([]);
  const [knightPosition, setKnightPosition] = useState<Position>(null);
  const [visitedCount, setVisitedCount] = useState(0);
  const [path, setPath] = useState<Position[]>([]);

  const initializeBoard = useCallback(() => {
    const newBoard = Array(size).fill(null).map(() => Array(size).fill(0));
    setBoard(newBoard);
    setKnightPosition(null);
    setVisitedCount(0);
    setPath([]);
  }, [size]);

  useEffect(() => {
    initializeBoard();
  }, [size, initializeBoard]);

  const isValid = (r: number, c: number) => r >= 0 && r < size && c >= 0 && c < size;

  const getPossibleMoves = useCallback((pos: Position): Position[] => {
    if (!pos) return [];
    return knightMoves
      .map(move => ({ r: pos.r + move.r, c: pos.c + move.c }))
      .filter(p => isValid(p.r, p.c) && board[p.r][p.c] === 0);
  }, [board, size]);

  const handleCellClick = (r: number, c: number) => {
    if (!gameActive) return;

    const newBoard = board.map(row => [...row]);

    if (!knightPosition) { // First move
      newBoard[r][c] = 2; // Current knight position
      setKnightPosition({ r, c });
      setVisitedCount(1);
      setPath([{r,c}]);
      setBoard(newBoard);
      onMove(); // Signal that the first move is made
      return;
    }

    // Subsequent moves
    const isPossibleMove = getPossibleMoves(knightPosition).some(move => move.r === r && move.c === c);

    if (isPossibleMove) {
      if (newBoard[knightPosition.r][knightPosition.c] === 2) {
        newBoard[knightPosition.r][knightPosition.c] = 1; // Mark old position as visited
      }
      newBoard[r][c] = 2; // New knight position
      const newPos = { r, c };
      setKnightPosition(newPos);
      const newVisitedCount = visitedCount + 1;
      setVisitedCount(newVisitedCount);
      setPath([...path, newPos]);
      setBoard(newBoard);

      if (newVisitedCount === size * size) {
        onGameEnd({ status: 'win', moves: newVisitedCount });
      } else {
        const nextPossibleMoves = getPossibleMoves(newPos).filter(p => isValid(p.r, p.c) && newBoard[p.r][p.c] === 0);
        if (nextPossibleMoves.length === 0) {
          onGameEnd({ status: 'loss', moves: newVisitedCount });
        }
      }
    }
  };
  
  const getCellContent = (r_idx: number, c_idx: number) => {
    const moveIndex = path.findIndex(p => p?.r === r_idx && p?.c === c_idx);
    if (moveIndex !== -1) {
      return moveIndex + 1;
    }
    return '';
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid border border-primary shadow-lg bg-card"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          width: `${Math.min(60 / size * 40, 400)}px`, // Responsive size
          height: `${Math.min(60 / size * 40, 400)}px`,
          aspectRatio: '1 / 1',
          maxWidth: '90vw',
          maxHeight: '90vh',
        }}
      >
        {board.map((row, r_idx) =>
          row.map((cell, c_idx) => (
            <button
              key={`${r_idx}-${c_idx}`}
              onClick={() => handleCellClick(r_idx, c_idx)}
              disabled={!gameActive || (knightPosition !== null && board[r_idx][c_idx] !== 0 && !getPossibleMoves(knightPosition).some(m => m.r === r_idx && m.c === c_idx))}
              className={cn(
                "flex items-center justify-center border border-secondary text-xs sm:text-sm md:text-base font-bold transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:z-10",
                "aspect-square rounded-none", // Pixelated feel
                cell === 0 && "bg-background hover:bg-accent/20", // Unvisited
                cell === 1 && "bg-primary/30 text-primary-foreground", // Visited
                cell === 2 && "bg-primary text-primary-foreground animate-pulse", // Knight
                (knightPosition && getPossibleMoves(knightPosition).some(m => m.r === r_idx && m.c === c_idx)) && "bg-accent/30 hover:bg-accent/50 cursor-pointer", // Possible move
                (!gameActive && "cursor-not-allowed opacity-70")
              )}
              aria-label={`Cell ${r_idx + 1}-${c_idx + 1}`}
            >
              {getCellContent(r_idx, c_idx)}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
