"use client";

import { useRouter } from "next/navigation";

export default function ExamenIntroPage() {
  const router = useRouter();

  return (
    <main className="max-w-2xl mx-auto pt-28 pb-12 px-4 text-center text-black">
      <h1 className="text-4xl font-bold mb-6">Examen de prueba técnica</h1>
      <p className="text-lg mb-8">
        Este examen tiene 2 preguntas. Lee bien y selecciona la respuesta correcta.
      </p>
      <button
        onClick={() => router.push("/examen/iniciar/prueba")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        Iniciar examen
      </button>
    </main>
  );
}
