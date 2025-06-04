
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, ShieldAlert } from "lucide-react";
import { cn } from '@/lib/utils';

interface Score {
  id: string;
  username: string;
  time: string;
  boardSize: string;
  moves: number;
  date: string;
}

const LOCAL_STORAGE_KEY = 'knightsTourLeaderboard';

export default function LeaderboardPage() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const storedScores = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedScores) {
      try {
        const parsedScores = JSON.parse(storedScores);
        if (Array.isArray(parsedScores)) {
          setScores(parsedScores);
        } else {
          // If parsing fails or it's not an array, initialize with empty or default
          console.warn("Invalid scores format in localStorage, resetting.");
          setScores([]); 
        }
      } catch (error) {
        console.error("Failed to parse scores from localStorage", error);
        setScores([]); 
      }
    }
    // No initial mock scores, starts empty if localStorage is empty or invalid
  }, []);

  const sortedScores = scores.length > 0 
    ? [...scores].sort((a,b) => {
        const timeToSeconds = (timeStr: string) => {
          const [minutes, seconds] = timeStr.split(':').map(Number);
          return minutes * 60 + seconds;
        };
        const timeA = timeToSeconds(a.time);
        const timeB = timeToSeconds(b.time);
        
        // Sort by time ascending (lower is better)
        if(timeA !== timeB) return timeA - timeB; 
        
        // If times are equal, sort by moves ascending (fewer moves is better)
        return a.moves - b.moves; 
      })
    : [];

  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-headline text-primary flex items-center justify-center gap-3">
          <Crown className="w-10 h-10 sm:w-12 sm:h-12" /> Hall of Champions <Crown className="w-10 h-10 sm:w-12 sm:h-12" />
        </h1>
        <p className="text-lg text-muted-foreground font-body">
          Behold the mightiest knights and their glorious tour times!
        </p>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Top Knights</CardTitle>
          <CardDescription className="font-body">Current standings in the grand tour.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-headline text-base">Rank</TableHead>
                <TableHead className="font-headline text-base">Username</TableHead>
                <TableHead className="font-headline text-base text-center">Board Size</TableHead>
                <TableHead className="font-headline text-base text-center">Moves</TableHead>
                <TableHead className="font-headline text-base text-right">Time</TableHead>
                <TableHead className="font-headline text-base text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedScores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert className="w-12 h-12 text-muted-foreground/70" />
                      <p className="font-body text-lg">The Hall of Champions awaits its first hero!</p>
                      <p className="font-body text-sm">No scores recorded yet. Be the first to conquer the board!</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedScores.map((score, index) => (
                  <TableRow 
                    key={score.id} 
                    className={cn(
                      "hover:bg-accent/10",
                      index === 0 && sortedScores.length > 1 && "bg-chart-4/20 dark:bg-chart-4/40" // Highlight for top player if more than one score
                    )}
                  >
                    <TableCell 
                      className={cn(
                        "font-medium text-lg text-center", // Centered for the icon/number
                        index === 0 && sortedScores.length > 1 && "font-bold text-primary" // Primary color and bold for rank/icon if top and more than one score
                      )}
                    >
                      {index === 0 && sortedScores.length > 1 ? (
                        <Crown className="w-6 h-6 text-yellow-500 inline-block" />
                      ) : (
                        index + 1
                      )}
                    </TableCell>
                    <TableCell 
                      className={cn(
                        "font-medium",
                        index === 0 && sortedScores.length > 1 && "font-bold" // Bold username for top player if more than one score
                      )}
                    >
                      {score.username}
                    </TableCell>
                    <TableCell className="text-center">{score.boardSize}</TableCell>
                    <TableCell className="text-center">{score.moves}</TableCell>
                    <TableCell className="text-right">{score.time}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{score.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
