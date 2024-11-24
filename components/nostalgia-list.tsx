"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Users, Clock, BookOpen, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { nostalgia, Nostalgia } from "@/lib/nostalgia";
import Image from "next/image";

export function NostalgiaList() {
  const [stories, setStories] = useState<Nostalgia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await nostalgia.list();
        if (response.success) {
          setStories(response.data || []);
        } else {
          throw new Error(response.error || "Failed to load stories");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your stories",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4">
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-white/5 animate-pulse rounded-sm opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4">
        <p className="font-serif italic text-muted-foreground animate-fade-in">
          The pages are blank, waiting for your first story to unfold.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="max-w-2xl mx-auto py-24 px-4">
        <div className="space-y-16 animate-fade-in">
          <header className="space-y-3">
            <div className="space-y-1">
              <h1 className="font-serif text-4xl tracking-tight">
                Your stories
              </h1>
              <p className="text-muted-foreground text-sm tracking-wide pt-2">
                {stories.length} {stories.length === 1 ? 'story' : 'stories'} carefully preserved
              </p>
            </div>
            <div className="w-24 h-[1px] bg-gradient-to-r from-foreground/20 to-transparent" />
          </header>
          <div className="space-y-16 relative">
            {stories.map((story, index) => {
            const duration = calculateDuration(story.created_at);

            return (
              <div
                key={story.id}
                className="opacity-0 animate-slide-in 
                  hover:opacity-100 hover:scale-[1.02] 
                  [.space-y-16:hover_&:not(:hover)]:blur-[3px] [.space-y-16:hover_&:not(:hover)]:opacity-30
                  transition-all duration-300 rounded-lg p-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/nostalgia/${story.id}`}>
                  <article className="group relative pl-20">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-20 h-20">
                      <Image
                        src="/images/icons/nostalgia.png"
                        alt=""
                        width={80}
                        height={80}
                        className="group-hover:rotate-45 transition-transform duration-700 opacity-20 
                          group-hover:opacity-40 filter brightness-200 contrast-200
                          dark:brightness-200 dark:invert-0 invert"
                      />
                    </div>

                    <div className="space-y-4 relative">
                      <h2 className="font-serif text-2xl tracking-tight text-foreground/80 
                        group-hover:text-foreground 
                        transition-all duration-300">
                        {story.title}
                      </h2>

                      <div className="flex items-center gap-8 text-sm text-foreground/40 
                        group-hover:text-foreground/70 transition-colors duration-300">
                        <div className="font-serif italic">
                          by {story.participants.map(p => p.username).join(" & ")}
                        </div>
                        <div className="w-4 h-[1px] bg-foreground/20" />
                        <time className="font-mono tracking-tight text-xs">
                          {duration}
                        </time>
                      </div>

                      <div className="text-xs text-foreground/30 
                        group-hover:text-foreground/50 transition-colors duration-300 
                        flex items-center gap-3 font-serif italic opacity-0 
                        group-hover:opacity-100 transition-all duration-300">
                        <div className="w-8 h-[1px] bg-foreground/20 
                          group-hover:w-16 transition-all duration-300" />
                        <span>read memory</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this helper function
function calculateDuration(createdAt: string) {
  if (!createdAt) return 'Ongoing';
  
  const start = new Date(createdAt);
  const now = new Date();
  const diffMonths = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (diffMonths < 1) return 'This month';
  if (diffMonths < 12) return `${Math.floor(diffMonths)} months ago`;
  const years = Math.floor(diffMonths / 12);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}