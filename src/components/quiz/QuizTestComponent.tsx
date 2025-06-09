"use client";

import { useState } from "react";

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

const questions: Question[] = [
  {
    questionText: "¿Cuál es la capital de Francia?",
    options: ["Madrid", "París", "Roma"],
    correctAnswer: "París",
  },
  {
    questionText: "¿Cuánto es 2 + 2?",
    options: ["3", "4", "5"],
    correctAnswer: "4",
  },
];

export default function QuizTestComponent() {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const correctCount = answers.reduce((acc, ans, i) => {
    return ans === questions[i].correctAnswer ? acc + 1 : acc;
  }, 0);

  const finalScore = Math.round((correctCount / questions.length) * 100); // 👈 sin decimales

  const getLegend = (score: number) => {
    if (score >= 90) return "Excelente";
    if (score >= 70) return "Bueno";
    return "Necesita mejorar";
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-black">Simulador de Quiz</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, i) => (
          <div key={i} className="mb-4 text-black">
            <p className="font-semibold">{i + 1}. {q.questionText}</p>
            {q.options.map((opt) => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name={`question-${i}`}
                  value={opt}
                  checked={answers[i] === opt}
                  onChange={() => handleChange(i, opt)}
                  disabled={submitted}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        {!submitted ? (
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Entregar examen
          </button>
        ) : (
          <div className="mt-4">
            <p className="text-lg font-bold">Tu calificación final:</p>
            <p className="text-2xl text-blue-600">{finalScore} / 100</p>
            <p className="italic text-gray-500">{getLegend(finalScore)}</p>
          </div>
        )}
      </form>
    </div>
  );
}
