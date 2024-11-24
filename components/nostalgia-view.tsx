"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, BookOpen, Clock, PenLine, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { nostalgia } from "@/lib/nostalgia";
import { memory, Memory, NostalgiaWithMemories } from "@/lib/memory";
import { User } from "@/lib/types";
import { MemoryForm } from "@/components/memory-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface NostalgiaData {
  id: number;
  title: string;
  summary: string;
  participants: User[];
}

interface NostalgiaViewProps {
  id: string;
}

export function NostalgiaView({ id }: NostalgiaViewProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [nostalgiaData, setNostalgiaData] = useState<NostalgiaWithMemories | null>(null);
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await memory.listByNostalgia(parseInt(id), { skip: 0, limit: LIMIT });
      
      if (!response.success) {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch memories",
          variant: "destructive",
        });
        return;
      }

      setNostalgiaData(response.data || null);
      setHasMore((response.data?.memories?.length || 0) === LIMIT);
      setPage(0); // Reset pagination when refreshing
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, toast]);

  const handleMemoryAdded = () => {
    setIsAddingMemory(false);
    fetchData(); // Refresh the data
  };

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const response = await memory.listByNostalgia(parseInt(id), { skip: nextPage * LIMIT, limit: LIMIT });
      
      if (!response.success || !response.data || !nostalgiaData) {
        toast({
          title: "Error",
          description: response.error || "Failed to load more memories",
          variant: "destructive",
        });
        return;
      }

      const newMemories = response.data.memories || [];
      setNostalgiaData(prev => prev ? {
        ...prev,
        memories: [...prev.memories, ...newMemories]
      } : null);
      setHasMore(newMemories.length === LIMIT);
      setPage(nextPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more memories",
        variant: "destructive",
      });
    }
  };

  const calculateDuration = (memories: Memory[]) => {
    if (memories.length === 0) return "Just begun";
    const firstMemory = new Date(memories[0].created_at);
    const lastMemory = new Date(memories[memories.length - 1].created_at);
    const diffMonths = (lastMemory.getTime() - firstMemory.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (diffMonths < 1) return "Less than a month";
    if (diffMonths < 12) return `${Math.floor(diffMonths)} months`;
    const years = Math.floor(diffMonths / 12);
    const remainingMonths = Math.floor(diffMonths % 12);
    return `${years} ${years === 1 ? 'year' : 'years'}${remainingMonths > 0 ? ` and ${remainingMonths} months` : ''}`;
  };

  const getInitials = (user?: User) => {
    if (!user?.username) return '??';
    return user.username
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const memoryDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - memoryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getTimeBetween = (currentDate: string, previousDate?: string) => {
    if (!previousDate) return '';
    const current = new Date(currentDate);
    const previous = new Date(previousDate);
    const diffDays = Math.ceil((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'same day';
    if (diffDays === 1) return '1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  if (isLoading) {
    return <div className="text-center py-12 mt-16">Loading...</div>;
  }

  if (isAddingMemory) {
    return (
      <MemoryForm 
        nostalgiaId={id} 
        onDismiss={handleMemoryAdded}
      />
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12 mt-16">
      {isAddingMemory ? (
        <MemoryForm 
          nostalgiaId={id} 
          onDismiss={handleMemoryAdded}
        />
      ) : (
        <div>
          {/* Header Section */}
          <div className="mb-16 space-y-6">
            <h1 className="text-3xl font-medium tracking-wide text-foreground/90">
              {nostalgiaData?.title}
            </h1>
            
            <p className="text-sm text-muted-foreground/70 tracking-wider">
              A tale written by {nostalgiaData?.participants.map(p => p.username).join(' and ')}
            </p>

            <div className="flex gap-4 pt-4">
              <Button 
                onClick={() => setIsAddingMemory(true)}
                className="group"
              >
                <PlusCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Begin New Memory
              </Button>

              {nostalgiaData?.memories.length && nostalgiaData.memories.length > 0 && (
                <Button 
                  variant="outline"
                  asChild
                >
                  <Link href={`/nostalgia/${id}/summary`}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Summary
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="relative">
            <div className="absolute left-[60px] top-0 bottom-[80px] w-px bg-gradient-to-t from-primary/20 via-primary/10 to-transparent" />
            
            <div className="space-y-20 [&:has(*:hover)>*:not(:hover)]:opacity-30 [&:has(*:hover)>*:not(:hover)]:blur-[2px] 
              [&:has(*:hover)>*:not(:hover)]:transition-all [&:has(*:hover)>*:not(:hover)]:duration-500">
              {nostalgiaData?.memories.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((memory, index, sortedMemories) => (
                <div key={memory.id} 
                  className="relative group/memory transition-all duration-500 ease-in-out
                    hover:!blur-0 hover:!opacity-100
                    peer-hover/create:opacity-30 peer-hover/create:blur-[2px]"
                >
                  {index < sortedMemories.length - 1 && (
                    <div className="absolute left-[15px] top-[50%] -translate-y-1/2 text-right">
                      <p className="text-[11px] text-muted-foreground/60 font-serif rotate-180 [writing-mode:vertical-lr] whitespace-nowrap
                        tracking-wider group-hover/memory:text-muted-foreground/80 transition-colors duration-500">
                        {getTimeBetween(sortedMemories[index + 1].created_at, memory.created_at)}
                      </p>
                    </div>
                  )}

                  <div className="absolute left-[60px] -translate-x-1/2 transition-transform duration-500 group-hover/memory:scale-110">
                    <Avatar className="h-7 w-7 ring-2 ring-background">
                      {memory.created_by.avatar_url ? (
                        <AvatarImage 
                          src={memory.created_by.avatar_url} 
                          alt={memory.created_by.username}
                        />
                      ) : (
                        <AvatarFallback className="text-xs bg-primary/10">
                          {getInitials(memory.created_by)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  
                  <Link href={`/memory/${memory.id}`}>
                    <div className="pl-[84px]">
                      <div className="rounded-lg transition-all duration-500">
                        <h3 className="text-xl font-medium leading-snug tracking-wide text-foreground/80
                          group-hover/memory:text-primary/90 group-hover/memory:drop-shadow-[0_0_15px_rgba(var(--primary),.15)]
                          transition-all duration-500">
                          {memory.summary}
                        </h3>
                        
                        <div className="mt-3 space-y-3">
                          <p className="text-sm text-muted-foreground/70 leading-relaxed tracking-wide
                            group-hover/memory:text-muted-foreground/90 transition-colors duration-500">
                            {memory.content}
                          </p>
                          
                          {memory.mood && (
                            <div className="flex items-center">
                              <Badge 
                                variant="secondary" 
                                className="text-xs tracking-wide px-2 py-0.5 
                                  bg-primary/5 hover:bg-primary/10 
                                  text-primary/70 
                                  transition-colors duration-500
                                  group-hover/memory:bg-primary/10
                                  group-hover/memory:text-primary/80"
                              >
                                {memory.mood_emoji} {memory.mood}
                              </Badge>
                            </div>
                          )}
                          
                          <div className="pt-2 opacity-0 group-hover/memory:opacity-100 transition-all duration-500">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs tracking-wider text-muted-foreground/70 
                                hover:text-primary/70 group-hover/memory:drop-shadow-[0_0_10px_rgba(var(--primary),.1)]
                                transition-colors duration-500"
                            >
                              REVISIT
                              <ArrowRight className="w-3 h-3 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="relative group/memory">
                <div className="absolute left-[60px] -translate-x-1/2 w-2 h-2 rounded-full bg-muted/60" />
                <Button 
                  variant="ghost" 
                  onClick={loadMore}
                  className="pl-[84px] text-xs text-muted-foreground/70 hover:text-primary/70 tracking-wider
                    transition-colors duration-500"
                >
                  Load Older Memories
                  <Clock className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}