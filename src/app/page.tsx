
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, ShieldAlert, Loader2, Zap } from "lucide-react";
import { cn } from '@/lib/utils';

interface Score {
  id: string;
  username: string;
  time: string; // Format "MM:SS", e.g., "00:09"
  boardSize: string; // Format "NxN", e.g., "5x5"
  moves: number;
  date: string;
}

const LOCAL_STORAGE_KEY = 'knightsTourLeaderboard';
const BOARD_SIZES = ["5x5", "6x6", "7x7", "8x8"];

const timeToSeconds = (timeStr: string): number => {
  if (!timeStr || !timeStr.includes(':')) return Infinity;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return Infinity;
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  if (isNaN(minutes) || isNaN(seconds)) return Infinity;
  return minutes * 60 + seconds;
};

export default function LeaderboardPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [activeTab, setActiveTab] = useState<string>(BOARD_SIZES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedScores = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedScores) {
        try {
          const parsedScores = JSON.parse(storedScores);
          if (Array.isArray(parsedScores)) {
            setScores(parsedScores);
          } else {
            console.warn("Invalid scores format in localStorage, resetting.");
            setScores([]);
          }
        } catch (error) {
          console.error("Failed to parse scores from localStorage", error);
          setScores([]);
        }
      } else {
        setScores([]);
      }
    } catch (e) {
      console.error("Error during score loading process:", e);
      setScores([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scoresForActiveTab = useMemo(() => {
    return scores.filter(score => score.boardSize === activeTab);
  }, [scores, activeTab]);

  const sortedScores = useMemo(() => {
    if (scoresForActiveTab.length === 0) return [];
    
    return [...scoresForActiveTab].sort((a,b) => {
        const timeA = timeToSeconds(a.time);
        const timeB = timeToSeconds(b.time);
        
        if(timeA !== timeB) return timeA - timeB; 
        return a.moves - b.moves; 
      });
  }, [scoresForActiveTab]);

  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-headline text-primary flex items-center justify-center gap-3">
          <Crown className="w-10 h-10 sm:w-12 sm:h-12" /> Hall of Champions <Crown className="w-10 h-10 sm:w-12 sm:h-12" />
        </h1>
        <p className="text-lg text-muted-foreground font-body">
          Behold the mightiest knights and their glorious tour times on various battlefields!
        </p>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Top Knights - {activeTab} Board</CardTitle>
          <CardDescription className="font-body">Current standings for the {activeTab} tour.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              {BOARD_SIZES.map(size => (
                <TabsTrigger key={size} value={size} className="font-headline text-base">
                  {size}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="font-body text-lg text-muted-foreground">Loading champions' deeds...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-headline text-base">Rank</TableHead>
                  <TableHead className="font-headline text-base">Username</TableHead>
                  <TableHead className="font-headline text-base text-center">Moves</TableHead>
                  <TableHead className="font-headline text-base text-right">Time</TableHead>
                  <TableHead className="font-headline text-base text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedScores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                      <div className="flex flex-col items-center gap-2">
                        <ShieldAlert className="w-12 h-12 text-muted-foreground/70" />
                        <p className="font-body text-lg">The Hall of Champions for the {activeTab} board awaits its first hero!</p>
                        <p className="font-body text-sm">No scores recorded yet for this board size.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedScores.map((score, index) => {
                    const isTopPlayer = index === 0 && sortedScores.length > 1;
                    const isSub10Sec = timeToSeconds(score.time) < 10;

                    return (
                      <TableRow 
                        key={score.id} 
                        className={cn(
                          "hover:bg-accent/10",
                          isTopPlayer && "bg-chart-4/20 dark:bg-chart-4/40"
                        )}
                      >
                        <TableCell 
                          className={cn(
                            "font-medium text-lg text-center",
                            isTopPlayer && "font-bold text-primary"
                          )}
                        >
                          {isTopPlayer ? (
                            <Crown className="w-6 h-6 text-yellow-500 inline-block" />
                          ) : (
                            index + 1
                          )}
                        </TableCell>
                        <TableCell 
                          className={cn(
                            "font-medium",
                            isTopPlayer && "font-bold",
                            isSub10Sec && "group" // Apply group class only for sub-10-sec players
                          )}
                        >
                          <span className={cn(
                            "inline-block transition-colors duration-150",
                            isSub10Sec && "group-hover:text-yellow-500 group-hover:animate-shock-effect" // Apply hover effects only for sub-10-sec players
                           )}
                          >
                           {score.username}
                          </span>
                          {isSub10Sec && <Zap className="w-4 h-4 inline-block ml-1 text-yellow-500" aria-label="Sub 10 second badge" />}
                        </TableCell>
                        <TableCell className="text-center">{score.moves}</TableCell>
                        <TableCell className="text-right">{score.time}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{score.date}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

