"use client";

import { useEffect, useState, useRef } from "react";
import ApplicantsTable from "@/components/applicants/applicants_table";
import { Applicant } from "@/components/applicants/applicant_type";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Search, Users, Filter, ChevronLeft, ChevronRight, Loader2, AlertCircle, X } from "lucide-react";

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
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header elegante y limpio */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Users className="h-7 w-7 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lista de Aplicantes
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona y revisa todos los candidatos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-7xl mx-auto">
        {/* Barra de búsqueda mejorada */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              ref={inputRef}
              placeholder="Buscar aplicantes..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-12 pr-12 h-12 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Estados de carga */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
            </div>
            <p className="text-gray-600 text-lg">Cargando aplicantes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-semibold">Error al cargar</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {!loading && applicants.length > 0 && (
          <div className="space-y-8">
            {/* Cards de información */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{applicants.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Página</p>
                    <p className="text-2xl font-bold text-gray-900">{page}</p>
                  </div>
                  <div className="text-gray-400 text-xl">📄</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Ordenar</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{sortBy}</p>
                  </div>
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Orden</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {sortOrder === "asc" ? "Ascendente" : "Descendente"}
                    </p>
                  </div>
                  <div className="text-gray-400 text-2xl">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla con diseño limpio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
            </div>

            {/* Paginación elegante */}
            <div className="flex justify-center items-center space-x-4 py-6">
              {page > 1 && (
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="font-medium">Anterior</span>
                </button>
              )}

              <div className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-sm font-medium">Página</span>
                <span className="font-bold">{page}</span>
              </div>

              {applicants.length === size && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <span className="font-medium">Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {!loading && applicants.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron aplicantes
            </h3>
            <p className="text-gray-600 mb-6">
              {search ? "Intenta con otros términos de búsqueda" : "Aún no hay aplicantes registrados"}
            </p>
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg shadow-sm transition-colors font-medium"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
