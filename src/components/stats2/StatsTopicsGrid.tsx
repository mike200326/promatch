"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation"; // 👈 Importante
import Image from "next/image";

interface TopicCard {
  title: string;
  description: string;
  image: string;
}

const topics: TopicCard[] = [
  {
    title: "Programadores Jr. en Amazon",
    description: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "/topics/programadores-jr.png",
  },
  {
    title: "¿Cuántos Programadores Mexicanos hay en Amazon?",
    description: "Body text for whatever you’d like to say. Add main takeaway points, quotes.",
    image: "/topics/programadores-mexicanos.png",
  },
  {
    title: "Lenguajes más usados en Amazon México",
    description: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "/topics/lenguajes.png",
  },
  {
    title: "Principales proyectos de Amazon México",
    description: "Body text for whatever you’d like to say. Add main takeaway points, quotes.",
    image: "/topics/proyectos.png",
  },
  {
    title: "Trabajo remoto para programadores en Amazon",
    description: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "/topics/remoto.png",
  },
  {
    title: "Salario de un programador en Amazon México",
    description: "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "/topics/salario.png",
  },
];

export function StatsTopicsGrid() {
  const router = useRouter(); 

  return (
    <section className="w-full py-10 px-6">
      <h2 className="text-3xl font-bold text-center mb-2">Estadísticas de “Amazon”</h2>
      <p className="text-center text-gray-500 mb-8">Acerca de Amazon · Estadísticas Más Buscadas</p>

      <ScrollArea className="h-full w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {topics.map((topic, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => router.push("/stats/details")} 
            >
              <CardContent className="p-4">
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={topic.image}
                    alt={topic.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{topic.title}</h3>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
