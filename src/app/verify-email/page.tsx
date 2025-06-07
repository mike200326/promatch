"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebase';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function VerifyEmailPage() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      auth.currentUser?.reload().then(() => {
        if (auth.currentUser?.emailVerified) {
          router.push('/dashboard');
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifica tu correo electrónico</h2>
        <p className="text-gray-600 mb-6">
          Hemos enviado un enlace de verificación a tu correo. Por favor revisa tu bandeja de entrada.
        </p>
        <div className="animate-pulse text-blue-600">
          Esperando verificación...
        </div>
      </div>
    </div>
  );
}