"use client";

import React, { useRef } from "react";
import CVCard from "@/components/ComponentNineteen/CVCard";
import JobCarousel from "@/components/ComponentTwentyOne/JobCarousel";
import { motion, useInView } from "framer-motion";

export default function KatiaPreviewPage() {
  const cvRef = useRef(null);
  const jobRef = useRef(null);
  const isCVInView = useInView(cvRef, { once: true });
  const isJobInView = useInView(jobRef, { once: true });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner oscuro superior */}
      <section className="relative h-[50vh] flex items-center justify-center bg-black px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white leading-tight text-center"
        >
          Analiza tu <span className="text-blue-300">CV</span> y Exámenes
        </motion.h1>
      </section>

      {/* Contenido animado al entrar en pantalla */}
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start max-w-7xl mx-auto px-6 py-10">
        {/* CVCard (1/3) */}
        <motion.div
          ref={cvRef}
          initial={{ opacity: 0, x: -30 }}
          animate={isCVInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-1/3"
        >
          <CVCard />
        </motion.div>

        {/* Carrusel de Vacantes (2/3) */}
        <motion.div
          ref={jobRef}
          initial={{ opacity: 0, x: 30 }}
          animate={isJobInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-2/3"
        >
          <JobCarousel />
        </motion.div>
      </div>
    </main>
  );
}