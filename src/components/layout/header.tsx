import Link from 'next/link';
import { ShieldCheck, Trophy, Swords } from 'lucide-react'; // Using ShieldCheck as a thematic icon
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ShieldCheck size={36} />
          <h1 className="text-2xl md:text-3xl font-headline tracking-wider">
            KNIGHTS TOUR de france
          </h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
            <Link href="/" className="flex items-center gap-1 sm:gap-2">
              <Trophy size={20} />
              <span className="hidden sm:inline">Leaderboard</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
            <Link href="/play" className="flex items-center gap-1 sm:gap-2">
              <Swords size={20} />
              <span className="hidden sm:inline">Play Game</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
