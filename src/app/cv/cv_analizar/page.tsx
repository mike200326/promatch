"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState,useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ClusterItem = {
  userId: number;
  cluster: number;
  recommendation: string;
  razon: string;
};

const COLORS = [
  "#FF9B00",
  "#1A56DB",
  "#111827",
  "#00B86B",
  "#E50914",
  "#FF5A5F",
];

type PositionItem = [string, number]

type ChartDataItem = {
  name: string;
  value: number;
  color: string;
};  


export default function DashboardPage() {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();
const chartRef = useRef<HTMLDivElement>(null);

  const [cvFile, setCvFile] = useState<File | null>(null);

  //const [chartData, setChartData] = useState<any[]>([]);
    //const [positions, setPositions] = useState<any[]>([]);

    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
const [positions, setPositions] = useState<PositionItem[]>([]);

  const [summary, setSummary] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendedCluster, setRecommendedCluster] =
    useState<ClusterItem | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Cargar análisis desde localStorage si existe
useEffect(() => {
  const saved = localStorage.getItem("cvAnalysis");
  if (saved) {
    const analysis = JSON.parse(saved);
    setSummary(analysis.summary || "");

    if (analysis.positions && typeof analysis.positions === "object") {
      // ChartDataItem[]
      const formatted = Object.entries(analysis.positions).map(
        ([name, value], index) => ({
          name,
          value: Number(value), // 👈 importante: casteamos a number
          color: COLORS[index % COLORS.length],
        })
      );

      setChartData(formatted);

      // PositionItem[]
      setPositions(
        Object.entries(analysis.positions).map(([name, value]) => [
          name,
          Number(value), // 👈 importante: casteamos a number
        ])
      );
    } else {
      // Si no hay positions válidas, limpiamos
      setChartData([]);
      setPositions([]);
    }
  }
}, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

const handleSubmit = async () => {
  if (!cvFile) return;

  setIsSubmitting(true);
  const formData = new FormData();
  formData.append("file", cvFile);
  const storedUserId = sessionStorage.getItem("userId");
  if (!storedUserId) {
    console.error("⛔ No se encontró user. Inicia sesión.");
    setIsSubmitting(false);
    return;
  }
  formData.append("userId", storedUserId);

  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No se pudo obtener el token.");
    }

    const res = await fetch(
      "https://back-complete-86430845382.us-central1.run.app/api/cv-analysis/analyze",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error en respuesta: ${res.status} - ${errorText}`);
    }

    const result = await res.json();
    console.log("📦 Respuesta completa del servidor:", result);

    if (result.success && result.analysis) {
      const response = result.analysis;
      setSummary(response.summary || "Sin resumen disponible.");
      localStorage.setItem("cvAnalysis", JSON.stringify(response)); // Guardar análisis

      if (response.positions && typeof response.positions === "object") {
        // ChartDataItem[]
        const formatted = Object.entries(response.positions).map(
          ([name, value], index) => ({
            name,
            value: Number(value), // 👈 IMPORTANTE
            color: COLORS[index % COLORS.length],
          })
        );

        setChartData(formatted);

        // PositionItem[]
        setPositions(
          Object.entries(response.positions).map(([name, value]) => [
            name,
            Number(value), // 👈 IMPORTANTE
          ])
        );
      } else {
        console.warn(
          "⚠️ No se encontró un objeto 'positions' válido en la respuesta."
        );
        setChartData([]);
        setPositions([]);
      }
    } else {
      console.error("Error de API:", result.error || "Respuesta sin éxito");
    }
  } catch (err) {
    console.error("Error al analizar el CV:", err);
  } finally {
    setIsSubmitting(false);
  }
};




  const handleDownloadPDF = async () => {
  if (!chartRef.current) {
    console.error("No se encontró el componente para capturar.");
    return;
  }

  try {
    const canvas = await html2canvas(chartRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = {
      width: canvas.width,
      height: canvas.height,
    };

    const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;

    const x = (pageWidth - imgWidth) / 2;
    const y = 20;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save("analisis_cv.pdf");
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  }
};


useEffect(() => {
  const fetchRecommendation = async () => {
    const storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      console.warn("No se encontró userId en sessionStorage");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No se pudo obtener el token.");
      }

      const res = await fetch("https://back-complete-86430845382.us-central1.run.app/api/predict/clusters", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error al obtener clusters: ${res.status}`);
      }

      const result = await res.json();
      console.log("Clusters recibidos:", result);

      if (result.success && Array.isArray(result.data)) {
        const userCluster = result.data.find(
          (item: ClusterItem) => item.userId === parseInt(storedUserId)
        );

        if (userCluster) {
          console.log("Recomendación para este user:", userCluster);
          setRecommendedCluster(userCluster);
        } else {
          console.warn("No se encontró cluster para este userId");
        }
      }
    } catch (err) {
      console.error("Error al obtener clusters:", err);
    }
  };

  if (!loading && user) {
    fetchRecommendation();
  }
}, [loading, user, getToken]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-10 px-4">
      <h1 className="text-5xl font-bold text-center text-gray-900 mb-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Analiza tu CV
        </motion.div>
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* IZQUIERDA: Gráfico de Pie */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
<Card
  ref={chartRef}
  style={{
    backgroundColor: "#ffffff", // fondo blanco en HEX
    color: "#1f2937", // equivalente a text-gray-800
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)", // shadow-lg
  }}
>
  <CardHeader>
    <CardTitle style={{ fontSize: "1.25rem", fontWeight: "600" }}>
      Oportunidades para ti
    </CardTitle>
  </CardHeader>

  <CardContent>
    {chartData.length > 0 ? (
      <>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div style={{ marginTop: "1rem" }}>
          <h2 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
            Resumen
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>{summary}</p>
        </div>


      </>
    ) : (
      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
        Sube tu CV para analizarlo y ver recomendaciones.
      </p>
    )}
  </CardContent>
</Card>
        <button
          onClick={handleDownloadPDF}
          style={{
            backgroundColor: "#16a34a",
            color: "#ffffff",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            marginTop: "1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Descargar análisis (PDF)
        </button>
        </motion.div>

        {/* DERECHA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col space-y-8">
            {recommendedCluster && (
              <Card className="p-6 bg-white shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Te recomendamos mejorar en esta área
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="font-semibold text-gray-800 text-lg">
                      {recommendedCluster.recommendation}
                    </div>
                    <div className="text-sm text-gray-600">
                      Motivo: {recommendedCluster.razon}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() =>
                          router.push(
                            `/examen?title=${encodeURIComponent(
                              recommendedCluster.recommendation
                            )}`
                          )
                        }
                        className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        Hacer Examen
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="p-6 bg-white shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Empresas donde podrías ser contratado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {positions.slice(0, 5).map(([name], index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border p-4 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">{name}</div>
                      <div className="text-sm text-gray-500">
                        +{Math.floor(Math.random() * 6) + 1} coincidencias
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        router.push(`/examen?title=${encodeURIComponent(name)}`)
                      }
                      className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm"
                    >
                      Hacer Examen
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* SUBIR CV */}
      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 text-[#1A56DB]">
  <label className="cursor-pointer flex items-center space-x-3 bg-white border border-[#1A56DB] rounded-lg px-6 py-3 shadow-md hover:bg-[#1A56DB]/10 transition">
    <input
      type="file"
      accept=".pdf"
      onChange={handleFileChange}
      className="hidden"
    />
    <span className="text-sm font-semibold">
      {cvFile ? cvFile.name : "Elegir archivo (PDF)"}
    </span>
  </label>

  <button
    onClick={handleSubmit}
    disabled={isSubmitting || !cvFile}
    className={`px-6 py-3 rounded-lg font-bold transition shadow-md ${
      isSubmitting || !cvFile
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-[#1A56DB] text-white hover:bg-[#154bbf]"
    }`}
  >
    {isSubmitting ? "Analizando..." : "Subir CV"}
  </button>
</div>

    </div>
  );
}