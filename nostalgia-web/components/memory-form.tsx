"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { memory, MemoryCreate } from "@/lib/memory";
import { useRouter } from "next/navigation";
import { ImageIcon, MusicIcon, Loader2Icon, SaveIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoodPicker } from "@/components/mood-picker";

interface MemoryFormProps {
  nostalgiaId: string;
  onDismiss: () => void;
}

interface FileData {
  name: string;
  file: File;
  type: 'image' | 'audio';
}

export function MemoryForm({ nostalgiaId, onDismiss }: MemoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<MemoryCreate, 'nostalgia_id'>>({
    summary: "",
    content: "",
    mood: null,
    mood_emoji: null,
  });
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileType = event.target.accept.includes('image') ? 'image' : 'audio';
    
    const newFiles: FileData[] = Array.from(files).map(file => ({
      name: file.name,
      file: file,
      type: fileType
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await memory.create({
        ...formData,
        nostalgia_id: parseInt(nostalgiaId)
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to save memory');
      }

      // Handle file uploads here if needed
      // TODO: Implement file upload logic

      toast({
        title: "Success",
        description: "Memory saved successfully",
      });

      // Reset form
      setFormData({ summary: "", content: "", mood: null, mood_emoji: null });
      setSelectedFiles([]);
      
      // Navigate back to nostalgia view and refresh the page
      router.push(`/nostalgia/${nostalgiaId}`);
      router.refresh();
      onDismiss(); // Close the form modal/overlay

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save memory",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12 mt-16">
      <Card className="border-none shadow-none bg-background/60 backdrop-blur-sm relative">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-4 top-4",
            "hover:bg-background/80",
            "text-muted-foreground",
            "hover:text-foreground"
          )}
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="space-y-4">
          <p className="text-sm tracking-widest text-muted-foreground">
            {new Date().toLocaleDateString()}
          </p>
          <h1 className="text-4xl font-light tracking-tight">New Memory</h1>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <Label 
                  htmlFor="summary" 
                  className="text-sm tracking-wider text-foreground"
                >
                  TITLE
                </Label>
                <Input
                  id="summary"
                  placeholder="A brief description of this memory"
                  required
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  className={cn(
                    "bg-background/50",
                    "border-border/50",
                    "focus:border-primary/50",
                    "placeholder:text-muted-foreground"
                  )}
                />
              </div>

              <div className="space-y-4">
                <Label 
                  htmlFor="content" 
                  className="text-sm tracking-wider text-foreground"
                >
                  CONTENT
                </Label>
                <Textarea
                  id="content"
                  placeholder="Share your story..."
                  className={cn(
                    "min-h-[300px]",
                    "bg-background/50",
                    "border-border/50",
                    "focus:border-primary/50",
                    "placeholder:text-muted-foreground"
                  )}
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm tracking-wider text-foreground">
                  MOOD
                </Label>
                <MoodPicker
                  selectedMood={
                    formData.mood
                      ? { name: formData.mood, emoji: formData.mood_emoji || "" }
                      : undefined
                  }
                  onSelect={(mood) =>
                    setFormData({
                      ...formData,
                      mood: mood.name,
                      mood_emoji: mood.emoji,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "flex-1",
                  "border-border/50",
                  "hover:bg-primary/10",
                  "hover:text-primary"
                )}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Add Images
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </Button>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "flex-1",
                  "border-border/50",
                  "hover:bg-primary/10",
                  "hover:text-primary"
                )}
                onClick={() => document.getElementById("audio-upload")?.click()}
              >
                <MusicIcon className="w-4 h-4 mr-2" />
                Add Audio
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm tracking-wider text-foreground">
                  SELECTED FILES
                </Label>
                <div className="space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      {file.type === 'image' ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <MusicIcon className="w-4 h-4" />
                      )}
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className={cn(
                "w-full",
                "tracking-widest",
                "transition-all",
                "duration-200"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  SAVING...
                </>
              ) : (
                <>
                  <SaveIcon className="w-4 h-4 mr-2" />
                  SAVE MEMORY
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}