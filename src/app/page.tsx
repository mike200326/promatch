"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const teamVideoRef = useRef<HTMLVideoElement>(null);

  // Parallax transforms (scaled down for less dramatic effect)
  const yPosAnim = useTransform(scrollYProgress, [0, 1], [0, -300]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.play();
    }
    if (teamVideoRef.current) {
      teamVideoRef.current.play();
    }
  }, []);

  useEffect(() => {
    const checkLogin = () => {
      const storedUserId = sessionStorage.getItem("userId");
      setIsLoggedIn(!!storedUserId);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Ana Martínez",
      role: "Diseñadora UX",
      content: "Gracias a ProMatch encontré mi trabajo ideal en solo 2 semanas. Su sistema de matching es increíblemente preciso.",
      avatar: "/avatar1.png",
      company: "Google"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Desarrollador Full Stack",
      content: "El analizador de CV me ayudó a mejorar mi currículum y recibí un 60% más de respuestas de reclutadores.",
      avatar: "/avatar2.png",
      company: "Microsoft"
    },
    {
      id: 3,
      name: "Laura González",
      role: "Gerente de Marketing",
      content: "Contratamos a 3 excelentes profesionales a través de ProMatch. La calidad de los candidatos es excepcional.",
      avatar: "/avatar3.png",
      company: "Meta"
    },
  ];

  const stats = [
    { value: "85%", label: "de usuarios encuentran trabajo en menos de 3 meses", icon: "🚀" },
    { value: "10K+", label: "empresas confían en nuestra plataforma", icon: "🏢" },
    { value: "3x", label: "más entrevistas con nuestro optimizador de CV", icon: "📈" },
    { value: "24h", label: "tiempo promedio para el primer contacto", icon: "⚡" },
  ];

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.01, 0.05, 0.95]
      }
    }
  };

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Cursor follower - Reduced size */}
      <motion.div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-50 mix-blend-multiply opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(0,0,0,0.3) 0%, transparent 70%)",
          x: mousePosition.x - 128,
          y: mousePosition.y - 128,
        }}
        animate={{
          x: mousePosition.x - 128,
          y: mousePosition.y - 128
        }}
        transition={{ type: "spring", damping: 25, stiffness: 150 }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center bg-white overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-64 h-64 bg-gray-100 rounded-full filter blur-[80px] opacity-30"
            animate={floatingAnimation}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-80 h-80 bg-gray-200 rounded-full filter blur-[100px] opacity-20"
            animate={{
              ...floatingAnimation,
              transition: { ...floatingAnimation.transition, delay: 0.8 }
            }}
          />
        </div>

        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: yPosAnim }}
        >
          <div className="relative w-full h-full" style={{ perspective: "800px" }}>
            <motion.div
              className="w-full h-full"
              style={{ 
                transformStyle: "preserve-3d",
                transform: `rotateY(${mousePosition.x * 0.008}deg) rotateX(${-mousePosition.y * 0.008}deg)`
              }}
            >
              <video
                ref={heroVideoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-70"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
        </motion.div>
        
        <motion.div
          ref={heroRef}
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-full px-6 py-3 mb-8 shadow-md"
              animate={{
                boxShadow: [
                  "0 0 15px rgba(0,0,0,0.05)",
                  "0 0 30px rgba(0,0,0,0.1)",
                  "0 0 15px rgba(0,0,0,0.05)"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <motion.div 
                className="w-2 h-2 bg-gray-900 rounded-full"
                animate={{
                  scale: [1, 1.4, 1],
                }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="text-gray-800 font-bold text-base">
                Plataforma líder en búsqueda de empleo con IA
              </span>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[0.9]"
          >
            <motion.span className="block text-gray-900">
              Transformamos
            </motion.span>
            <motion.span 
              className="block text-gray-900 mt-3"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              tu búsqueda
            </motion.span>
            <motion.span 
              className="block text-3xl md:text-4xl lg:text-5xl mt-3 font-light text-gray-600"
              style={{ letterSpacing: "0.08em" }}
            >
              de empleo
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            La plataforma más inteligente que conecta tu talento con las mejores oportunidades 
            usando{" "}
            <motion.span className="font-bold text-gray-900">
              inteligencia artificial avanzada
            </motion.span>
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-md overflow-hidden"
            >
              <span className="relative flex items-center gap-2">
                {isLoggedIn ? "Análisis CV" : "Empieza ahora"}
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                borderColor: "rgb(0,0,0)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-white/90 backdrop-blur-xl text-gray-900 rounded-2xl font-bold text-lg border-2 border-gray-200 shadow-md"
            >
              <span className="relative">Cómo funciona</span>
            </motion.button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center gap-8 text-base"
          >
            {["Gratis para empezar", "Sin compromiso", "Resultados garantizados"].map((text, index) => (
              <motion.div 
                key={text}
                className="flex items-center gap-2"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              >
                <motion.div 
                  className="w-4 h-4 bg-gray-900 rounded-full shadow"
                />
                <span className="text-gray-600 font-medium">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-12 border-2 border-gray-400 rounded-full flex justify-center backdrop-blur-sm"
          >
            <motion.div
              animate={{ 
                y: [0, 16, 0],
                opacity: [1, 0.3, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 bg-gray-900 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,0,0,0.03) 0%, transparent 50%)",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={statsRef}
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900"
            >
              Resultados épicos
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Miles de profesionales ya transformaron sus vidas
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ 
                  y: -15,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 250 }
                }}
                className="relative group"
              >
                <motion.div
                  className="bg-white p-8 rounded-2xl border border-gray-200 text-center relative overflow-hidden h-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, 8, -8, 0]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                  
                  <motion.div 
                    className="text-3xl md:text-4xl font-black mb-3 text-gray-900"
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className="text-gray-600 text-base leading-relaxed font-medium">{stat.label}</div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={featuresRef}
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <motion.h2 
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-black mb-6 text-gray-900"
                >
                  ¿Qué es{" "}
                  <span className="text-gray-900">
                    ProMatch
                  </span>
                  ?
                </motion.h2>
                <motion.p 
                  variants={itemVariants}
                  className="text-lg text-gray-600 leading-relaxed mb-6"
                >
                  ProMatch es la{" "}
                  <span className="font-bold text-gray-900">
                    revolución en la búsqueda de empleo
                  </span>
                  , combinando inteligencia artificial con un profundo entendimiento del mercado laboral.
                </motion.p>
                <motion.p 
                  variants={itemVariants}
                  className="text-base text-gray-500 leading-relaxed"
                >
                  Nuestra plataforma analiza tu perfil completo para encontrar coincidencias perfectas que transformarán tu carrera.
                </motion.p>
              </div>

              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-base shadow-md"
                >
                  Ver características
                </motion.button>
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: "rgb(0,0,0)",
                  }}
                  className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-base border-2 border-gray-200 shadow-md"
                >
                  Ver demostración
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 250 }
                }}
                className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 relative overflow-hidden"
              >
                <motion.div 
                  className="relative z-10 mb-8"
                  animate={floatingAnimation}
                >
                  <motion.img
                    src="/team.svg"
                    alt="Equipo trabajando"
                    className="w-full h-48 object-cover rounded-2xl shadow-md"
                    whileHover={{
                      scale: 1.03,
                    }}
                  />
                  <motion.div 
                    className="absolute -bottom-4 -right-4 bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-200 backdrop-blur-sm"
                  >
                    <div className="text-2xl font-black text-white">+50K</div>
                    <div className="text-white/80 text-xs font-medium">Candidatos activos</div>
                  </motion.div>
                </motion.div>
                
                <div className="relative z-10 text-center">
                  <motion.div 
                    className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-md"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-black text-gray-900 mb-4"
                  >
                    Matching Inteligente
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 text-base mb-8"
                  >
                    Conectamos tu perfil con las oportunidades perfectas usando IA avanzada
                  </motion.p>
                  
                  <motion.div
                    whileHover={{ 
                      y: -8,
                      scale: 1.05,
                    }}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-base font-bold text-gray-600">Match Score</span>
                      <motion.span 
                        className="text-3xl font-black text-gray-900"
                      >
                        97%
                      </motion.span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        className="h-full bg-gray-900 rounded-full relative"
                        initial={{ width: "0%" }}
                        animate={featuresInView ? { width: "97%" } : {}}
                        transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                  </div>
                </motion.div>
                
            </motion.div>
            
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900"
            >
              Transformamos tu futuro
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Descubre cómo nuestra tecnología está revolucionando carreras profesionales
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-lg max-w-5xl mx-auto"
          >
            <motion.div
              className="relative"
              whileHover={{
                scale: 1.01,
                transition: { type: "spring", stiffness: 250 }
              }}
            >
              <div className="aspect-video relative rounded-2xl overflow-hidden">
                <video
                  ref={teamVideoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/team.mp4" type="video/mp4" />
                </video>
                
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={testimonialsRef}
            variants={containerVariants}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900"
            >
              Historias de éxito
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Personas reales que transformaron sus carreras con ProMatch
            </motion.p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonials[currentTestimonial].id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white p-12 rounded-2xl shadow-md border border-gray-200 relative overflow-hidden"
                >
                  <div className="text-center relative z-10">
                    <motion.div 
                      className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-8 border-3 border-gray-200 shadow-md"
                    >
                      <img
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    <motion.div className="flex justify-center mb-8 gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <motion.svg
                          key={i}
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ delay: 0.08 + i * 0.08, type: "spring", stiffness: 180 }}
                          className="w-8 h-8 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                    </motion.div>

                    <motion.blockquote 
                      className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed italic font-light"
                    >
                      &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                    </motion.blockquote>

                    <div>
                      <motion.div 
                        className="font-black text-2xl text-gray-900 mb-2"
                      >
                        {testimonials[currentTestimonial].name}
                      </motion.div>
                      <motion.div 
                        className="text-gray-700 font-bold text-lg mb-2"
                      >
                        {testimonials[currentTestimonial].role}
                      </motion.div>
                      <motion.div 
                        className="text-gray-500 text-base flex items-center justify-center gap-2"
                      >
                        <span>en</span>
                        <span className="font-bold text-gray-900">
                          {testimonials[currentTestimonial].company}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`rounded-full transition-all duration-300 ${
                    currentTestimonial === index 
                      ? "bg-gray-900 w-12 h-3" 
                      : "bg-gray-300 w-3 h-3"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white"
            >
              ¿Listo para el cambio?
            </motion.h2>

            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Únete a miles de profesionales que ya están viviendo el futuro del empleo
            </motion.p>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-6 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-md overflow-hidden"
              >
                Crear cuenta gratis
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-transparent text-white rounded-2xl font-bold text-lg border-2 border-white/20 shadow-md"
              >
                Hablar con un experto
              </motion.button>
            </div>

            <motion.div 
              className="flex justify-center items-center gap-8 flex-wrap text-base"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                { text: "Sin tarjeta de crédito", icon: "💳" },
                { text: "Configuración en 2 minutos", icon: "⚡" },
                { text: "Soporte 24/7", icon: "🌟" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-white"
                  whileHover={{
                    scale: 1.05,
                  }}
                >
                  <motion.span
                    className="text-2xl"
                    animate={{
                      rotate: [0, 8, -8, 0],
                      scale: [1, 1.15, 1]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {feature.icon}
                  </motion.span>
                  <span className="font-bold">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 pt-24 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Logo Section */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <img
                  src="/promatch1.png"
                  alt="ProMatch Logo"
                  className="h-42 w-auto mb-3"
                />
                <div className="w-16 h-1 bg-white rounded-full" />
              </div>
              <p className="mb-8 text-gray-400 text-base leading-relaxed">
                La plataforma más avanzada para conectar talento con oportunidades usando inteligencia artificial de última generación.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: "Facebook", bg: "bg-blue-600" },
                  { name: "Twitter", bg: "bg-sky-500" },
                  { name: "LinkedIn", bg: "bg-blue-700" },
                  { name: "Instagram", bg: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href="#"
                    whileHover={{ 
                      y: -8,
                      scale: 1.1,
                    }}
                    className={`w-12 h-12 ${social.bg} rounded-2xl flex items-center justify-center text-white shadow-md`}
                  >
                    {social.name[0]}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Navigation Sections */}
            {[
              {
                title: "Para candidatos",
                items: ["Buscar empleo", "Optimizar CV", "Preparación entrevistas", "Cursos", "Preguntas frecuentes"],
              },
              {
                title: "Para empresas", 
                items: ["Publicar vacante", "Buscar candidatos", "Soluciones empresariales", "Precios", "Recursos"],
              },
              {
                title: "Compañía",
                items: ["Nosotros", "Blog", "Carreras", "Contacto", "Socios"],
              }
            ].map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * sectionIndex }}
                viewport={{ once: true }}
              >
                <h4 className="text-white font-black text-lg mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * itemIndex }}
                      viewport={{ once: true }}
                    >
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-all duration-300 relative group text-base font-medium"
                      >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* App Download Section */}
          <div className="mb-16 text-center">
            <h4 className="text-white font-black text-2xl mb-8">
              Descarga nuestra app
            </h4>
            <div className="flex justify-center gap-6 flex-wrap">
              {[
                { 
                  name: "App Store", 
                  subtitle: "Descargar en la", 
                  bgColor: "bg-gray-800",
                  icon: "🍎",
                },
                { 
                  name: "Google Play", 
                  subtitle: "Disponible en", 
                  bgColor: "bg-gray-800",
                  icon: "▶️",
                }
              ].map((store) => (
                <motion.a
                  key={store.name}
                  href="#"
                  whileHover={{ 
                    y: -8,
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center ${store.bgColor} text-white p-4 rounded-2xl transition-all duration-300 min-w-[200px] relative overflow-hidden`}
                >
                  <div className="text-3xl mr-4">
                    {store.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-xs opacity-90">{store.subtitle}</div>
                    <div className="font-bold text-lg">{store.name}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-base text-gray-400 text-center lg:text-left">
              © {new Date().getFullYear()} ProMatch. Todos los derechos reservados.
              <span className="text-white ml-2 font-bold">
                Transformando carreras con IA.
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-base">
              {["Aviso de privacidad", "Términos", "Cookies", "Mapa del sitio"].map((link, index) => (
                <motion.a
                  key={link}
                  href="#"
                  className="text-gray-400 hover:text-white transition-all duration-300 relative group font-medium"
                  whileHover={{ y: -3 }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  viewport={{ once: true }}
                >
                  {link}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
