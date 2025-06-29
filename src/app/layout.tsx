// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { AuthStatusProvider } from "@/context/AuthStatusContext";
import { AuthUIProvider } from "@/context/AuthUIContext";
import NavbarLayout from "@/components/NavbarLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProMatch",
  description: "Plataforma para gestionar tu carrera",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <AuthStatusProvider>
            <AuthUIProvider>
              <NavbarLayout>{children}</NavbarLayout>
            </AuthUIProvider>
          </AuthStatusProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
