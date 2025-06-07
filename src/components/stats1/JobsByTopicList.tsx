"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Job {
  title: string;
  description: string;
  location: {
    display_name: string;
  };
  company: {
    display_name: string;
  };
  redirect_url: string;
}

export default function JobsByTopicList() {
  const { topic } = useParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!topic) return;

    const fetchJobs = async () => {
      try {
        const response = await axios.get("https://api.adzuna.com/v1/api/jobs/mx/search/1", {
          params: {
            app_id: "3968952a",
            app_key: "83b545b20f4d6819d1b3d3553668b312",
            what: topic,
            category: "engineering-jobs",
            location0: "Mexico",
            location1: "Ciudad de México",
            results_per_page: 12,
          },
        });

        setJobs(response.data.results || []);
      } catch (err) {
        console.error("❌ Error al obtener empleos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [topic]);

  if (loading) return <p className="text-center p-6">Cargando empleos de {topic}...</p>;
  if (error) return <p className="text-center text-red-600">Error al cargar los empleos.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold capitalize text-gray-600">
          Empleos para {topic}
        </h1>
        <button
          onClick={() => router.push(`/stats/details/${encodeURIComponent(String(topic))}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition"
        >
          Ver estadísticas 📊
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No se encontraron resultados.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {jobs.map((job, index) => (
            <div key={index} className="border p-4 rounded shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-600">{job.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Empresa:</strong> {job.company.display_name} <br />
                <strong>Ubicación:</strong> {job.location.display_name}
              </p>
              <a
                href={job.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Ver oferta →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
