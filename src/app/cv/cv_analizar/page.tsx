"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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

// Colores mejorados con mejor contraste y legibilidad
const COLORS = [
  "#2563EB", // Blue 600
  "#DC2626", // Red 600
  "#059669", // Green 600
  "#7C3AED", // Purple 600
  "#EA580C", // Orange 600
  "#0891B2", // Cyan 600
];

type PositionItem = [string, number];

type ChartDataItem = {
  name: string;
  value: number;
  color: string;
};

// Componente personalizado para el tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-gray-900 font-semibold text-base">{`${payload[0].name}`}</p>
        <p className="text-gray-700 text-sm">{`Compatibilidad: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

// Función para renderizar etiquetas personalizadas
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Solo mostrar porcentaje si es mayor al 5%
  if (percent < 0.05) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="#1F2937" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="14"
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DashboardPage() {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendedCluster, setRecommendedCluster] = useState<ClusterItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const saved = localStorage.getItem("cvAnalysis");
    if (saved) {
      const analysis = JSON.parse(saved);
      setSummary(analysis.summary || "");

      if (analysis.positions && typeof analysis.positions === "object") {
        const formatted = Object.entries(analysis.positions).map(
          ([name, value], index) => ({
            name,
            value: Number(value),
            color: COLORS[index % COLORS.length],
          })
        );

        setChartData(formatted);
        setPositions(
          Object.entries(analysis.positions).map(([name, value]) => [
            name,
            Number(value),
          ])
        );
      } else {
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setCvFile(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
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
        localStorage.setItem("cvAnalysis", JSON.stringify(response));

        if (response.positions && typeof response.positions === "object") {
          const formatted = Object.entries(response.positions).map(
            ([name, value], index) => ({
              name,
              value: Number(value),
              color: COLORS[index % COLORS.length],
            })
          );

          setChartData(formatted);
          setPositions(
            Object.entries(response.positions).map(([name, value]) => [
              name,
              Number(value),
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
      const canvas = await html2canvas(chartRef.current, { 
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      });
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
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-indigo-400 opacity-30"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Fondo animado mejorado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
            Analiza tu CV con IA
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre tus oportunidades laborales y mejora tu perfil profesional con análisis inteligente
          </p>
        </motion.div>

        {/* Sección de carga mejorada */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative bg-white rounded-3xl shadow-lg p-8 sm:p-12 transition-all duration-300 border-2 ${
              isDragging 
                ? "border-dashed border-indigo-500 bg-indigo-50 scale-105 shadow-indigo-200/50" 
                : "border-gray-200 hover:border-indigo-300 hover:shadow-xl"
            }`}
          >
            <div className="text-center">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block mb-6"
              >
                <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </motion.div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 leading-tight">
                {cvFile ? `Archivo seleccionado: ${cvFile.name}` : "Arrastra tu CV aquí"}
              </h3>
              <p className="text-gray-500 mb-8 text-base sm:text-lg">o haz clic para seleccionar un archivo PDF</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <label className="relative cursor-pointer inline-block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-block">
                    Seleccionar PDF
                  </span>
                </label>

                {cvFile && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg transform transition-all duration-300 ${
                      isSubmitting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:scale-105"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analizando...
                      </span>
                    ) : "Analizar CV"}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid principal mejorado */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda - Gráfico mejorado */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              ref={chartRef}
              className="bg-white shadow-xl rounded-3xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
                  Oportunidades para ti
                </CardTitle>
              </CardHeader>

              <CardContent>
                {chartData.length > 0 ? (
                  <>
                    <div className="bg-white rounded-2xl p-4">
                      <ResponsiveContainer width="100%" height={450}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={140}
                            fill="#8884d8"
                            animationBegin={0}
                            animationDuration={1500}
                            stroke="#ffffff"
                            strokeWidth={2}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend 
                            wrapperStyle={{
                              paddingTop: '30px',
                              fontSize: '14px',
                              color: '#374151'
                            }}
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <h2 className="font-bold text-lg sm:text-xl text-gray-900 mb-3">
                        Resumen del Análisis
                      </h2>
                      <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownloadPDF}
                      className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descargar análisis (PDF)
                      </span>
                    </motion.button>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <svg className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">
                      Sube tu CV para comenzar el análisis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Columna derecha mejorada */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {recommendedCluster && (
              <Card className="bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-xl rounded-3xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl sm:text-2xl font-bold">
                    Te recomendamos mejorar en
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                      {recommendedCluster.recommendation}
                    </h3>
                    <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                      <span className="font-semibold">Motivo:</span> {recommendedCluster.razon}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        router.push(
                          `/examen?title=${encodeURIComponent(
                            recommendedCluster.recommendation
                          )}`
                        )
                      }
                      className="bg-white text-orange-600 px-6 sm:px-8 py-3 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Hacer Examen
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white shadow-xl rounded-3xl border border-gray-100">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  Empresas donde podrías trabajar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {positions.length > 0 ? (
                  positions.slice(0, 5).map(([name], index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="bg-white border border-gray-200 p-5 rounded-2xl shadow-md hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-base sm:text-lg text-gray-800 leading-tight">{name}</h4>
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-600">
                              +{Math.floor(Math.random() * 6) + 1} coincidencias
                            </span>
                            <div className="ml-3 flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(Math.random() * 3) + 3
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            router.push(`/examen?title=${encodeURIComponent(name)}`)
                          }
                          className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 self-start sm:self-center"
                        >
                          Hacer Examen
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-gray-500 text-base font-medium">
                      Las empresas aparecerán después del análisis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
