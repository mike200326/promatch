"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

interface HistoryDataPoint {
  month: string;
  count: number;
}

interface Props {
  topic: string;
}

// Mapeo de términos amigables a keywords válidos de Adzuna
const queryMap: Record<string, string> = {
  qa: "quality assurance",
  tester: "software tester",
  developer: "developer",
  devops: "devops engineer",
  backend: "backend developer",
  frontend: "frontend developer",
  "data engineer": "data engineer",
};

export default function CategoryStatsChart({ topic }: Props) {
  const [data, setData] = useState<HistoryDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

useEffect(() => {
  const fetchStats = async () => {
    const mappedQuery = queryMap[topic.toLowerCase()] || topic;

    try {
      const response = await axios.get("https://api.adzuna.com/v1/api/jobs/mx/history", {
        params: {
          app_id: "3968952a",
          app_key: "83b545b20f4d6819d1b3d3553668b312",
          what: mappedQuery,
        },
      });

      const history = response.data?.results || [];

      // Definir tipo para cada entry
      interface HistoryEntry {
        month: string;
        count: number;
      }

      const formatted = history.map((entry: HistoryEntry) => ({
        month: entry.month,
        count: entry.count,
      }));

      setData(formatted);
    } catch (err) {
      console.error("❌ Error al obtener datos históricos de Adzuna:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, [topic]);


  if (loading) {
    return <p className="text-center p-6">Cargando estadísticas de {topic}...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error al cargar los datos de Adzuna.</p>;
  }

  return (
    <Card className="max-w-4xl mx-auto p-6 mt-8">
      <CardContent>
        <h2 className="text-xl font-bold mb-4 capitalize">
          Tendencia mensual de empleos: {topic}
        </h2>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">
            No se encontraron datos históricos para <strong>{topic}</strong>.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
