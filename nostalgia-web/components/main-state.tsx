"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchDialog } from "@/components/search-dialog";
import { useState, useEffect } from "react";
import { UserPlus2, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { nostalgia, Nostalgia } from "@/lib/nostalgia";
import { useToast } from "@/components/ui/use-toast";
import { listInvites, acceptInvite } from '@/lib/api/user';
import type { InviteResponse } from '@/lib/types';

export function MainState() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [nostalgias, setNostalgias] = useState<Nostalgia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [pendingInvites, setPendingInvites] = useState<InviteResponse['data'][]>([]);

  useEffect(() => {
    const fetchNostalgias = async () => {
      try {
        const response = await nostalgia.list();
        if (response.success) {
          setNostalgias(response.data || []);
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to load nostalgias",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNostalgias();
  }, [toast]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const invites = await listInvites();
        const pendingOnes = invites.filter(invite => 
          invite.status.toLowerCase() === 'pending'
        );
        console.log('Filtered pending invites:', pendingOnes);
        setPendingInvites(pendingOnes);
      } catch (error) {
        console.error('Error fetching invites:', error);
        toast({
          title: "Error",
          description: "Failed to load invites",
          variant: "destructive",
        });
      }
    };

    fetchInvites();
  }, [toast]);

  const handleAcceptInvite = async (inviteId: number) => {
    try {
      await acceptInvite(inviteId);
      setPendingInvites(current => current.filter(invite => invite.id !== inviteId));
      toast({
        title: "Success",
        description: "Invite accepted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept invite",
        variant: "destructive",
      });
    }
  };

  console.log('Current pendingInvites:', pendingInvites);

  if (isLoading) {
    return <div className="mt-24">Loading...</div>;
  }

  return (
    <div className="space-y-8 mt-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Memories</h1>
        <Button
          onClick={() => setIsSearchOpen(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <UserPlus2 className="w-5 h-5" />
          Add Connection
        </Button>
      </div>

      {pendingInvites.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Pending Invites ({pendingInvites.length})</h2>
          <div className="grid gap-4">
            {pendingInvites.map((invite) => {
              console.log('Rendering invite:', invite);
              return (
                <Card key={invite.id} className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="font-medium">{invite.sender.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAcceptInvite(invite.id)}
                        variant="default"
                        size="sm"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => {
                          setPendingInvites(current =>
                            current.filter(i => i.id !== invite.id)
                          );
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {nostalgias.map((item) => (
          <Link key={item.id} href={`/nostalgia/${item.id}`}>
            <Card className="p-6 hover:bg-accent transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>
                      {item.participants.map((p) => p.username).join(", ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  );
}