import { MemoryView } from "@/components/memory-view";
import { ProtectedRoute } from "@/components/protected-route";

export default function MemoryPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <MemoryView id={params.id} />
    </ProtectedRoute>
  );
}