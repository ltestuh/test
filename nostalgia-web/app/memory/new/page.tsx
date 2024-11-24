import { MemoryForm } from "@/components/memory-form";
import { ProtectedRoute } from "@/components/protected-route";

export default function NewMemoryPage({
  searchParams,
}: {
  searchParams: { nostalgia?: string };
}) {
  return (
    <ProtectedRoute>
      <MemoryForm nostalgiaId={searchParams.nostalgia} />
    </ProtectedRoute>
  );
}