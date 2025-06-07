"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario"); 
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://back-complete-86430845382.us-central1.run.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar.");
      }

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error desconocido.");
      } else {
        setError("Error desconocido.");
      }
    }
  };

  return (
    <main className="h-screen w-screen flex items-start justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 px-4 pt-20 text-black">
      <motion.form
        onSubmit={handleRegister}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-5"
      >
        <h2 className="text-3xl font-extrabold text-center text-black mb-2">
          Crear cuenta
        </h2>
        <p className="text-center text-sm text-gray-700 mb-4">
          Regístrate para empezar a explorar oportunidades con IA
        </p>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-100 py-2 px-4 rounded-md shadow">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-black"
          required
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-black"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-black"
          required
        />

        {/* Selección de rol */}
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-700">Selecciona tu rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          >
            <option value="usuario">Usuario</option>
            <option value="empresa">Empresa</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 transition"
        >
          Registrarse
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="text-indigo-700 font-medium hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </motion.form>
    </main>
  );
}
