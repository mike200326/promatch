"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<{
    summary: string;
    technicalSkills: string[];
    softSkills: string[];
    salarioMin?: number;
    salarioMax?: number;
  } | null>(null);
  const [editableSummary, setEditableSummary] = useState<string>("");
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [initialTechnicalSkills, setInitialTechnicalSkills] = useState<string[]>([]);
  const [initialSoftSkills, setInitialSoftSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salaryMin, setSalaryMin] = useState<number | "">("");
  const [salaryMax, setSalaryMax] = useState<number | "">("");
  const [userPhone, setUserPhone] = useState<string>("");
  const { loading, getToken } = useAuth();

  useEffect(() => {
    const fetchPhone = async () => {
      if (loading) return;
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        console.warn("⛔ No se encontró el userId en sessionStorage.");
        return;
      }
      try {
        const token = await getToken();
        if (!token) throw new Error("No se pudo obtener el token.");

        const res = await fetch(
          `https://back-complete-86430845382.us-central1.run.app/api/user-generation/user/${userId}/phone`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        if (result.success !== false) {
          console.log("📞 Teléfono cargado:", result.phone);
          setUserPhone(result.phone || "");
        } else {
          console.warn("⚠️ No se pudo obtener el teléfono:", result.error);
        }
      } catch (err) {
        console.error("Error al obtener el teléfono:", err);
      }
    };

    fetchPhone();
  }, [loading, getToken]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (loading) return;
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        console.warn("⛔ No se encontró el userId en sessionStorage.");
        return;
      }
      try {
        const token = await getToken();
        if (!token) throw new Error("No se pudo obtener el token.");

        const res = await fetch(
          `https://back-complete-86430845382.us-central1.run.app/api/user-generation/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await res.json();
        if (result.success !== false) {
          setAnalysis(result);
          setEditableSummary(result.summary);
          setTechnicalSkills(result.technicalSkills || []);
          setSoftSkills(result.softSkills || []);
          setInitialTechnicalSkills(result.technicalSkills || []);
          setInitialSoftSkills(result.softSkills || []);
          setSalaryMin(result.salarioMin || "");
          setSalaryMax(result.salarioMax || "");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [loading, getToken]);

  const handleAnalyze = async () => {
    if (!cvFile) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No se pudo obtener el token.");

      const formData = new FormData();
      formData.append("file", cvFile);
      const storedUserId = sessionStorage.getItem("userId");
      if (!storedUserId) {
        console.error("⛔ No se encontró userId. Inicia sesión.");
        setIsSubmitting(false);
        return;
      }
      formData.append("userId", storedUserId);

      const res = await fetch(
        "https://back-complete-86430845382.us-central1.run.app/api/user-generation/generate",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await res.json();
      if (result.success !== false) {
        setAnalysis(result);
        setEditableSummary(result.summary);
        setTechnicalSkills(result.technicalSkills);
        setSoftSkills(result.softSkills);
        setInitialTechnicalSkills(result.technicalSkills);
        setInitialSoftSkills(result.softSkills);
      } else {
        setError(result.error || "Error al analizar");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (!analysis) return;
    setIsSaving(true);
    setError(null);

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.error("⛔ No hay userId en sessionStorage. Inicia sesión.");
      setIsSaving(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error("No se pudo obtener el token.");

      const addedTechnical = technicalSkills.filter(
        (s) => !initialTechnicalSkills.includes(s)
      );
      const addedSoft = softSkills.filter(
        (s) => !initialSoftSkills.includes(s)
      );
      const removedTechnical = initialTechnicalSkills.filter(
        (s) => !technicalSkills.includes(s)
      );
      const removedSoft = initialSoftSkills.filter(
        (s) => !softSkills.includes(s)
      );

      if (addedTechnical.length > 0) {
        await fetch(
          `https://back-complete-86430845382.us-central1.run.app/api/user-generation/${userId}/skills`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ type: "hard", skills: addedTechnical }),
          }
        );
      }

      if (addedSoft.length > 0) {
        await fetch(
          `https://back-complete-86430845382.us-central1.run.app/api/user-generation/${userId}/skills`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ type: "soft", skills: addedSoft }),
          }
        );
      }

      if (removedTechnical.length > 0) {
        await fetch(
          `https://back-complete-86430845382.us-central1.run.app/api/user-generation/${userId}/skills`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ type: "hard", skills: removedTechnical }),
          }
        );
      }

      if (removedSoft.length > 0) {
        await fetch(
          `https://back-complete-86430845382.us-central1.run.app/api/user-generation/${userId}/skills`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ type: "soft", skills: removedSoft }),
          }
        );
      }

      if (salaryMin !== "" && salaryMax !== "") {
        await fetch(
          `https://back-complete-86430845382.us-central1.run.app/api/user-generation/${userId}/salary`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              salarioMin: Number(salaryMin),
              salarioMax: Number(salaryMax),
            }),
          }
        );
      }

      if (userPhone.trim() !== "") {
        await fetch(
          `https://back-complete-86430845382.us-central1.run.app/api/user-generation/user/${userId}/phone`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              phone: userPhone.trim(),
            }),
          }
        );
      }

      // Actualizar estado inicial
      setInitialTechnicalSkills(technicalSkills);
      setInitialSoftSkills(softSkills);
    } catch (err: unknown) {
      console.error("❌ Error al guardar habilidades:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCvFile(file);
      setPdfPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const addSkill = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "technical" | "soft"
  ) => {
    if (e.key === "Enter") {
      const val = (e.target as HTMLInputElement).value.trim();
      if (!val) return;
      if (type === "technical" && !technicalSkills.includes(val)) {
        setTechnicalSkills([...technicalSkills, val]);
      }
      if (type === "soft" && !softSkills.includes(val)) {
        setSoftSkills([...softSkills, val]);
      }
      (e.target as HTMLInputElement).value = "";
    }
  };

  const removeSkill = (skill: string, type: "technical" | "soft") => {
    if (type === "technical") {
      setTechnicalSkills((prev) => prev.filter((s) => s !== skill));
    } else {
      setSoftSkills((prev) => prev.filter((s) => s !== skill));
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-200">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-1/3 bg-white p-8 flex flex-col items-center pt-16 space-y-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-gray-900">Sube tu CV y Foto</h2>
        <div className="w-40 h-40 bg-gray-300 rounded-full overflow-hidden relative">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt="Preview Foto"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-700">
              Foto
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full text-sm text-gray-900"
        />

        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Archivo CV (.pdf)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-900 p-2 border border-gray-400 rounded"
          />
        </div>
        {pdfPreview && (
          <div className="w-full h-48 border border-gray-300 rounded overflow-hidden">
            <iframe
              src={pdfPreview}
              className="w-full h-full"
              title="Vista previa CV"
            />
          </div>
        )}

        {/* Nueva sección para teléfono */}
    <div className="w-full mt-6">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        Teléfono de contacto
      </label>
      <input
        type="text"
        value={userPhone}
        onChange={(e) => setUserPhone(e.target.value)}
        placeholder="Ej. +52 123 456 7890"
        className="w-full text-sm text-gray-900 p-2 border border-gray-400 rounded"
      />
    </div>

    <div className="w-full mt-2 p-3 bg-gray-100 border border-gray-300 rounded">
  <p className="text-sm text-gray-700">
    <strong>Teléfono actual:</strong> {userPhone || "No disponible"}
  </p>
</div>


        <button
          onClick={handleAnalyze}
          disabled={isSubmitting || !cvFile}
          className="w-full bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-800 disabled:opacity-50 transform hover:scale-105 transition-all"
        >
          {isSubmitting ? "Analizando..." : "Analizar CV"}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-2/3 p-10 overflow-auto"
      >
        {!analysis ? (
          <div className="flex items-center justify-center h-full text-gray-600">
            <p>Sube tu CV para ver el análisis aquí</p>
          </div>
        ) : (
          <div className="space-y-8">
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Resumen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  rows={4}
                  value={editableSummary}
                  onChange={(e) => setEditableSummary(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Habilidades Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  placeholder="Presiona Enter para añadir"
                  onKeyDown={(e) => addSkill(e, "technical")}
                  className="mb-4 w-full p-2 border border-gray-300 rounded text-gray-900"
                />
                <div className="flex flex-wrap">
                  {technicalSkills.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className="m-1 inline-flex items-center bg-blue-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill, "technical")}
                        className="ml-2"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Soft Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  placeholder="Presiona Enter para añadir"
                  onKeyDown={(e) => addSkill(e, "soft")}
                  className="mb-4 w-full p-2 border border-gray-300 rounded text-gray-900"
                />
                <div className="flex flex-wrap">
                  {softSkills.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className="m-1 inline-flex items-center bg-green-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill, "soft")}
                        className="ml-2"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Salario deseado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Salario mínimo
                    </label>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) =>
                        setSalaryMin(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      placeholder="Ej. 15000"
                      className="w-full mt-1 p-2 border border-gray-300 rounded text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Salario máximo
                    </label>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) =>
                        setSalaryMax(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      placeholder="Ej. 28000"
                      className="w-full mt-1 p-2 border border-gray-300 rounded text-black"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 disabled:opacity-50 transform hover:scale-105 transition-all"
              >
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
