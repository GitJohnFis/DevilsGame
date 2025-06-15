import { Loader2 } from 'lucide-react';

/** 
* @param {string} path
* @ Displays a loading spinner and message while content is loading.
* ! Consider customizing the loader for better UX.
*/
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 text-xl font-headline text-muted-foreground">Loading the realm...</p>
    </div>
  );
}
