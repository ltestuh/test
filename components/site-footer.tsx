"use client";

import { BookHeart, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function SiteFooter() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex flex-col md:h-16 items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2 text-handwriting">
            <BookHeart className="h-5 w-5" />
            <p className="text-sm text-muted-foreground">
              Share your stories, preserve your memories
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 border border-white/10"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Built with love in {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}