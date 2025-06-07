"use client";

import React, { useEffect, useState } from "react";
import { QuizResult } from "@/components/quiz/QuizResult";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

interface QuizOption {
  id: number;
  optionText: string;
  correctAnswer: boolean;
}

interface QuizQuestion {
  questionText: string;
  options: QuizOption[];
}

export default function ExamenIniciarPage() {
  const { getToken } = useAuth();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [percent, setPercent] = useState(0);
  const [examId, setExamId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [topicTitle, setTopicTitle] = useState("JavaScript");
  const [isReady, setIsReady] = useState(false); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title") || "JavaScript";
    setTopicTitle(title);
    setIsReady(true); 
  }, []);

  useEffect(() => {
    if (!isReady) return;

    generateExam();

    async function fetchExam(id: number) {
      try {
        const token = await getToken();

        const res = await fetch(`https://back-complete-86430845382.us-central1.run.app/api/quiz/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(
            `❌ Error al recuperar el examen: ${res.status} - ${text}`
          );
          setError(`Error al recuperar el examen: ${res.status} - ${text}`);
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("📢 Respuesta de /api/quiz/{id}:", data);

        if (data.success && Array.isArray(data.exam.questions)) {
          setQuestions(data.exam.questions);
          setExamId(id);
        } else {
          setError("No se pudieron cargar las preguntas.");
        }
      } catch (err) {
        console.error("❌ Error en fetchExam:", err);
        setError("Error al recuperar el examen.");
      } finally {
        setLoading(false);
      }
    }

    async function generateExam() {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        setError("Debes iniciar sesión para generar un examen.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = await getToken();

        const res = await fetch("https://back-complete-86430845382.us-central1.run.app/api/quiz/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topic: topicTitle,
            numQuestions: 5,
            numOptions: 4,
            difficulty: "medium",
            depth: "shallow",
            userId: parseInt(userId, 10),
          }),
        });

        const data = await res.json();
        console.log("📢 Respuesta de /api/quiz/generate:", data);

        if (data?.success && data?.examId) {
          await fetchExam(data.examId);
        } else {
          setError(
            `No se pudo generar el examen. Respuesta: ${JSON.stringify(data)}`
          );
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Error al generar el examen:", err);
        setError("Error al generar el examen.");
        setLoading(false);
      }
    }
  }, [isReady, getToken]); // ✅ SOLO depende de isReady

  const handleTimeUpdate = (t: number) => setTimeLeft(t);
  const handleProgressUpdate = (p: number) => setPercent(p);

  const handleExamFinish = async (correctAnswers: number) => {
    if (!examId) {
      console.warn("⛔ examId está vacío");
      return;
    }

    const score = (correctAnswers / 5) * 100;
    setSubmitted(true);

    try {
      const token = await getToken();

      const res = await fetch(
        `https://back-complete-86430845382.us-central1.run.app/api/quiz/${examId}/score`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score }),
        }
      );

      const data = await res.json();
      console.log("✅ Score guardado:", data);
    } catch (err) {
      console.error("❌ Error al enviar score:", err);
    }
  };

  return (
    <main className="relative min-h-screen px-4 py-10 bg-gray-50">
      <div className="fixed top-28 right-20 z-50">
        <Card className="w-44 bg-gray-100 shadow-lg border rounded-xl">
          <CardContent className="py-4 px-3 text-center">
            <div className="flex justify-center items-center gap-1 text-gray-800 font-semibold mb-2">
              <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
            </div>
            <div className="w-full h-2 bg-gray-300 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{percent}% respondido</p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto">
        {loading && <p className="text-center text-gray-700">Cargando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && questions.length > 0 && (
          <QuizResult
            questions={questions}
            onTimeUpdate={handleTimeUpdate}
            onProgressUpdate={handleProgressUpdate}
            onExamFinish={handleExamFinish}
            submitted={submitted}
          />
        )}
      </div>
    </main>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
