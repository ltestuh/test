"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Mood {
  name: string;
  emoji: string;
}

const DEFAULT_MOODS: Mood[] = [
  { name: "Happy", emoji: "😊" },
  { name: "Sad", emoji: "😢" },
  { name: "Excited", emoji: "🤩" },
  { name: "Nostalgic", emoji: "🕰️" },
  { name: "Anxious", emoji: "😰" },
];

const ALL_MOODS: Mood[] = [
  { name: "Happy", emoji: "😊" },
  { name: "Sad", emoji: "😢" },
  { name: "Excited", emoji: "🤩" },
  { name: "Nostalgic", emoji: "🕰️" },
  { name: "Anxious", emoji: "😰" },
  { name: "Content", emoji: "🙂" },
  { name: "Surprised", emoji: "😲" },
  { name: "Angry", emoji: "😠" },
  { name: "Peaceful", emoji: "🕊️" },
  { name: "Joyful", emoji: "😁" },
  { name: "Frustrated", emoji: "😤" },
  { name: "Hopeful", emoji: "🤞" },
  { name: "Melancholic", emoji: "😔" },
  { name: "Inspired", emoji: "💡" },
  { name: "Bored", emoji: "😐" },
  { name: "Fearful", emoji: "😱" },
  { name: "Grateful", emoji: "🙏" },
  { name: "Confused", emoji: "🤔" },
  { name: "Proud", emoji: "😌" },
  { name: "Lonely", emoji: "😞" },
  { name: "Curious", emoji: "🤓" },
  { name: "Euphoric", emoji: "🥳" },
  { name: "Disappointed", emoji: "😕" },
  { name: "Relaxed", emoji: "😌" },
  { name: "Amused", emoji: "😄" },
  { name: "Optimistic", emoji: "😊" },
  { name: "Guilty", emoji: "😳" },
  { name: "Jealous", emoji: "😒" },
  { name: "Envious", emoji: "😏" },
  { name: "Love", emoji: "❤️" },
  { name: "Tender", emoji: "🤗" },
  { name: "Apprehensive", emoji: "😬" },
  { name: "Awestruck", emoji: "😲" },
  { name: "Embarrassed", emoji: "😅" },
  { name: "Determined", emoji: "💪" },
  { name: "Resentful", emoji: "😠" },
  { name: "Skeptical", emoji: "🤨" },
  { name: "Bewildered", emoji: "😵" },
  { name: "Elated", emoji: "😃" },
  { name: "Satisfied", emoji: "😌" },
  { name: "Homesick", emoji: "🏠" },
  { name: "Shy", emoji: "😊" },
  { name: "Anguished", emoji: "😣" },
  { name: "Empowered", emoji: "🚀" },
  { name: "Trusting", emoji: "🤝" },
  { name: "Serene", emoji: "🌅" },
  { name: "Vindicated", emoji: "😏" },
  { name: "Overwhelmed", emoji: "😵" },
  { name: "Cheerful", emoji: "😀" },
  { name: "Wistful", emoji: "😔" },
];

interface MoodPickerProps {
  selectedMood?: Mood;
  onSelect: (mood: Mood) => void;
}

export function MoodPicker({ selectedMood, onSelect }: MoodPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const MoodButton = ({ mood }: { mood: Mood }) => (
    <Button
      variant="ghost"
      className={cn(
        "flex items-center gap-2 px-4 py-2",
        "hover:bg-primary/10",
        selectedMood?.name === mood.name && "bg-primary/20"
      )}
      onClick={() => {
        onSelect(mood);
        setIsOpen(false);
      }}
    >
      <span className="text-2xl">{mood.emoji}</span>
      <span className="text-sm tracking-wide">{mood.name}</span>
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {DEFAULT_MOODS.map((mood) => (
          <MoodButton key={mood.name} mood={mood} />
        ))}
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(true)}
        >
          View All
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <h2 className="text-xl font-light tracking-tight mb-4">Select Mood</h2>
          <ScrollArea className="h-[60vh]">
            <div className="grid grid-cols-2 gap-2">
              {ALL_MOODS.map((mood) => (
                <MoodButton key={mood.name} mood={mood} />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
} 