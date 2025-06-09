"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

interface HistogramBar {
  range: string;
  count: number;
}

interface Props {
  topic: string;
}

const queryMap: Record<string, string> = {
  qa: "quality assurance",
  tester: "qa engineer",
  developer: "developer",
  devops: "devops engineer",
  backend: "backend developer",
  frontend: "frontend developer",
  "data engineer": "data engineer",
};

const APP_ID = "3968952a";
const APP_KEY = "83b545b20f4d6819d1b3d3553668b312";
const BASE_URL = "https://api.adzuna.com/v1/api/jobs";
const COUNTRIES = ["mx", "us", "uk", "ca"];

export default function CategorySalaryHistogramChart({ topic }: Props) {
  const [data, setData] = useState<HistogramBar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(false);
  const [sourceCountry, setSourceCountry] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistogram = async () => {
      const mappedQuery = queryMap[topic.toLowerCase()] || topic;

      for (const country of COUNTRIES) {
        try {
          const response = await axios.get(`${BASE_URL}/${country}/histogram`, {
            params: {
              app_id: APP_ID,
              app_key: APP_KEY,
              what: mappedQuery,
              "content-type": "application/json",
            },
          });

          const histogram = response.data?.histogram || {};
          const formattedData: HistogramBar[] = Object.entries(histogram).map(
            ([range, count]) => ({
              range,
              count: Number(count),
            })
          );

          if (formattedData.length >= 3) {
            setData(formattedData);
            setSourceCountry(country);
            break;
          }
        } catch (err) {
          console.warn(`⚠️ Error al consultar en ${country}`, err);
        }
      }

      setLoading(false);
    };

    fetchHistogram();
  }, [topic]);

  if (loading) {
    return <p className="text-center p-6">Cargando histograma salarial para {topic}...</p>;
  }

  if (error || data.length === 0) {
    return (
      <p className="text-center text-red-600">
        No se encontraron datos salariales para <strong>{topic}</strong>.
      </p>
    );
  }

  const countryLabel: Record<string, string> = {
    mx: "México",
    us: "Estados Unidos",
    uk: "Reino Unido",
    ca: "Canadá",
  };

  return (
    <Card className="max-w-5xl mx-auto p-6 mt-8">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold capitalize">Histograma de salarios: {topic}</h2>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>

        <div className="text-sm text-gray-500 text-right mt-2">
          Fuente de datos: <strong>{countryLabel[sourceCountry ?? "mx"]}</strong>
          {sourceCountry !== "mx" && <> (por falta de datos en México)</>}
        </div>
      </CardContent>
    </Card>
  );
}
