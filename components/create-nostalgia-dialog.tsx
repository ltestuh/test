"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { nostalgia } from "@/lib/nostalgia";

interface CreateNostalgiaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateNostalgiaDialog({
  open,
  onOpenChange,
}: CreateNostalgiaDialogProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await nostalgia.create({ title, summary });
      if (response.success) {
        toast({
          title: "Success",
          description: "Your story has been created",
        });
        onOpenChange(false);
        router.push(`/nostalgia/${response.data.id}`);
      } else {
        throw new Error(response.error || "Failed to create story");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create story",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-tight">
            Begin a New Story
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm tracking-wider">
                TITLE
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-white/10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary" className="text-sm tracking-wider">
                SUMMARY
              </Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="bg-transparent border-white/10 resize-none"
                rows={4}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full tracking-widest border border-white/10"
            variant="ghost"
            disabled={isSubmitting}
          >
            {isSubmitting ? "CREATING..." : "CREATE STORY"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}