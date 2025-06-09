"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ExamenTitle from "@/components/quiz/ExamenTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Clock } from "lucide-react";

export default function ExamenIntroPage() {
  const router = useRouter();

  // ✅ Leer el title del query param en esta página también
  const [title, setTitle] = useState("Junior Software Developer");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const titleParam = params.get("title") || "Junior Software Developer";
    setTitle(titleParam);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-lg text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          Examen para el puesto
        </h1>
        <Suspense fallback={null}>
          <ExamenTitle />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
        <section className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              📝 Instrucciones
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 text-xl leading-relaxed">
              <li>Asegúrate de contar con una conexión a internet estable.</li>
              <li>Ten un editor de código listo, como VS Code o PyCharm.</li>
              <li>Usa nombres de variables significativos y código limpio.</li>
              <li>
                Considera la complejidad temporal y espacial de tus soluciones.
              </li>
              <li>
                Incluye comentarios solo cuando realmente sean necesarios.</li>
              <li>Contacta soporte si experimentas problemas técnicos.</li>
              <li>No hagas trampas: se detecta actividad sospechosa.</li>
              <li>
                Revisa tu código por errores de sintaxis o lógica antes de
                enviar.
              </li>
              <li>
                Lee cuidadosamente cada pregunta y selecciona la(s) correcta(s).
              </li>
            </ul>
          </div>

          <div className="flex justify-center pt-6">
            <button
              onClick={() =>
                router.push(`/examen/iniciar?title=${encodeURIComponent(title)}`)
              }
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-700 transition-transform duration-200 hover:scale-105"
            >
              Comenzar examen
            </button>
          </div>
        </section>

        <aside className="space-y-6">
          <Card className="bg-gray-50 shadow-sm">
            <CardHeader className="text-center">
              <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <CardTitle className="text-3xl font-bold text-gray-800">
                60 minutos
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Tiempo disponible para esta prueba
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-50 shadow-sm">
            <CardContent className="text-center py-6 space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/00000000"
                  alt="Avatar de Roberto Díaz"
                />
                <AvatarFallback>RD</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-xl text-gray-800">
                Roberto Díaz
              </p>
              <p className="text-lg text-gray-600">Ingeniero en Computación</p>
              <p className="text-lg text-gray-600">Tecnológico de Monterrey</p>
              <p className="text-lg text-gray-600">CDMX</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
