"use client";

import React from "react";

type Experiencia = {
  puesto: string;
  empresa: string;
  ubicacion: string;
  periodo: string;
  descripcion: string[];
};

type InformacionProfesionalProps = {
  experiencia: Experiencia[];
  soloReciente?: boolean;
  especialidades: string[];
  unaSolaEspecialidad?: boolean;
  habilidades: {
    programacion: string[];
    web: string[];
    movil: string[];
  };
  habilidadesSeparadas?: boolean;
  certificados: { nombre: string; año?: number }[];
  mostrarAñoCertificado?: boolean;
  idiomas: { idioma: string; nivel: string; certificacion?: string }[];
  mostrarCertificacion?: boolean;
};

export default function InformacionProfesional({
  experiencia,
  soloReciente = false,
  especialidades,
  unaSolaEspecialidad = false,
  habilidades,
  habilidadesSeparadas = true,
  certificados,
  mostrarAñoCertificado = true,
  idiomas,
  mostrarCertificacion = true,
}: InformacionProfesionalProps) {
  const experienciaMostrada = soloReciente ? [experiencia[0]] : experiencia;
  const especialidadesMostradas = unaSolaEspecialidad ? [especialidades[0]] : especialidades;

  return (
    <div className="space-y-6 text-sm text-gray-800">
      {/* Experiencia */}
      <section>
        <h3 className="font-bold text-base mb-1">Experiencia Profesional</h3>
        {experienciaMostrada.map((exp, i) => (
          <div key={i} className="mb-2">
            <p className="font-semibold">
              {exp.puesto} ({exp.empresa}, {exp.ubicacion}) - <span className="text-gray-700">{exp.periodo}</span>
            </p>
            <ul className="list-disc list-inside ml-4">
              {exp.descripcion.map((linea, j) => (
                <li key={j}>{linea}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Área de Especialidad */}
      <section>
        <h3 className="font-bold text-base mb-1">Área de especialidad</h3>
        <ul className="list-disc list-inside ml-4">
          {especialidadesMostradas.map((area, i) => (
            <li key={i}>{area}</li>
          ))}
        </ul>
      </section>

      {/* Habilidades */}
      <section>
        <h3 className="font-bold text-base mb-1">Habilidades</h3>
        {habilidadesSeparadas ? (
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Lenguajes de Programación:</strong> {habilidades.programacion.join(", ")}</li>
            <li><strong>Desarrollo Web:</strong> {habilidades.web.join(", ")}</li>
            <li><strong>Desarrollo Móvil:</strong> {habilidades.movil.join(", ")}</li>
          </ul>
        ) : (
          <ul className="list-disc list-inside ml-4">
            {[...habilidades.programacion, ...habilidades.web, ...habilidades.movil].map((hab, i) => (
              <li key={i}>{hab}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Certificados */}
      <section>
        <h3 className="font-bold text-base mb-1">Certificados</h3>
        <ul className="list-disc list-inside ml-4">
          {certificados.map((cert, i) => (
            <li key={i}>
              {cert.nombre}{mostrarAñoCertificado && cert.año ? ` - ${cert.año}` : ""}
            </li>
          ))}
        </ul>
      </section>

      {/* Idiomas */}
      <section>
        <h3 className="font-bold text-base mb-1">Idiomas</h3>
        <ul className="list-disc list-inside ml-4">
          {idiomas.map((idioma, i) => (
            <li key={i}>
              {idioma.idioma}: {idioma.nivel}
              {mostrarCertificacion && idioma.certificacion ? ` (${idioma.certificacion})` : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
