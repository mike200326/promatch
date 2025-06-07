"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface MyApplicantCardProps {
  applicationId: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  examType: string;
  score: number;
  salarioMin: number | null;
  salarioMax: number | null;
  initialStatus: string;
}

export default function MyApplicantCard({
  applicationId,
  userId,
  name,
  email,
  phone,
  examType,
  score,
  salarioMin,
  salarioMax,
  initialStatus,
}: MyApplicantCardProps) {
  const [status, setStatus] = useState(initialStatus);
  const { getToken } = useAuth();

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      const token = await getToken();
      if (!token) throw new Error("No se pudo obtener el token.");

      const res = await fetch(
        `https://back-complete-86430845382.us-central1.run.app/api/applications/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar el estado");
      alert("✅ Estado actualizado correctamente.");
    } catch (err) {
      console.error("Error al actualizar el estado:", err);
      alert("❌ Error al actualizar el estado del aplicante.");
    }
  };

  const handleDelete = async () => {
    const organizationId = sessionStorage.getItem("userId");
    if (!organizationId) {
      alert("No se encontró el ID de la organización.");
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error("No se pudo obtener el token.");

      const res = await fetch(
        `https://back-complete-86430845382.us-central1.run.app/api/applications/${userId}/${organizationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al eliminar aplicante");
      alert("🗑️ Aplicante eliminado correctamente.");
      window.location.reload();
    } catch (err) {
      console.error("Error al eliminar aplicante:", err);
      alert("❌ Error al eliminar el aplicante.");
    }
  };

  const borderColorByStatus: Record<string, string> = {
    Agregado: "border-gray-400",
    Contactado: "border-blue-400",
    En_proceso: "border-orange-400",
    Seleccionado: "border-green-400",
    Rechazado: "border-red-500",
  };

  const borderColor = borderColorByStatus[status] || "border-gray-300";

  return (
    <Card
      data-testid={`applicant-card-${applicationId}`}
      className={`w-[350px] bg-white text-black shadow rounded p-4 border-2 ${borderColor}`}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Teléfono:</strong> {phone}
        </p>
        <p>
          <strong>Aptitud:</strong> {examType}
        </p>
        <p>
          <strong>Calificación:</strong> {score}
        </p>
        <p>
          <strong>Salario mínimo:</strong> ${salarioMin ?? "N/A"}
        </p>
        <p>
          <strong>Salario máximo:</strong> ${salarioMax ?? "N/A"}
        </p>

        <div>
          <label className="block mb-1 font-medium bg-white">Estado:</label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger
              data-testid={`status-select-${applicationId}`}
              className="w-full border border-gray-300 bg-white"
            >
              <SelectValue placeholder="Selecciona estado" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem
                value="Agregado"
                data-testid="status-option-Agregado"
                className="text-black hover:bg-blue-100 bg-white "
              >
                Agregado
              </SelectItem>
              <SelectItem
                value="Contactado"
                data-testid="status-option-Contactado"
                className="text-black hover:bg-blue-100 bg-white "
              >
                Contactado
              </SelectItem>
              <SelectItem
                value="En_proceso"
                data-testid="status-option-En_proceso"
                className="text-black hover:bg-blue-100 bg-white "
              >
                En proceso
              </SelectItem>
              <SelectItem
                value="Seleccionado"
                data-testid="status-option-Seleccionado"
                className="text-black hover:bg-blue-100 bg-white "
              >
                Seleccionado
              </SelectItem>
              <SelectItem
                value="Rechazado"
                data-testid="status-option-Rechazado"
                className="text-black hover:bg-blue-100 bg-white "
              >
                Rechazado
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {status === "Rechazado" && (
          <button
            data-testid={`delete-button-${applicationId}`}
            onClick={handleDelete}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Eliminar Aplicante
          </button>
        )}
      </CardContent>
    </Card>
  );
}