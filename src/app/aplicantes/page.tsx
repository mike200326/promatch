"use client";

import { useEffect, useState, useRef } from "react";
import ApplicantsTable from "@/components/applicants/applicants_table";
import { Applicant } from "@/components/applicants/applicant_type";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function ApplicantsPage() {
  const { user, loading: authLoading, getToken } = useAuth();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const size = 10;
  const inputRef = useRef<HTMLDivElement>(null);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
  const fetchApplicants = async () => {
    if (authLoading || !user) return;

    setLoading(true);
    try {
      const token = await getToken();
      const url = `https://back-complete-86430845382.us-central1.run.app/api/applicants?page=${page}&size=${size}&search=${debouncedSearch}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text);

      const data = JSON.parse(text);
      setApplicants(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ Error:", err);
        setError(err.message || "Error desconocido");
      } else {
        console.error("❌ Error desconocido", err);
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchApplicants();
}, [authLoading, user, page, debouncedSearch, sortBy, sortOrder, getToken]);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Lista de Aplicantes
      </h1>

      <div ref={inputRef} className="mb-4 w-full max-w-sm z-10 relative">
        <Input
          placeholder="Buscar por aptitud..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="text-black border border-blue-400 placeholder-black"
        />
      </div>

      {loading && <p className="text-black">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && applicants.length > 0 && (
        <>
          <ApplicantsTable
            applicants={applicants}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(field) => {
              if (sortBy === field) {
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              } else {
                setSortBy(field);
                setSortOrder("asc");
              }
              setPage(1);
            }}
          />

          <div className="flex justify-center gap-6 mt-6 w-[930px]">
            {page > 1 && (
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-black"
              >
                Anterior
              </button>
            )}
            <span className="text-black">Página {page}</span>
            {applicants.length === size && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-black"
              >
                Siguiente
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
