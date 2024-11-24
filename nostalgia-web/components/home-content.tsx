"use client";

import { EmptyState } from "@/components/empty-state";
import { MainState } from "@/components/main-state";
import { useConnections } from "@/hooks/use-connections";
import { useAuth } from "@/lib/auth-context";

export function HomeContent() {
  const { user } = useAuth();
  const { connections } = useConnections();
  const hasConnections = connections.length > 0;

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      {hasConnections ? <MainState /> : <EmptyState />}
    </div>
  );
}