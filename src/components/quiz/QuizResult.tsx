"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuizOption {
  id: number;
  optionText: string;
  correctAnswer: boolean;
}

interface QuizQuestion {
  questionText: string;
  options: QuizOption[];
}

interface Props {
  questions: QuizQuestion[];
  onTimeUpdate?: (seconds: number) => void;
  onProgressUpdate?: (percent: number) => void;
  onExamFinish?: (score: number) => void;
  submitted?: boolean;
}

export const QuizResult: React.FC<Props> = ({
  questions,
  onTimeUpdate,
  onProgressUpdate,
  onExamFinish,
  submitted = false,
}) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const router = useRouter();

  useEffect(() => {
    setAnswers(Array(questions.length).fill(""));
  }, [questions]);

  const handleSubmit = useCallback(() => {
    const correctCount = questions.reduce((acc, q, i) => {
      const correctOption = q.options.find((o) => o.correctAnswer)?.optionText;
      return answers[i] === correctOption ? acc + 1 : acc;
    }, 0);
    onExamFinish?.(correctCount);
  }, [answers, questions, onExamFinish]);

  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, handleSubmit]);

  useEffect(() => {
    onTimeUpdate?.(timeLeft);
  }, [timeLeft, onTimeUpdate]);

  useEffect(() => {
    const percent = Math.round(
      (answers.filter((a) => a !== "").length / questions.length) * 100
    );
    onProgressUpdate?.(percent);
  }, [answers, questions.length, onProgressUpdate]);

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const correctCount = questions.reduce((acc, q, i) => {
    const correctOption = q.options.find((o) => o.correctAnswer)?.optionText;
    return answers[i] === correctOption ? acc + 1 : acc;
  }, 0);

  const finalScore = ((correctCount / questions.length) * 100).toFixed(2);

  const getLegend = (score: number) => {
    if (score >= 90) return "Excelente";
    if (score >= 70) return "Bueno";
    return "Necesita mejorar";
  };

  return (
    <Card className="bg-gray-100 border shadow-lg rounded-xl">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-xl font-bold text-black">
          Responde las preguntas
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {questions.map((q, i) => (
            <div key={i} className="mb-6">
              <p className="font-medium text-black mb-2">
                {i + 1}. {q.questionText}
              </p>
              <div className="space-y-1">
                {q.options.map((option) => (
                  <label key={option.id} className="block text-gray-800">
                    <input
                      type="radio"
                      name={`question-${i}`}
                      value={option.optionText}
                      checked={answers[i] === option.optionText}
                      onChange={() => handleChange(i, option.optionText)}
                      disabled={submitted}
                      className="mr-2"
                    />
                    {option.optionText}
                  </label>
                ))}
              </div>

              {submitted && (
                <p
                  className={`mt-1 text-sm font-semibold ${
                    answers[i] ===
                    q.options.find((o) => o.correctAnswer)?.optionText
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {answers[i] ===
                  q.options.find((o) => o.correctAnswer)?.optionText
                    ? "✅ Correcto"
                    : `❌ Incorrecto. Respuesta correcta: ${
                        q.options.find((o) => o.correctAnswer)?.optionText
                      }`}
                </p>
              )}
            </div>
          ))}

          {!submitted ? (
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Entregar examen
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mt-6">
                <p className="text-xl font-semibold text-gray-800">
                  Tu calificación final:
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {finalScore} / 100
                </p>
                <p className="text-sm text-gray-500 mt-1 italic">
                  {getLegend(Number(finalScore))}
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-blue-600 hover:underline text-sm"
                >
                  🔙 Regresar al inicio
                </button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};