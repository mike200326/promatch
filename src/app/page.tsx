"use client";

import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@/context/AuthContext"; 



export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { user, authLoading } = useAuth();



  const testimonials = [
    {
      id: 1,
      name: "Ana Martínez",
      role: "Diseñadora UX",
      content:
        "Gracias a ProMatch encontré mi trabajo ideal en solo 2 semanas. Su sistema de matching es increíblemente preciso.",
      avatar: "/avatar1.png",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Desarrollador Full Stack",
      content:
        "El analizador de CV me ayudó a mejorar mi currículum y recibí un 60% más de respuestas de reclutadores.",
      avatar: "/avatar2.png",
    },
    {
      id: 3,
      name: "Laura González",
      role: "Gerente de Marketing",
      content:
        "Contratamos a 3 excelentes profesionales a través de ProMatch. La calidad de los candidatos es excepcional.",
      avatar: "/avatar3.png",
    },
  ];

  const stats = [
    {
      value: "85%",
      label: "de usuarios encuentran trabajo en menos de 3 meses",
    },
    { value: "10K+", label: "empresas confían en nuestra plataforma" },
    { value: "3x", label: "más entrevistas con nuestro optimizador de CV" },
    { value: "24h", label: "tiempo promedio para el primer contacto" },
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [ref3, inView3] = useInView();
  


  useEffect(() => {
    if (inView || inView3) controls.start("visible");
  }, [controls, inView, inView3]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);



  return (
    <>
      <Head>
        <title>ProMatch - Encuentra tu trabajo ideal con IA</title>
        <meta
          name="description"
          content="La plataforma más avanzada para conectar talento con oportunidades laborales usando inteligencia artificial"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://promatch.com" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
      </Head>

      {/* Cuerpo principal mejorado */}
      <main className="min-h-screen bg-gray-50 overflow-hidden">
        {/* Sección hero con video de fondo y efecto parallax */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Transformamos tu <span className="text-blue-300">búsqueda</span>{" "}
              de empleo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white mb-10 max-w-2xl mx-auto"
            >
              La plataforma más inteligente que conecta tu talento con las
              mejores oportunidades usando IA avanzada
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* ruta condicional */}
                <Link
  href={user ? "/cv" : "/register"}
  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 font-medium text-lg shadow-xl transition-all"
>
  {authLoading ? "Cargando..." : user ? "Analiza tu CV" : "Empieza ahora"}
</Link>

              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/how"
                  className="px-8 py-4 bg-white text-gray-800 rounded-full hover:bg-gray-100 font-medium text-lg shadow-xl transition-all"
                >
                  Cómo funciona
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          >
            <svg
              className="w-8 h-8 text-white animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </section>

        {/* Sección de estadísticas con animación */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              ref={ref}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 },
              }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Resultados que hablan por sí solos
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Miles de profesionales y empresas ya confían en nuestra
                plataforma
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-3">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección "Qué es ProMatch" con efecto parallax */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-blue-900 opacity-90 z-0"></div>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-cover opacity-10 z-0"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div
                className="lg:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <Image
                    src="/team.svg"
                    alt="Equipo trabajando"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-2xl"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                    <div className="text-3xl font-bold text-blue-600">+50K</div>
                    <div className="text-gray-600 text-sm">
                      Candidatos activos
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="lg:w-1/2 text-white"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  ¿Qué es ProMatch?
                </h2>
                <p className="text-xl mb-6">
                  ProMatch es la{" "}
                  <span className="font-semibold text-blue-300">
                    revolución en la búsqueda de empleo
                  </span>
                  , combinando inteligencia artificial con un profundo
                  entendimiento del mercado laboral.
                </p>
                <p className="mb-8">
                  Nuestra plataforma no solo conecta candidatos con empleos,
                  sino que analiza tu perfil completo, tus habilidades,
                  aspiraciones y personalidad para encontrar coincidencias que
                  realmente importan.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      href="/"
                      className="px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      Ver características
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      href="/"
                      className="px-6 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      Ver demostración
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sección de video "Mejoramos tu futuro" */}
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Transformamos tu futuro
              </h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Descubre cómo nuestra tecnología está revolucionando la forma en
                que las personas encuentran trabajo
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-2xl max-w-6xl mx-auto"
            >
              <div className="aspect-w-16 aspect-h-9">
                <video
                  controls
                  className="w-full h-full object-cover relative z-10"
                >
                  <source src="/team.mp4" type="video/mp4" />
                  Tu navegador no soporta videos HTML5.
                </video>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl transition-colors">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sección de testimonios con animación */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              ref={ref3}
              initial="hidden"
              animate={inView3 ? "visible" : "hidden"}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 },
              }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Lo que dicen nuestros usuarios
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Historias reales de personas que transformaron sus carreras
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto relative h-96">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonials[currentTestimonial].id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
                >
                  <div className="mb-6">
                    <Image
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-blue-100"
                    />
                  </div>
                  <blockquote className="text-xl text-gray-700 mb-6">
                    {testimonials[currentTestimonial].content}
                  </blockquote>
                  <div>
                    <div className="font-bold text-gray-800">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-blue-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentTestimonial === index
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sección CTA final */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              ¿Listo para transformar tu carrera?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl mb-10 max-w-2xl mx-auto"
            >
              Únete a miles de profesionales que ya están avanzando en sus
              carreras con ProMatch
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="block px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-gray-100 font-medium text-lg shadow-xl transition-all"
                >
                  Crear cuenta gratis
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="block px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-blue-600 font-medium text-lg transition-all"
                >
                  Hablar con un experto
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer mejorado */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div>
              <div className="mb-6">
                <Image
                  src="/promatch1.png"
                  alt="ProMatch Logo"
                  width={160}
                  height={60}
                  className="h-10 w-auto"
                />
              </div>
              <p className="mb-4">
                La plataforma más avanzada para conectar talento con
                oportunidades usando inteligencia artificial.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin", "instagram"].map(
                  (social) => (
                    <Link
                      key={social}
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
                  { name: "Buscar empleo", path: "/" },
                  { name: "Optimizar CV", path: "/" },
                  { name: "Preparación entrevistas", path: "/" },
                  { name: "Cursos", path: "/" },
                  { name: "Preguntas frecuentes", path: "/" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className="hover:text-white transition-colors"
                    >
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
                  { name: "Publicar vacante", path: "/" },
                  { name: "Buscar candidatos", path: "/" },
                  { name: "Soluciones empresariales", path: "/" },
                  { name: "Precios", path: "/" },
                  { name: "Recursos", path: "/" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className="hover:text-white transition-colors"
                    >
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
                  { name: "Nosotros", path: "/" },
                  { name: "Blog", path: "/" },
                  { name: "Carreras", path: "/" },
                  { name: "Contacto", path: "/" },
                  { name: "Socios", path: "/" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className="hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">
                Descarga nuestra app
              </h4>
              <div className="space-y-4">
                <Link
                  href="#"
                  className="flex items-center bg-black bg-opacity-30 p-3 rounded-lg hover:bg-opacity-50 transition-colors"
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <use xlinkHref="/app-icons.svg#apple" />
                  </svg>
                  <div>
                    <div className="text-xs">Descargar en la</div>
                    <div className="font-medium">App Store</div>
                  </div>
                </Link>
                <Link
                  href="#"
                  className="flex items-center bg-black bg-opacity-30 p-3 rounded-lg hover:bg-opacity-50 transition-colors"
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <use xlinkHref="/app-icons.svg#google-play" />
                  </svg>
                  <div>
                    <div className="text-xs">Disponible en</div>
                    <div className="font-medium">Google Play</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-sm">
              ©️ {new Date().getFullYear()} ProMatch. Todos los derechos
              reservados.
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/" className="hover:text-white transition-colors">
                Aviso de privacidad
              </Link>
              <Link href="/" className="hover:text-white transition-colors">
                Términos y condiciones
              </Link>
              <Link href="/" className="hover:text-white transition-colors">
                Política de cookies
              </Link>
              <Link href="/" className="hover:text-white transition-colors">
                Mapa del sitio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}