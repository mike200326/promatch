import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface CardAnalizarCVProps {
  logoUrl: string;
  empresa: string;
  puesto: string;
  coincidencias: number;
  link: string; 
}

export function CardAnalizarCV({
  logoUrl,
  empresa,
  puesto,
  coincidencias,
  link,
}: CardAnalizarCVProps) {
  return (
    <Card className="p-4">
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Image
            src={logoUrl}
            alt={empresa}
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{empresa}</h3>
            <p className="text-sm text-gray-600">
              {puesto}
              <br />+{coincidencias} coincidencias
            </p>
          </div>
        </div>
        <Link
          href={link}
          className="bg-black text-white px-4 py-2 rounded-md font-medium transition-all duration-300 transform hover:bg-blue-600 hover:scale-105"
        >
          Hacer Examen
        </Link>
      </CardContent>
    </Card>
  );
}