"use client";

import { useState } from "react";

export default function PasswordRecoveryModal({ show, onClose }: { show: boolean, onClose: () => void }) {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    alert(`Se enviará un correo a: ${email}`);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative animate-fade-in-up">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Restablecer contraseña</h2>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
          >
            Restablecer
          </button>
        </div>
      </div>
    </div>
  );
}
