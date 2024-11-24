"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Home, BookOpen, User, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SiteHeaderProps {
  showAuthLinks?: boolean;
}

export function SiteHeader({ showAuthLinks }: SiteHeaderProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const menuItems = [
    { 
      icon: Home, 
      label: "HOME", 
      description: "Return to your journey's beginning",
      href: "/" 
    },
    { 
      icon: BookOpen, 
      label: "YOUR STORIES", 
      description: "Explore the tales you've woven",
      href: "/nostalgia" 
    },
    { 
      icon: User, 
      label: "YOUR PROFILE", 
      description: "Chronicle your personal saga",
      href: "/" 
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-sm tracking-[0.2em] font-light">
              NOSTALGIA
            </Link>

            <div className="flex items-center space-x-4">
              {showAuthLinks ? (
                <div className="flex items-center space-x-4">
                  <Button asChild variant="ghost" className="text-sm tracking-wider">
                    <Link href="/login">SIGN IN</Link>
                  </Button>
                  <Button asChild variant="ghost" className="text-sm tracking-wider border border-white/10">
                    <Link href="/register">BEGIN</Link>
                  </Button>
                </div>
              ) : user ? (
                <Button 
                  variant="ghost" 
                  className="group h-9 px-4 border border-white/10 hover:bg-white/5"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-6 w-6 ring-2 ring-white/10 transition-all duration-300 group-hover:ring-white/20">
                      {user.avatar_url ? (
                        <AvatarImage 
                          src={user.avatar_url} 
                          alt={user.name || user.username} 
                        />
                      ) : (
                        <AvatarFallback className="text-xs font-light bg-primary/10">
                          {getInitials(user.name || user.username)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm tracking-wider font-light">
                      {user.name || user.username}
                    </span>
                  </div>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Full screen menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget || e.target instanceof Element && e.target.classList.contains('backdrop')) {
              setIsOpen(false);
            }
          }}
        >
          <div className="backdrop absolute inset-0 bg-background/90 backdrop-blur-xl">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 border border-white/10 hover:bg-white/5"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close menu</span>
            </Button>

            <div className="container max-w-lg mx-auto h-full flex items-center justify-center">
              <div className="w-full space-y-3 group">
                {menuItems.map((item, index) => (
                  <Link 
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "block w-full px-6 py-8 space-y-2",
                      "transition-all duration-500 rounded-lg",
                      "text-left opacity-0",
                      "group-hover:[&:not(:hover)]:blur-[5px] group-hover:[&:not(:hover)]:opacity-50",
                      "animate-[fade-in_0.6s_ease-out_forwards]"
                    )}
                    style={{ 
                      animationDelay: `${150 + index * 100}ms`
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon className="w-6 h-6 opacity-50" />
                      <span className="text-2xl tracking-wider font-light">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-base text-muted-foreground dark:text-muted-foreground/70 pl-10 tracking-wide">
                      {item.description}
                    </p>
                  </Link>
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    logout();
                  }}
                  className={cn(
                    "w-full px-6 py-8 space-y-2",
                    "transition-all duration-500 rounded-lg",
                    "text-left opacity-0",
                    "opacity-20",
                    "group-hover:[&:not(:hover)]:blur-[8px]",
                    "group-hover:[&:not(:hover)]:opacity-10",
                    "animate-[fade-in_0.6s_ease-out_forwards]"
                  )}
                  style={{ 
                    animationDelay: `${150 + menuItems.length * 100}ms`
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <LogOut className="w-6 h-6 opacity-20" />
                    <span className="text-2xl tracking-wider font-light text-muted-foreground/70">
                      SIGN OUT
                    </span>
                  </div>
                  <p className="text-base pl-10 tracking-wide text-muted-foreground/50">
                    Close this chapter of your journey
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}