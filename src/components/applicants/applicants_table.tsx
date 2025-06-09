"use client";

import { useState } from "react";
import { Applicant } from "./applicant_type";
import ApplicantsCard from "./applicants_card";

interface ApplicantsTableProps {
  applicants: Applicant[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (field: string) => void;
}

export default function ApplicantsTable({
  applicants,
  sortBy,
  sortOrder,
  onSortChange,
}: ApplicantsTableProps) {
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  const handleRowClick = (examId: number) => {
    setSelectedExamId(examId === selectedExamId ? null : examId);
  };

  const selectedApplicant =
    applicants.find((a) => a.examId === selectedExamId) ?? null;

  const sortIcon = (field: string) => {
    if (sortBy !== field) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="overflow-x-auto px-4">
      <table className="w-[970px] bg-white rounded-xl shadow">
        <thead className="bg-blue-500">
          <tr>
            <th className="text-left py-3 px-4 text-white">Nombre</th>
            <th className="text-left py-3 px-4 text-white">Aptitud</th>
            <th
              className="text-left py-3 px-4 text-white cursor-pointer"
              onClick={() => onSortChange("score")}
            >
              Calificación {sortIcon("score")}
            </th>
            <th
              className="text-left py-3 px-4 text-white cursor-pointer"
              onClick={() => onSortChange("salarioMin")}
            >
              Salario Mínimo {sortIcon("salarioMin")}
            </th>
            <th
              className="text-left py-3 px-4 text-white cursor-pointer"
              onClick={() => onSortChange("salarioMax")}
            >
              Salario Máximo {sortIcon("salarioMax")}
            </th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => {
            const isSelected = applicant.examId === selectedExamId;
            return (
              <tr
                key={`${applicant.userId}-${applicant.examId}`}
                className={`cursor-pointer ${
                  isSelected ? "bg-blue-300" : "hover:bg-blue-100"
                }`}
                onClick={() => handleRowClick(applicant.examId)}
              >
                <td className="py-2 px-4 text-black">{applicant.name}</td>
                <td className="py-2 px-4 text-black">{applicant.examType}</td>
                <td className="py-2 px-4 text-black">{applicant.score}</td>
                <td className="py-2 px-4 text-black">
                  ${applicant.salarioMin ?? "N/A"}
                </td>
                <td className="py-2 px-4 text-black">
                  ${applicant.salarioMax ?? "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ApplicantsCard applicant={selectedApplicant} />
    </div>
  );
}
