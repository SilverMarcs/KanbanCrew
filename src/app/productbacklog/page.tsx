// app/productbacklog/page.tsx
"use client";

import { AuthCheck } from "@/components/AuthCheck";
import ProductBacklog from "./ProductBacklog";
import { useAuthContext } from "@/contexts/AuthContext";

export default function ProductBacklogPage() {
  const { loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <AuthCheck>
      <div className="p-16">
        <ProductBacklog />
      </div>
    </AuthCheck>
  );
}
