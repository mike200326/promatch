"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const APP_ID = "3968952a";
const APP_KEY = "83b545b20f4d6819d1b3d3553668b312";
const BASE_URL = "https://api.adzuna.com/v1/api/jobs";

interface Job {
  title: string;
  location: { display_name: string };
  category: { label: string };
  redirect_url: string;
}

export default function CompanyTopicsPage() {
  const { company } = useParams();
  const router = useRouter();
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/mx/search/1`, {
          params: {
            app_id: APP_ID,
            app_key: APP_KEY,
            company: company,
            what: "developer",
            location0: "Mexico",
            location1: "Ciudad de México",
            results_per_page: 10,
          },
        });

        const results = response.data.results;
        if (results.length === 0) {
          setNotFound(true);
        } else {
          setJobs(results);
        }
      } catch (err) {
        console.error("❌ Error al obtener empleos:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [company]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Cargando empleos de {company}...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-6 text-center text-gray-600">
        No se encontraron resultados en México para la empresa <strong>{company}</strong>.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-blue-600 text-center">
        Trabajos en {company}
      </h1>
      <p className="text-center text-gray-700">
        Vacantes publicadas en México relacionadas con <strong>{company}</strong>.
      </p>

      <div className="relative">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent>
            {jobs.map((job, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-lg transition-shadow h-full flex flex-col justify-between"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Ubicación: {job.location.display_name}<br />
                    Categoría: {job.category.label}
                  </p>
                  <a
                    href={job.redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium self-start"
                  >
                    Ver oferta →
                  </a>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -ml-10 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 -mr-10 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50" />
        </Carousel>
      </div>

      <div className="text-center">
        <button
          onClick={() =>
            router.push(`/stats/details/${encodeURIComponent(company as string)}`)
          }
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Ver Gráfica Salarial →
        </button>
      </div>
    </div>
  );
}
