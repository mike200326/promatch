import React from "react";
import { useRouter } from "next/navigation";

export default function JobCard() {
  const router = useRouter();

  return (
    <div className="bg-[#fefcfb] border border-gray-200 rounded-2xl p-6 max-w-xl w-full shadow-md">
      {/* Logo + Empresa */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-[#9e3c1e]">Manza</h2>
        <p className="text-sm text-gray-700 font-medium">FRONT-END DEVELOPER</p>
        <p className="text-xs text-gray-500">Frontend Developer Jr. – Manza</p>
      </div>

      {/* Modalidad + Tipo */}
      <ul className="text-sm text-gray-600 space-y-1 mt-2 mb-4">
        <li>📍 Ubicación: Remoto / Híbrido / Presencial</li>
        <li>🕐 Tipo: Tiempo completo</li>
      </ul>

      {/* Descripción empresa */}
      <p className="text-sm text-gray-600 mb-3">
        Manza desarrolla nuevas experiencias digitales intuitivas. Buscamos un
        frontend developer con ganas de aprender y aportar en un equipo
        dinámico.
      </p>

      {/* Responsabilidades */}
      <div className="mb-3">
        <p className="font-semibold text-sm text-gray-700">
          Responsabilidades:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>
            Desarrollar interfaces responsivas con HTML, CSS y JavaScript.
          </li>
          <li>Trabajar con React, Vue o Angular.</li>
          <li>Colaborar con diseñadores y backend.</li>
          <li>Optimizar rendimiento y accesibilidad.</li>
        </ul>
      </div>

      {/* Requisitos */}
      <div className="mb-6">
        <p className="font-semibold text-sm text-gray-700">Requisitos:</p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Conocimientos en HTML, CSS3, JavaScript y Git.</li>
          <li>Familiaridad con frameworks modernos.</li>
          <li>Pasión por el aprendizaje y ganas de aprender.</li>
          <li>Extras: APIs REST, pruebas con Jest o Cypress.</li>
        </ul>
      </div>

      {/* Botón */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push("/examen")}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Hacer Examen
        </button>
      </div>
    </div>
  );
}
