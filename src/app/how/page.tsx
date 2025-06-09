"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HowItWorksPage() {
  const features = [
    {
      title: "Bolsa de Trabajo Inteligente",
      description:
        "Conectamos candidatos con empleos que realmente coinciden con sus habilidades y aspiraciones.",
      icon: "/icons/job-match.svg",
      color: "bg-blue-100",
    },
    {
      title: "Organización Eficiente",
      description:
        "Nuestra plataforma organiza automáticamente candidatos y vacantes para un proceso de contratación más rápido.",
      icon: "/icons/organization.svg",
      color: "bg-purple-100",
    },
    {
      title: "Analizador de CV con IA",
      description:
        "Nuestra IA analiza tu currículum y ofrece recomendaciones personalizadas para mejorarlo.",
      icon: "/icons/ai-cv.svg",
      color: "bg-green-100",
    },
    {
      title: "Exámenes de Evaluación",
      description:
        "Pruebas técnicas y de personalidad para agilizar el proceso de selección.",
      icon: "/icons/exam.svg",
      color: "bg-yellow-100",
    },
  ];



  return (
    <div className="bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cómo funciona ProMatch
            </h1>
            <p className="text-xl text-blue-200">
              Revolucionamos la búsqueda de empleo con tecnología inteligente
              que conecta talento con oportunidades
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission and Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <Image
                src="/equipotrabajando.svg"
                alt="Equipo trabajando"
                width={600}
                height={400}
                className="rounded-xl shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Nuestra Misión y Visión
              </h2>

              <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Misión
                </h3>
                <p className="text-gray-700">
                  Transformar el mercado laboral mediante tecnología inteligente
                  que elimine barreras entre talento y oportunidades, haciendo
                  el proceso más eficiente, justo y humano.
                </p>
              </div>

              <div className="p-6 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                  Visión
                </h3>
                <p className="text-gray-700">
                  Ser la plataforma líder en conexión laboral inteligente en
                  Latinoamérica, reconocida por nuestra innovación y por crear
                  matches laborales de alta calidad que benefician tanto a
                  candidatos como a empresas.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Nuestro Enfoque Innovador
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combinamos tecnología avanzada con entendimiento humano para
              revolucionar la búsqueda de empleo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div
                  className={`${feature.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6`}
                >
                  <Image
                    src="/profile.svg"
                    alt={feature.title}
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CV Analyzer Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Analizador de CV con IA
              </h2>
              <p className="text-gray-600 mb-6">
                Nuestra inteligencia artificial examina tu currículum y
                proporciona recomendaciones específicas para mejorarlo,
                aumentando tus posibilidades de ser seleccionado.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-full mr-4">
                    <Image
                      src="/check.svg"
                      alt="Check"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Optimización de palabras clave
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Identificamos las palabras clave que los reclutadores
                      buscan en tu industria.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-full mr-4">
                    <Image
                      src="/check.svg"
                      alt="Check"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Estructura y formato
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Te sugerimos mejoras en la organización y presentación de
                      tu información.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-full mr-4">
                    <Image
                      src="/check.svg"
                      alt="Check"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Brechas de habilidades
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Te indicamos qué habilidades podrías desarrollar para
                      aumentar tu empleabilidad.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <Image
                src="/cv-analyzer.svg"
                alt="Analizador de CV con IA"
                width={600}
                height={400}
                className="rounded-xl shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Assessment Tests Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2 order-2 lg:order-1"
            >
              <Image
                src="/tests.svg"
                alt="Exámenes de evaluación"
                width={600}
                height={400}
                className="rounded-xl shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2 order-1 lg:order-2"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Exámenes de Evaluación
              </h2>
              <p className="text-gray-600 mb-6">
                Nuestras pruebas técnicas y de personalidad ayudan a las
                empresas a conocerte mejor y agilizan el proceso de selección.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Pruebas técnicas
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Evalúan tus habilidades específicas para el puesto.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Test de personalidad
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Identifican tu fit cultural con las empresas.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Ejercicios prácticos
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Simulan situaciones reales del trabajo.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Evaluación de inglés
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Miden tu nivel de dominio del idioma.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <svg
                  className="w-8 h-8 text-white mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white text-2xl font-bold">ProMatch</span>
              </div>
              <p className="mb-4">
                La plataforma más avanzada para conectar talento con
                oportunidades usando inteligencia artificial.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin", "instagram"].map(
                  (social) => (
                    <motion.div key={social} whileHover={{ y: -3 }}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <span className="sr-only">{social}</span>
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <use xlinkHref={`/social-icons.svg#${social}`} />
                        </svg>
                      </Link>
                    </motion.div>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">
                Para candidatos
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Buscar empleo", path: "/jobs" },
                  { name: "Optimizar CV", path: "/cv-optimizer" },
                  { name: "Preparación entrevistas", path: "/interview-prep" },
                  { name: "Cursos", path: "/courses" },
                  { name: "Preguntas frecuentes", path: "/faq" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className="hover:text-white transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">
                Para empresas
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Publicar vacante", path: "/post-job" },
                  { name: "Buscar candidatos", path: "/find-candidates" },
                  { name: "Soluciones empresariales", path: "/enterprise" },
                  { name: "Precios", path: "/pricing" },
                  { name: "Recursos", path: "/resources" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className="hover:text-white transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Compañía</h4>
              <ul className="space-y-3">
                {[
                  { name: "Nosotros", path: "/about" },
                  { name: "Blog", path: "/blog" },
                  { name: "Carreras", path: "/careers" },
                  { name: "Contacto", path: "/contact" },
                  { name: "Socios", path: "/partners" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className="hover:text-white transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-sm">
              ©️ {new Date().getFullYear()} ProMatch. Todos los derechos
              reservados.
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacidad
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Términos
              </Link>
              <Link
                href="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookies
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-white transition-colors"
              >
                Mapa del sitio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}