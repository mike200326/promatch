"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuthStatus } from "@/context/AuthStatusContext";

export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const ChatWidget = dynamic(() => import("@/components/ChatWidget"), {
    ssr: false,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { isLoggedIn, setIsLoggedIn } = useAuthStatus();

  useEffect(() => {
    const checkLogin = () => {
      const storedUserId = sessionStorage.getItem("userId");
      const storedUserRole = sessionStorage.getItem("userRole");

      setIsLoggedIn(!!storedUserId);
      setUserRole(storedUserRole);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();

    setIsLoggedIn(false);
    setShowProfileMenu(false);
    router.push("/login");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("profile-dropdown");
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = !isLoggedIn
    ? [
        { name: "Página de Inicio", path: "/" },
        { name: "Como funciona", path: "/how" },
      ]
    : userRole === "empresa"
    ? [
        { name: "Aplicantes", path: "/aplicantes" },
        { name: "MyApplicants", path: "/myapplicants" },
      ]
    : [
        { name: "Página de Inicio", path: "/" },
        { name: "Ofertas", path: "/stats" },
        { name: "Mi CV", path: "/cv" },
      ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link href="/" className="flex items-center">
              <motion.div whileHover={{ scale: 1.2 }}>
                <Image
                  src="/promatch1.png"
                  alt="ProMatch Logo"
                  width={140}
                  height={50}
                  className="h-12 w-auto scale-225"
                />
              </motion.div>
            </Link>
            <nav className="hidden lg:flex space-x-8">
              {menuItems.map((item) => (
                <motion.div key={item.name} whileHover={{ scale: 1.05 }}>
                  <Link
                    href={item.path}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                  >
                    {item.name}
                    <span className="absolute left-0 bottom-0 h-0.5 bg-blue-600 w-0 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4 relative">
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="hidden lg:flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2"
                  >
                    <UserCircle className="w-8 h-8 text-gray-700 hover:text-blue-600 cursor-pointer" />
                  </motion.button>

                  {showProfileMenu && (
                    <div
                      id="profile-dropdown"
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    >
                      <Link
                        href="/PerfilPage"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mi perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Iniciar sesión
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/register"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 font-medium transition-colors shadow-lg"
                    >
                      Registrarse
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="block py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 space-y-3 border-t border-gray-200">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/PerfilPage"
                        className="block py-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mi perfil
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full py-2 text-center bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block py-2 text-center text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        href="/register"
                        className="block py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="min-h-screen bg-gray-50">{children}</main>
      <ChatWidget />
    </>
  );
}
