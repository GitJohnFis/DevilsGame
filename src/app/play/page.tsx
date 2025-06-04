
import GameArea from '@/components/game/game-area';
import { Castle } from 'lucide-react';

export default function PlayPage() {
  return (
    <div className="space-y-8 py-6 md:py-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-headline text-primary flex items-center justify-center gap-3">
          <Castle className="w-10 h-10 sm:w-12 sm:h-12" />
          The Royal Proving Grounds
        </h1>
        <p className="text-lg text-muted-foreground font-body">
          Brave Knight, your legendary quest begins within these hallowed walls!
        </p>
      </header>
      <GameArea />
    </div>
  );
}
