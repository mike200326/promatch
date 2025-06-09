"use client";

import { useState } from "react";

const questions = [
  {
    question: "¿Cuál es la capital de Francia?",
    options: ["Madrid", "París", "Roma"],
    correct: "París",
  },
  {
    question: "¿Cuánto es 2 + 2?",
    options: ["3", "4", "5"],
    correct: "4",
  },
];

export default function ExamenPruebaPage() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const correctCount = answers.filter((a, i) => a === questions[i].correct).length;
  const score = Math.round((correctCount / questions.length) * 100);

  const getLegend = (s: number) => {
    if (s >= 90) return "Excelente";
    if (s >= 70) return "Bueno";
    return "Necesita mejorar";
  };

  return (
    <main className="max-w-2xl mx-auto pt-28 pb-12 px-4 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Responde el examen</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((q, i) => (
          <div key={i} className="mb-6">
            <p className="font-semibold mb-2">{i + 1}. {q.question}</p>
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
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Entregar examen
          </button>
        ) : (
          <div className="text-center mt-8">
            <p className="text-xl font-semibold">Tu calificación final:</p>
            <p className="text-3xl font-bold text-blue-600">{score} / 100</p>
            <p className="italic mt-2">{getLegend(score)}</p>
          </div>
        )}
      </form>
    </main>
  );
}
