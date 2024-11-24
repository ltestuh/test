import { BookHeart } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
      <BookHeart className="w-12 h-12 animate-pulse" />
      <p className="text-lg text-muted-foreground">Loading...</p>
    </div>
  );
}