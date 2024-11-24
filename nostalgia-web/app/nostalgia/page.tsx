"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { NostalgiaList } from "@/components/nostalgia-list";
import { CreateNostalgiaDialog } from "@/components/create-nostalgia-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function NostalgiaPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="container max-w-2xl mx-auto px-4 py-24">
        <div className="space-y-12">
          <NostalgiaList />
        </div>
      </div>
    </ProtectedRoute>
  );
}