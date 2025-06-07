"use client";

import { useSearchParams } from "next/navigation";

export default function ExamenTitle() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Junior Software Developer";

  return (
    <p className="text-3xl font-medium text-blue-600">“{title}”</p>
  );
}
