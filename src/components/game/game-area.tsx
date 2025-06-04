
"use client";

import { useState, useEffect } from 'react';
import KnightTourBoard from './knight-tour-board';
import Timer from './timer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollText, Play, DoorOpen, RefreshCw, ThumbsDown, PartyPopper, Award } from 'lucide-react';
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
  const [showWinDialog, setShowWinDialog] = useState<boolean>(false);
  const [winDialogDetails, setWinDialogDetails] = useState<{time: string, moves: number, boardSize: string, isLightningFast: boolean} | null>(null);


  const { toast } = useToast();

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      toast({ title: `Welcome, Sir ${tempUsername.trim()}!`, description: "The Proving Grounds await your skill." });
      setGameMessage("Select your challenge and begin the tour!");
    } else {
      toast({ title: "A Knight Needs A Name!", description: "Please declare your noble title to proceed.", variant: "destructive" });
    }
  };

  const handleStartGame = () => {
    if (!username) {
      toast({ title: "Declare Your Name!", description: "A knight must be known before entering the arena!", variant: "destructive" });
      return;
    }
    setIsGameActive(true);
    setIsTimerRunning(false);
    setGameMessage('Make your first move on the board to start the timer and your quest!');
    setFinalTime(null);
    setLastGameMoves(null);
    setBoardKey(prev => prev + 1);
    setTimerResetKey(prev => prev + 1);
    setShowWinDialog(false);
  };

  const handleFirstMove = () => {
    if (isGameActive && !isTimerRunning) {
      setIsTimerRunning(true);
      setGameMessage("The tour has begun! May your path be true, brave knight.");
    }
  };

  const handleGameEnd = (result: { status: 'win' | 'loss'; moves: number }) => {
    setIsGameActive(false);
    setIsTimerRunning(false);
    setLastGameMoves(result.moves);
    if (result.status === 'win') {
      setGameMessage(`Victory is Yours! Calculating final time... Total Moves: ${result.moves}`);
    } else {
      setGameMessage(`Tour Ended. A valiant effort, nonetheless. Total Moves: ${result.moves}`);
    }
  };

  const handleTimerReset = (time: number) => {
    if (!isGameActive) { 
      setFinalTime(time);
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const isLightningFast = time < 10;

      if ((gameMessage.includes("Victory is Yours!") || gameMessage.includes("You Win!")) && lastGameMoves !== null) {
         let currentWinMessage;
         let toastTitle;
         let toastDescription;
         let toastIconColor = "text-green-500";

         if (isLightningFast) {
            currentWinMessage = `Phenomenal Speed! Tour on ${selectedBoardSize}x${selectedBoardSize} completed in ${formattedTime} in ${lastGameMoves} moves. A true legend of the realm!`;
            toastTitle = "Blazing Victory!";
            toastDescription = `Sir ${username} has shown legendary speed on the ${selectedBoardSize}x${selectedBoardSize} tour: ${formattedTime} (<10s)!`;
            toastIconColor = "text-yellow-500"; // Gold for lightning fast
         } else {
            currentWinMessage = `Victory! Your tour on ${selectedBoardSize}x${selectedBoardSize} took ${formattedTime} in ${lastGameMoves} moves. Well fought!`;
            toastTitle = "Glorious Triumph!";
            toastDescription = `Sir ${username} completed the ${selectedBoardSize}x${selectedBoardSize} tour in ${formattedTime} (${lastGameMoves} moves). Score recorded!`;
         }
         
         setGameMessage(currentWinMessage);
         toast({
           title: toastTitle,
           description: toastDescription,
           action: <PartyPopper className={toastIconColor} />,
         });

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
             title: "Score Saving Hiccup",
             description: "Your heroic deed is known, but alas, could not be etched into the records this time.",
             variant: "destructive"
           });
         }
         setWinDialogDetails({time: formattedTime, moves: lastGameMoves, boardSize: `${selectedBoardSize}x${selectedBoardSize}`, isLightningFast});
         setShowWinDialog(true);
         setLastGameMoves(null);

      } else if (gameMessage.includes("Tour Ended")) {
         const lossMessage = `Defeated! Your tour on ${selectedBoardSize}x${selectedBoardSize} ended after ${lastGameMoves || 'some'} moves. Another attempt awaits!`;
         setGameMessage(lossMessage);
         toast({
           title: "A Noble Attempt...",
           description: `Sir ${username}'s tour on the ${selectedBoardSize}x${selectedBoardSize} board was cut short. The kingdom awaits your return!`,
           variant: "destructive",
           action: <ThumbsDown className="text-red-500" />,
         });
         setLastGameMoves(null); 
      }
    }
  };

  useEffect(() => {
  }, [isGameActive, finalTime, gameMessage]);


  if (!username) {
    return (
      <Card className="max-w-md mx-auto shadow-xl border-primary/50">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center flex items-center justify-center gap-2">
            <DoorOpen className="w-8 h-8 text-primary" /> Halt! Who Goes There?
          </CardTitle>
          <CardDescription className="font-body text-center text-muted-foreground/90 pt-1">
            Declare your noble name to enter these hallowed Proving Grounds and prove your mettle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <Input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder="e.g., Sir Lancelot"
              className="text-center text-lg h-12"
              aria-label="Enter your username"
            />
            <Button type="submit" className="w-full text-lg h-12 font-headline">
              <Play className="mr-2" /> Enter the Proving Grounds
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-primary/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="font-headline text-3xl">The Proving Grounds: Your Knight's Tour</CardTitle>
            <Timer isRunning={isTimerRunning} onReset={handleTimerReset} resetKey={timerResetKey} />
          </div>
          <CardDescription className="font-body mt-2 text-muted-foreground/90">
            Welcome, Champion <strong className="text-primary">{username}</strong>! The arena is set. Current challenge: <strong className="text-accent-foreground/80">{selectedBoardSize}x{selectedBoardSize}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isGameActive ? (
            <div className="space-y-4">
              <div>
                <p className="font-body mb-2 text-center text-lg text-muted-foreground">Select Your Challenge:</p>
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
                "text-center font-body text-lg p-3 rounded-md border",
                (gameMessage.includes("Victory") || gameMessage.includes("Phenomenal Speed")) && "bg-green-100 text-green-800 border-green-400 dark:bg-green-900/40 dark:text-green-300 dark:border-green-600/70",
                gameMessage.includes("Phenomenal Speed") && "text-yellow-700 dark:text-yellow-300 border-yellow-500 dark:border-yellow-600/70 bg-yellow-100 dark:bg-yellow-900/30",
                (gameMessage.includes("Defeated") || gameMessage.includes("Tour Ended")) && "bg-red-100 text-red-800 border-red-400 dark:bg-red-900/40 dark:text-red-300 dark:border-red-600/70",
                !(gameMessage.includes("Victory") || gameMessage.includes("Defeated") || gameMessage.includes("Phenomenal Speed") || gameMessage.includes("Tour Ended")) && "bg-accent/10 text-accent-foreground/90 border-accent/30"
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
      
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><ScrollText className="w-7 h-7 text-primary" /> Royal Edict: Rules of the Tour</CardTitle>
        </CardHeader>
        <CardContent className="font-body space-y-2 text-sm sm:text-base text-muted-foreground">
          <p>1. Declare your noble name and select the size of the proving grounds.</p>
          <p>2. Click any square on the board to summon your knight. This signals the start of your timed trial!</p>
          <p>3. The knight moves in an 'L' shape: two squares in one direction (horizontal or vertical), then one square perpendicular.</p>
          <p>4. Your grand objective is to guide your knight to every square on the board, visiting each only once.</p>
          <p>5. The tour concludes if you successfully visit every square (Victory!) or if your knight finds no valid moves remaining (Defeat).</p>
          <p className="font-bold text-primary pt-2">May fortune favor your valiant efforts, Knight!</p>
        </CardContent>
      </Card>

      {winDialogDetails && (
        <Dialog open={showWinDialog} onOpenChange={setShowWinDialog}>
          <DialogContent className="sm:max-w-md bg-card border-primary shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-3xl font-headline text-primary flex items-center justify-center gap-3 py-2">
                <Award className="w-10 h-10 text-yellow-500" />
                {winDialogDetails.isLightningFast ? "Blazing Speed!" : "Glorious Victory!"}
                <Award className="w-10 h-10 text-yellow-500" />
              </DialogTitle>
            </DialogHeader>
            <div className="text-center font-body py-4 space-y-2 text-card-foreground">
              <p className="text-lg">Congratulations, Sir <strong className="text-primary">{username}</strong>!</p>
              
              {winDialogDetails.isLightningFast ? (
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400 py-2">
                  By the Nine Divines! Such speed! You've completed the tour in under 10 seconds! Truly the work of a legendary speedster!
                </p>
              ) : (
                <p>You have masterfully completed the Knight's Tour on the <strong className="text-accent-foreground/90">{winDialogDetails.boardSize}</strong> battlefield.</p>
              )}

              <div className="text-base space-y-1 mt-3 pt-3 border-t border-border">
                <p>Your legendary feat:</p>
                <p>Time: <strong className={cn("text-accent-foreground/90", winDialogDetails.isLightningFast && "text-yellow-600 dark:text-yellow-400 font-bold")}>{winDialogDetails.time}</strong></p>
                <p>Moves: <strong className="text-accent-foreground/90">{winDialogDetails.moves}</strong></p>
              </div>
              
              {!winDialogDetails.isLightningFast && (
                <p className="mt-4">Your name shall be sung by bards in the Hall of Champions!</p>
              )}
            </div>
            <DialogFooter className="sm:justify-center pt-4">
              <DialogClose asChild>
                <Button type="button" variant="default" className="font-headline text-lg px-6 py-3">
                  Huzzah!
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
