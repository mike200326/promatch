"use client";

import { useParams } from "next/navigation";
import CategorySalaryHistogramChart from "@/components/stats1/CategorySalaryHistogramChart";

export default function DetailsPage() {
  const { topic } = useParams();

  if (!topic || typeof topic !== "string") {
    return <p className="text-center text-red-600 p-6">Tema inválido.</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-center capitalize text-gray-500">
        Estadísticas de {topic}
      </h1>
      <CategorySalaryHistogramChart topic={topic} />
    </main>
  );
}
