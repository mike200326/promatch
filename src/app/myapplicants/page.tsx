"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MyApplicantCard from "@/components/applicants/myapplicants_card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface MyApplicant {
  applicationId: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  examType: string;
  score: number;
  salarioMin: number | null;
  salarioMax: number | null;
  status: string;
}

export default function MyApplicantsPage() {
  const { user, getToken, authLoading } = useAuth();
  const [allApplicants, setAllApplicants] = useState<MyApplicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<MyApplicant[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos");

  useEffect(() => {
    const fetchApplicants = async () => {
      if (authLoading) return;
      if (!user) {
        console.warn("Usuario no autenticado aún.");
        return;
      }

      const organizationId = sessionStorage.getItem("userId");
      if (!organizationId) {
        console.warn("No se encontró userId (empresa) en sessionStorage");
        return;
      }

      try {
        const token = await getToken();
        if (!token) throw new Error("No se pudo obtener el token.");

        const res = await fetch(
          `https://back-complete-86430845382.us-central1.run.app/api/myapplicants?userId=${organizationId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Error al obtener aplicantes");

        const data: MyApplicant[] = await res.json();
        console.log("Aplicantes recibidos:", data);
        setAllApplicants(data);
        setFilteredApplicants(data);
      } catch (err) {
        console.error("Error al obtener aplicantes:", err);
      }
    };

    fetchApplicants();
  }, [authLoading, user, getToken]); // ✅ warning resuelto: agregamos getToken

  useEffect(() => {
    if (selectedStatus === "Todos") {
      setFilteredApplicants(allApplicants);
    } else {
      setFilteredApplicants(
        allApplicants.filter(
          (applicant) =>
            applicant.status.toLowerCase() === selectedStatus.toLowerCase()
        )
      );
    }
  }, [selectedStatus, allApplicants]);

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-black">Mis Aplicantes</h1>

      <div className="mb-6">
        <label className="block text-black mb-2 text-sm font-medium">
          Filtrar por estado
        </label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger
            data-testid="applicant-filter"
            className="bg-white border border-gray-300 hover:bg-blue-200 text-black"
          >
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>

          <SelectContent className="bg-white border text-black">
            {[
              "Todos",
              "Agregado",
              "En_proceso",
              "Contactado",
              "Seleccionado",
              "Rechazado",
            ].map((status) => (
              <SelectItem
                key={status}
                value={status}
                data-testid={`filter-option-${status}`}
                className="bg-white border border-white hover:bg-blue-200 text-black"
              >
                {status === "En_proceso" ? "En proceso" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-6">
        {filteredApplicants.length === 0 ? (
          <p className="text-black">No hay aplicantes para este estado.</p>
        ) : (
          filteredApplicants.map((applicant) => (
            <MyApplicantCard
              key={applicant.applicationId}
              applicationId={applicant.applicationId}
              userId={applicant.userId}
              name={applicant.name}
              email={applicant.email}
              phone={applicant.phone}
              examType={applicant.examType}
              score={applicant.score}
              salarioMin={applicant.salarioMin}
              salarioMax={applicant.salarioMax}
              initialStatus={applicant.status}
            />
          ))
        )}
      </div>
    </main>
  );
}
