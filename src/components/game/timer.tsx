"use client";

import { useEffect, useState } from 'react';
import { TimerIcon } from 'lucide-react';

interface TimerProps {
  isRunning: boolean;
  onReset?: (time: number) => void;
  resetKey?: number; 
}

export default function Timer({ isRunning, onReset, resetKey }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setSeconds(0); // Reset timer when resetKey changes
  }, [resetKey]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      if (onReset) {
        onReset(seconds);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds, onReset]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-semibold text-primary p-2 bg-card rounded-md shadow">
      <TimerIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      <span className="font-mono tracking-wider">{formatTime(seconds)}</span>
    </div>
  );
}
