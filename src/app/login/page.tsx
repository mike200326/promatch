"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login, getToken } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      const token = await getToken();
      if (!token) throw new Error("No se pudo obtener el token de autenticación.");

      const res = await fetch("https://back-complete-86430845382.us-central1.run.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Credenciales inválidas o usuario no encontrado.");

      const data = await res.json();
      sessionStorage.setItem("userId", data.userId);
      sessionStorage.setItem("userRole", data.role);

      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al iniciar sesión.");
      } else {
        setError("Error al iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen flex items-start justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 px-4 pt-20 text-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl relative"
      >
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center rounded-2xl"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-indigo-700">Iniciando sesión...</span>
            </div>
          </motion.div>
        )}

        <h1 className="text-3xl font-extrabold text-center text-black mb-2">Iniciar sesión</h1>
        <p className="text-center text-sm text-gray-700 mb-4">
          Accede a tu cuenta para descubrir oportunidades con IA
        </p>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-100 py-2 px-4 rounded-md shadow">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-black"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-black"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 transition"
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-indigo-700 font-medium hover:underline"
          >
            Regístrate aquí
          </a>
        </p>
      </motion.div>
    </main>
  );
}
