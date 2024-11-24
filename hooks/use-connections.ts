"use client";

import { User } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConnectionsStore {
  connections: User[];
  addConnection: (connection: User) => void;
  removeConnection: (connectionId: string) => void;
}

export const useConnections = create<ConnectionsStore>()(
  persist(
    (set) => ({
      connections: [],
      addConnection: (connection) =>
        set((state) => ({
          connections: [...state.connections, connection],
        })),
      removeConnection: (connectionId: string) =>
        set((state) => ({
          connections: state.connections.filter((c) => c.id.toString() !== connectionId),
        })),
    }),
    {
      name: "connections-storage",
    }
  )
);