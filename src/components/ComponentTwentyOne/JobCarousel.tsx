import React from "react";
import ComponentTwenty from "@/components/ComponentTwenty/JobCard";

export default function JobCarousel() {
  const vacantes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Vacantes destacadas
      </h2>

      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4">
        {vacantes.map((vacante) => (
          <div key={vacante.id} className="shrink-0 w-96 snap-start">
            <ComponentTwenty />
          </div>
        ))}
      </div>
    </div>
  );
}
