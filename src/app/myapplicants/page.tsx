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
import { 
  Users, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  PhoneCall,
  Plus,
  Loader2,
  Search,
  Grid3X3,
  List,
  TrendingUp
} from "lucide-react";

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

const statusConfig = {
  "Todos": { icon: Users, color: "gray", bgColor: "bg-gray-50", textColor: "text-gray-700" },
  "Agregado": { icon: Plus, color: "blue", bgColor: "bg-blue-50", textColor: "text-blue-700" },
  "En_proceso": { icon: Clock, color: "yellow", bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
  "Contactado": { icon: PhoneCall, color: "purple", bgColor: "bg-purple-50", textColor: "text-purple-700" },
  "Seleccionado": { icon: CheckCircle, color: "green", bgColor: "bg-green-50", textColor: "text-green-700" },
  "Rechazado": { icon: XCircle, color: "red", bgColor: "bg-red-50", textColor: "text-red-700" }
};

export default function MyApplicantsPage() {
  const { user, getToken, authLoading } = useAuth();
  const [allApplicants, setAllApplicants] = useState<MyApplicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<MyApplicant[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      if (authLoading) return;
      if (!user) {
        console.warn("Usuario no autenticado aún.");
        setLoading(false);
        return;
      }

      const organizationId = sessionStorage.getItem("userId");
      if (!organizationId) {
        console.warn("No se encontró userId (empresa) en sessionStorage");
        setLoading(false);
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
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [authLoading, user, getToken]);

  useEffect(() => {
    let filtered = allApplicants;

    // Filtrar por estado
    if (selectedStatus !== "Todos") {
      filtered = filtered.filter(
        (applicant) =>
          applicant.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.examType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplicants(filtered);
  }, [selectedStatus, allApplicants, searchTerm]);

  // Calcular estadísticas (normalizar estados para que coincidan)
  const normalizeStatus = (status: string) => status?.toLowerCase().trim();
  
  const stats = {
    total: allApplicants.length,
    agregados: allApplicants.filter(a => normalizeStatus(a.status) === "agregado").length,
    enProceso: allApplicants.filter(a => normalizeStatus(a.status) === "en_proceso" || normalizeStatus(a.status) === "en proceso").length,
    contactados: allApplicants.filter(a => normalizeStatus(a.status) === "contactado").length,
    seleccionados: allApplicants.filter(a => normalizeStatus(a.status) === "seleccionado").length,
    rechazados: allApplicants.filter(a => normalizeStatus(a.status) === "rechazado").length,
    avgScore: allApplicants.length > 0 ? Math.round(allApplicants.reduce((sum, a) => sum + (a.score || 0), 0) / allApplicants.length) : 0
  };

  // Debug: mostrar los estados reales que llegan de la API
  useEffect(() => {
    if (allApplicants.length > 0) {
      const uniqueStatuses = [...new Set(allApplicants.map(a => a.status))];
      console.log("Estados únicos encontrados en la API:", uniqueStatuses);
      console.log("Estadísticas calculadas:", stats);
    }
  }, [allApplicants]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con estadísticas */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <UserCheck className="h-7 w-7 text-gray-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Aplicantes</h1>
                <p className="text-gray-600 mt-1">Gestiona tus candidatos y su progreso</p>
              </div>
            </div>
            
            {/* Controles de vista */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Estadísticas principales */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Agregados</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.agregados}</p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-600">En Proceso</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.enProceso}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Contactados</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.contactados}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Seleccionados</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.seleccionados}</p>
            </div>

            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-600">Rechazados</span>
              </div>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.rechazados}</p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-600">Prom. Score</span>
              </div>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{stats.avgScore}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-7xl mx-auto">
        {/* Controles de filtrado y búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 mb-8">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, email o tipo de examen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 text-gray-900">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-xl">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <SelectItem
                      key={status}
                      value={status}
                      className="flex items-center space-x-2 hover:bg-gray-50 text-gray-900 cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`h-4 w-4 text-${config.color}-600`} />
                        <span>{status === "En_proceso" ? "En proceso" : status}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
            <p className="text-gray-600 text-lg">Cargando aplicantes...</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {allApplicants.length === 0 ? "No tienes aplicantes aún" : "No se encontraron aplicantes"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedStatus !== "Todos" 
                ? "Intenta ajustar los filtros de búsqueda" 
                : "Los candidatos aparecerán aquí cuando se registren"}
            </p>
            {(searchTerm || selectedStatus !== "Todos") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("Todos");
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg shadow-sm transition-colors font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredApplicants.map((applicant) => (
              <div
                key={applicant.applicationId}
                className={`${viewMode === 'list' ? 'w-full' : ''} transition-all duration-200 hover:scale-[1.02]`}
              >
                <MyApplicantCard
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
              </div>
            ))}
          </div>
        )}

        {/* Información de resultados */}
        {!loading && filteredApplicants.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold text-gray-900">{filteredApplicants.length}</span> de{" "}
              <span className="font-semibold text-gray-900">{allApplicants.length}</span> aplicantes
              {selectedStatus !== "Todos" && (
                <span> con estado <span className="font-semibold">{selectedStatus === "En_proceso" ? "En proceso" : selectedStatus}</span></span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}