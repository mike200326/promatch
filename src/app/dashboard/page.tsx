"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Bienvenido, {user?.displayName || user?.email}</h2>
          <p className="text-gray-600">Esta es tu área personalizada.</p>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Tus datos:</h3>
            <ul className="space-y-2">
              <li>Email: {user?.email}</li>
              <li>Email verificado: {user?.emailVerified ? 'Sí' : 'No'}</li>
              <li>Usuario desde: {user?.metadata.creationTime}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}