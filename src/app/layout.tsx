import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
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
          <NavbarLayout>{children}</NavbarLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
