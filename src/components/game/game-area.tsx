
"use client";

import { useState, useEffect } from 'react';
import KnightTourBoard from './knight-tour-board';
import Timer from './timer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ShieldQuestion, Play, User, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type BoardSize = 5 | 6 | 7 | 8;

interface Score {
  id: string;
  username: string;
  time: string; // MM:SS
  boardSize: string; // NxN
  moves: number;
  date: string; // YYYY-MM-DD
}

const LOCAL_STORAGE_KEY = 'knightsTourLeaderboard';

export default function GameArea() {
  const [username, setUsername] = useState<string>('');
  const [tempUsername, setTempUsername] = useState<string>('');
  const [selectedBoardSize, setSelectedBoardSize] = useState<BoardSize>(5);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>('');
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [boardKey, setBoardKey] = useState<number>(0); 
  const [timerResetKey, setTimerResetKey] = useState<number>(0);
  const [lastGameMoves, setLastGameMoves] = useState<number | null>(null);

  const { toast } = useToast();

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      toast({ title: `Welcome, Sir ${tempUsername.trim()}!`, description: "Choose your challenge and begin the tour." });
      setGameMessage("Select board size and start your conquest!");
    } else {
      toast({ title: "A Knight Needs A Name!", description: "Please enter your noble title.", variant: "destructive" });
    }
  };

  const handleStartGame = () => {
    if (!username) {
      toast({ title: "Enter Username", description: "A knight must declare their name before embarking on a quest!", variant: "destructive" });
      return;
    }
    setIsGameActive(true);
    setIsTimerRunning(false); 
    setGameMessage('Make your first move on the board to start the timer!');
    setFinalTime(null);
    setLastGameMoves(null);
    setBoardKey(prev => prev + 1); 
    setTimerResetKey(prev => prev + 1); 
  };
  
  const handleFirstMove = () => {
    if (isGameActive && !isTimerRunning) {
      setIsTimerRunning(true);
      setGameMessage("The tour has begun! Good luck, brave knight.");
    }
  };

  const handleGameEnd = (result: { status: 'win' | 'loss'; moves: number }) => {
    setIsGameActive(false);
    setIsTimerRunning(false);
    setLastGameMoves(result.moves); 
    // The rest of the logic (toast, saving score) will happen in handleTimerReset
    // after the final time is captured.
    // We set a preliminary game message here which might be overwritten by handleTimerReset.
    if (result.status === 'win') {
      // This message will be updated by handleTimerReset to include time.
      setGameMessage(`You Win! Calculating final time... Moves: ${result.moves}`);
    } else {
      setGameMessage(`Game Over! Your tour ended. Moves: ${result.moves}`);
    }
  };
  
  const handleTimerReset = (time: number) => {
    // This function is called by the Timer when it stops or resets (isRunning becomes false).
    if (!isGameActive) { // Game just ended
      setFinalTime(time);
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      // Check if gameMessage was set to win by onGameEnd (or a similar indicator)
      // and ensure lastGameMoves is available
      if (gameMessage.includes("You Win!") && lastGameMoves !== null) { 
         const winMessage = `Victory! Your tour on ${selectedBoardSize}x${selectedBoardSize} took ${formattedTime} in ${lastGameMoves} moves.`;
         setGameMessage(winMessage);
         toast({
           title: "Glorious Victory!",
           description: `Sir ${username} completed the ${selectedBoardSize}x${selectedBoardSize} tour in ${formattedTime} (${lastGameMoves} moves). Score saved!`,
           action: <ThumbsUp className="text-green-500" />,
         });

         // Save score to localStorage
         const newScore: Score = {
           id: Date.now().toString(),
           username: username,
           time: formattedTime,
           boardSize: `${selectedBoardSize}x${selectedBoardSize}`,
           moves: lastGameMoves,
           date: format(new Date(), 'yyyy-MM-dd'),
         };

         try {
           const existingScoresRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
           const existingScores: Score[] = existingScoresRaw ? JSON.parse(existingScoresRaw) : [];
           existingScores.push(newScore);
           localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingScores));
         } catch (error) {
           console.error("Failed to save score to localStorage", error);
           toast({
             title: "Score Saving Error",
             description: "Could not save your score. Your glory is known, but not recorded this time.",
             variant: "destructive"
           });
         }
         setLastGameMoves(null); // Reset for next game.

      } else if (gameMessage.includes("Game Over!")) { 
         const lossMessage = `Defeat! Your tour on ${selectedBoardSize}x${selectedBoardSize} ended after ${lastGameMoves || 'some'} moves.`;
         setGameMessage(lossMessage);
         toast({
           title: "Valiant Effort, But...",
           description: `Sir ${username}'s tour on the ${selectedBoardSize}x${selectedBoardSize} board was cut short.`,
           variant: "destructive",
           action: <ThumbsDown className="text-red-500" />,
         });
         setLastGameMoves(null); // Reset for next game.
      }
    }
  };
  
  useEffect(() => {
    // This effect is mostly superseded by logic in handleTimerReset
    // It can be kept for any other updates or removed if handleTimerReset covers all cases.
  }, [isGameActive, finalTime, gameMessage]);


  if (!username) {
    return (
      <Card className="max-w-md mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center flex items-center justify-center gap-2"><User /> Declare Thyself, Knight!</CardTitle>
          <CardDescription className="font-body text-center">Enter your noble name to begin your legendary tour.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <Input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder="e.g., Sir Reginald"
              className="text-center text-lg h-12"
              aria-label="Enter your username"
            />
            <Button type="submit" className="w-full text-lg h-12 font-headline">
              <Play className="mr-2" /> Venture Forth
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="font-headline text-3xl">Knight's Quest: The Grand Tour</CardTitle>
            <Timer isRunning={isTimerRunning} onReset={handleTimerReset} resetKey={timerResetKey} />
          </div>
          <CardDescription className="font-body mt-2">
            Welcome, <strong className="text-primary">{username}</strong>! Choose your battlefield. Current challenge: {selectedBoardSize}x{selectedBoardSize}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isGameActive ? (
            <div className="space-y-4">
              <div>
                <p className="font-body mb-2 text-center text-lg">Select Board Size:</p>
                <Tabs value={selectedBoardSize.toString()} onValueChange={(val) => setSelectedBoardSize(parseInt(val) as BoardSize)} className="w-full max-w-sm mx-auto">
                  <TabsList className="grid w-full grid-cols-4">
                    {[5, 6, 7, 8].map(size => (
                      <TabsTrigger key={size} value={size.toString()} className="font-headline text-base sm:text-lg">{size}x{size}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              <Button onClick={handleStartGame} className="w-full text-lg h-12 font-headline">
                <Play className="mr-2" /> Begin The Tour ({selectedBoardSize}x{selectedBoardSize})
              </Button>
            </div>
          ) : (
            <Button onClick={handleStartGame} className="w-full text-lg h-12 font-headline">
             <RefreshCw className="mr-2" /> Reset Quest ({selectedBoardSize}x{selectedBoardSize})
            </Button>
          )}

          {gameMessage && (
            <p className={cn(
                "text-center font-body text-lg p-3 rounded-md",
                gameMessage.includes("Victory") && "bg-green-100 text-green-700 border border-green-300",
                gameMessage.includes("Defeat") && "bg-red-100 text-red-700 border border-red-300",
                !gameMessage.includes("Victory") && !gameMessage.includes("Defeat") && "bg-accent/20 text-accent-foreground/80 border border-accent/30"
            )}>
              {gameMessage}
            </p>
          )}

          <KnightTourBoard
            key={boardKey}
            size={selectedBoardSize}
            onGameEnd={(result) => {
              handleGameEnd(result);
            }}
            onMove={handleFirstMove}
            gameActive={isGameActive}
          />

        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><ShieldQuestion /> How to Play</CardTitle>
        </CardHeader>
        <CardContent className="font-body space-y-2 text-sm sm:text-base">
          <p>1. Enter your knightly name and choose a board size.</p>
          <p>2. Click any square on the board to place your knight. This starts the timer!</p>
          <p>3. The knight moves in an 'L' shape: two squares in one direction (horizontal or vertical) and then one square perpendicular.</p>
          <p>4. Your goal is to visit every square on the board exactly once.</p>
          <p>5. The game ends if you complete the tour (win) or if your knight has no valid moves left (loss).</p>
          <p className="font-bold text-primary">Good luck, noble knight!</p>
        </CardContent>
      </Card>
    </div>
  );
}
