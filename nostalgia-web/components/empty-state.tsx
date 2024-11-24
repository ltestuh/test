"use client";

import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/search-dialog";
import { useState } from "react";
import { UserPlus2, BookHeart } from "lucide-react";

export function EmptyState() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center">
      <BookHeart className="w-16 h-16 text-primary" />
      <div className="space-y-4">
        <h1 className="text-4xl font-heading font-bold tracking-tight">Welcome to Nostalgia</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Start preserving your shared memories with friends and loved ones.
          Connect with someone to begin your journey.
        </p>
      </div>
      <Button
        size="lg"
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center gap-2"
      >
        <UserPlus2 className="w-5 h-5" />
        Add Connection
      </Button>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  );
}