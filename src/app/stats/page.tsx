"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect} from "react";
import { motion } from "framer-motion";

import TimeStats, { TimeStat } from "@/components/stats1/TimeStats";
import PopularJobsFromAPI from "@/components/stats1/PopularEngineeringTopicsCarousel";

export default function JobStatsDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const timeStats: TimeStat[] = [
    { value: "100 hrs", label: "Tiempo promedio en Reclutamiento" },
    { value: "300 hrs", label: "Tiempo buscando empleados" },
    { value: "240 hrs", label: "Tiempo buscando trabajo por semana" },
    { value: "8 hrs", label: "Tiempo en exámenes en la página" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero principal */}
      <section className="relative h-[60vh] flex items-center justify-center bg-black">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Explora temas de <span className="text-blue-300"> Ingeniería </span>
          </motion.h1>
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

      {/* Estadísticas y contenido solo para usuarios autenticados */}
      {user && (
        <section className="bg-gray-50 text-black">
          <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <PopularJobsFromAPI />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <TimeStats stats={timeStats} />
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}