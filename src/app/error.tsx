"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-3xl font-headline text-destructive mb-2">A Misadventure!</h2>
      <p className="text-lg font-body text-muted-foreground mb-6">
        Something went awry in the kingdom. Fear not, our scribes are on it!
      </p>
      <p className="text-sm font-body text-muted-foreground mb-1">Error: {error.message}</p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="font-headline text-lg"
      >
        Try Again, Brave Knight!
      </Button>
    </div>
  );
}
