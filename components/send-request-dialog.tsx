"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConnections } from "@/hooks/use-connections";
import type { User } from "@/lib/types";
import { sendConnectionInvite } from "@/lib/api/user";

interface SendRequestDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendRequestDialog({ user, open, onOpenChange }: SendRequestDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { addConnection } = useConnections();

  if (!user) return null;

  const handleSendRequest = async () => {
    setIsSending(true);
    try {
      await sendConnectionInvite(user.id);
      addConnection(user);
      toast({
        title: "Request Sent!",
        description: `Connection request sent to ${user.username}.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Connection Request</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback>
              {user.username.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.username}</p>
          </div>
          <Button
            className="w-full flex items-center gap-2"
            onClick={handleSendRequest}
            disabled={isSending}
          >
            <Check className="w-4 h-4" />
            Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}