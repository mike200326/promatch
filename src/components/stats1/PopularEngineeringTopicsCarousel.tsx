"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Temas predefinidos de ingeniería
const topics = [
  { title: "Developer", icon: "💻", description: "Vacantes de desarrollo" },
  { title: "Tester", icon: "🧪", description: "Control de calidad y pruebas" },
  { title: "QA", icon: "🔍", description: "Analistas de calidad" },
  { title: "DevOps", icon: "⚙️", description: "Automatización e infraestructura" },
  { title: "Data Engineer", icon: "📊", description: "Procesamiento de datos" },
  { title: "Backend", icon: "🖥️", description: "Desarrollo del lado del servidor" },
  { title: "Frontend", icon: "🎨", description: "Interfaz de usuario" },
];

export default function PopularEngineeringTopicsCarousel() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const router = useRouter();

  return (
    <section className="bg-white p-6 rounded-lg shadow mb-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6"
      >
        Explora temas de <span className="text-blue-400">Ingeniería</span>
      </motion.h1>

      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[plugin.current]}
        className="w-full relative"
      >
        <CarouselContent className="-ml-4">
          {topics.map((topic, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl mb-3">{topic.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600">{topic.description}</p>
                </div>
                <button
                  onClick={() =>
                    router.push(`/stats/topics/${encodeURIComponent(topic.title.toLowerCase())}`)
                  }
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium self-start"
                >
                  Ver empleos →
                </button>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -ml-8 bg-white border shadow-md hover:bg-gray-100" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 -mr-8 bg-white border shadow-md hover:bg-gray-100" />
      </Carousel>
    </section>
  );
}
