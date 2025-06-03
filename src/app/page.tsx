import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown } from "lucide-react";

interface Score {
  id: string;
  username: string;
  time: string;
  boardSize: string;
  moves: number;
  date: string;
}

const mockScores: Score[] = [
  { id: "1", username: "Sir Lancelot", time: "01:15", boardSize: "8x8", moves: 64, date: "2024-07-20" },
  { id: "2", username: "Lady Guinevere", time: "00:55", boardSize: "6x6", moves: 36, date: "2024-07-19" },
  { id: "3", username: "Merlin The Wizard", time: "02:03", boardSize: "8x8", moves: 64, date: "2024-07-18" },
  { id: "4", username: "Arthur Pendragon", time: "00:40", boardSize: "5x5", moves: 25, date: "2024-07-17" },
  { id: "5", username: "Black Knight", time: "01:30", boardSize: "7x7", moves: 49, date: "2024-07-16" },
];

export default function LeaderboardPage() {
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
              {mockScores.sort((a,b) => {
                const timeA = parseInt(a.time.replace(':',''));
                const timeB = parseInt(b.time.replace(':',''));
                if(timeA !== timeB) return timeA - timeB;
                return b.moves - a.moves; // Secondary sort by moves if times are same
              }).map((score, index) => (
                <TableRow key={score.id} className="hover:bg-accent/10">
                  <TableCell className="font-bold text-lg">{index + 1}</TableCell>
                  <TableCell className="font-medium">{score.username}</TableCell>
                  <TableCell className="text-center">{score.boardSize}</TableCell>
                  <TableCell className="text-center">{score.moves}</TableCell>
                  <TableCell className="text-right">{score.time}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{score.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
