import { ScrollArea } from "@/components/ui/scroll-area";
import { CardAnalizarCV } from "./card_analizarCV";

const empresas = [
  {
    logoUrl: "https://logo.clearbit.com/amazon.com",
    empresa: "Amazon",
    puesto: "Software Developer Jr.",
    coincidencias: 5,
    link: "/examen",
  },
  {
    logoUrl: "https://logo.clearbit.com/meta.com",
    empresa: "Meta",
    puesto: "Front end Developer",
    coincidencias: 3,
    link: "/examen",
  },
  {
    logoUrl: "https://logo.clearbit.com/apple.com",
    empresa: "Apple",
    puesto: "iOS Developer",
    coincidencias: 2,
    link: "/examen",
  },
  {
    logoUrl: "https://logo.clearbit.com/google.com",
    empresa: "Google",
    puesto: "Backend Developer",
    coincidencias: 4,
    link: "/examen",
  },
  {
    logoUrl: "https://logo.clearbit.com/netflix.com",
    empresa: "Netflix",
    puesto: "Full Stack Engineer",
    coincidencias: 3,
    link: "/examen",
  },
  {
    logoUrl: "https://logo.clearbit.com/airbnb.com",
    empresa: "Airbnb",
    puesto: "UI/UX Designer",
    coincidencias: 2,
    link: "/examen",
  },
];

export function ScrollCardsAnalizarCV() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Empresas Donde Puedes Ser Contratado
        </h2>
        <p className="text-gray-500 text-sm">{empresas.length} Resultados</p>
      </div>
      <ScrollArea className="h-[460px] pr-2">
        <div className="space-y-4">
          {empresas.map((empresa, i) => (
            <CardAnalizarCV key={i} {...empresa} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
