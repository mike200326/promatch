"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Applicant } from "./applicant_type";

interface ApplicantsCardProps {
  applicant: Applicant | null;
}

export default function ApplicantsCard({ applicant }: ApplicantsCardProps) {
  const { getToken } = useAuth();

  if (!applicant) {
    return (
      <Card className="fixed top-1/2 right-6 -translate-y-1/2 w-[350px] bg-white border-[#8CBAF0] z-50 rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className="text-[#0D6EFD] text-xl">
            Detalles del aplicante
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-black">
          <p>
            Hola!
            <br />
            Selecciona un aplicante para ver los detalles.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleAddApplicant = async () => {
    const organizationId = sessionStorage.getItem("userId");
    if (!organizationId) {
      alert("No se encontró el ID de la organización.");
      return;
    }

    try {
      const token = await getToken();
      const checkRes = await fetch(
        `https://back-complete-86430845382.us-central1.run.app/api/applications/exist/${applicant.userId}/${organizationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (checkRes.status === 200) {
        const existingApp = await checkRes.json();
        if (existingApp.examId === applicant.examId) {
          alert("Este aplicante ya fue agregado con esa aptitud.");
        } else {
          alert("Este aplicante ya está agregado con otra aptitud.");
        }
        return;
      }

      const res = await fetch("https://back-complete-86430845382.us-central1.run.app/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: applicant.userId,
          examId: applicant.examId,
          organizationId: Number(organizationId),
          status: "Agregado",
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      alert("Aplicante agregado correctamente.");
    } catch (err) {
      console.error("Error al agregar aplicante:", err);
      alert("Ocurrió un error.");
    }
  };

  return (
    <Card className="fixed top-1/2 right-6 -translate-y-1/2 w-[350px] bg-white border-[#8CBAF0] z-50 rounded-xl shadow-md">
      <CardHeader>
        <CardTitle className="text-[#0D6EFD] text-xl">
          Detalles del aplicante
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-black space-y-2">
        <p>
          <strong>Nombre:</strong> {applicant.name}
        </p>
        <p>
          <strong>Email:</strong> {applicant.email}
        </p>
        <p>
          <strong>Teléfono:</strong> {applicant.phone}
        </p>
        <p>
          <strong>Aptitud:</strong> {applicant.examType}
        </p>
        <p>
          <strong>Calificación:</strong> {applicant.score}
        </p>
        <p>
          <strong>Salario mínimo:</strong> ${applicant.salarioMin ?? "N/A"}
        </p>
        <p>
          <strong>Salario máximo:</strong> ${applicant.salarioMax ?? "N/A"}
        </p>

        <button
          onClick={handleAddApplicant}
          className="mt-4 bg-[#0D6EFD] text-white px-4 py-2 rounded hover:bg-[#0b5ed7] transition"
        >
          Agregar a Mis Aplicantes
        </button>
      </CardContent>
    </Card>
  );
}
