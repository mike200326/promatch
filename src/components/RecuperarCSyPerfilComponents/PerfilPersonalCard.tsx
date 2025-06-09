// app/components/PerfilPersonalCard.tsx
"use client";
import React from "react";

type PerfilPersonalCardProps = {
  nombre: string;
  carrera: string;
  universidad?: string;
  ubicacion?: string;
};

export default function PerfilPersonalCard({
  nombre,
  carrera,
  universidad,
  ubicacion,
}: PerfilPersonalCardProps) {
  return (
    <div className="max-w-xs mx-auto bg-white rounded-xl shadow-md p-6 text-center space-y-3">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-sky-300 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-purple-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14c2.21 0 4-1.79 4-4S14.21 6 12 6 8 7.79 8 10s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{nombre}</h3>
        <p className="text-sm text-gray-700">{carrera}</p>
        {universidad && <p className="text-sm text-gray-700">{universidad}</p>}
        {ubicacion && <p className="text-sm font-medium text-gray-900">{ubicacion}</p>}
      </div>
    </div>
  );
}
