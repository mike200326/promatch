import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CVCard = () => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
      {/* Encabezado */}
      <div className="px-6 pt-6">
        <h2 className="text-2xl font-bold text-gray-800">Analiza tu CV</h2>
        <p className="text-sm text-gray-500">Descubre dónde</p>
      </div>

      {/* Imagen */}
      <div className="px-6 py-4">
        <Image
          src="https://www.questionpro.com/blog/wp-content/uploads/2024/06/Analise-da-informacao.jpg"
          alt="Ilustración estudiante"
          width={400} // Ajusta según el tamaño que quieras
          height={300}
          className="w-full h-48 object-contain rounded-md"
        />
      </div>

      {/* Texto informativo */}
      <div className="px-6 pb-4">
        <p className="text-lg font-semibold text-gray-700">
          ¿Estás buscando trabajo?
        </p>
        <p className="text-sm text-gray-600 mt-1">
          ¡Descubre en qué áreas de la industria tienes más probabilidades de
          ser contratada y recibe información valiosa!
        </p>
      </div>

      {/* Botón */}
      <div className="px-6 pb-6">
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          onClick={() => router.push("/cv/cv_analizar")}
        >
          Analizar
        </button>
      </div>
    </div>
  );
};

export default CVCard;
