import { NostalgiaView } from "@/components/nostalgia-view";
import { ProtectedRoute } from "@/components/protected-route";

// Add this function to generate static paths
export async function generateStaticParams() {
  // Generate a few placeholder IDs to satisfy the static export requirement
  return Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
  }));
}

// Add this for static rendering
export const dynamic = 'force-static';
export const dynamicParams = true;

export default function NostalgiaPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <NostalgiaView id={params.id} />
    </ProtectedRoute>
  );
}