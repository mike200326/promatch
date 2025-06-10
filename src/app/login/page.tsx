"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth } from "firebase/auth";

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, getToken } = useAuth();
  const auth = getAuth(); // Obtener instancia de auth

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [, setFormTouched] = useState(false);
  const [fieldTouched, setFieldTouched] = useState({
    email: false,
    password: false
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);

  // Verificar conexión a internet
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Manejo del bloqueo temporal por intentos fallidos
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBlocked && blockTimeLeft > 0) {
      interval = setInterval(() => {
        setBlockTimeLeft(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, blockTimeLeft]);

  // Validación de campos
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'El correo electrónico es obligatorio';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Formato de correo electrónico inválido';
        if (value.length > 100) return 'El correo electrónico es demasiado largo';
        return '';

      case 'password':
        if (!value) return 'La contraseña es obligatoria';
        if (value.length < 1) return 'Ingresa tu contraseña';
        return '';

      default:
        return '';
    }
  };

  // Validar todo el formulario
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key as keyof ValidationErrors] = error;
    });

    return newErrors;
  };

  // Manejar cambios en los campos
  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormTouched(true);

    // Validación en tiempo real solo si el campo ya fue tocado
    if (fieldTouched[field as keyof typeof fieldTouched]) {
      const fieldError = validateField(field, value);
      setErrors(prev => ({ 
        ...prev, 
        [field]: fieldError,
        general: '' // Limpiar error general al corregir campos
      }));
    }
  };

  // Manejar blur de campos
  const handleFieldBlur = (field: keyof typeof fieldTouched) => {
    setFieldTouched(prev => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: fieldError }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      setErrors({ general: 'No hay conexión a internet. Verifica tu conexión e intenta nuevamente.' });
      return;
    }

    if (isBlocked) {
      setErrors({ general: `Demasiados intentos fallidos. Espera ${blockTimeLeft} segundos antes de intentar nuevamente.` });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Validar formulario completo
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      // Sanitizar datos
      const sanitizedData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      // 1. Autenticación con Firebase - SOLUCIÓN PARA TIMING ISSUE
      let firebaseToken: string;
      
      console.log('=== INICIANDO LOGIN CON FIREBASE ===');
      
      try {
        console.log('Intentando login...');
        
        // El login debe fallar si las credenciales están mal
        await login(sanitizedData.email, sanitizedData.password);
        console.log('✅ Login exitoso');
        
        // SOLUCIÓN AL TIMING ISSUE: Obtener token directamente del resultado de auth
        // en lugar de depender del estado del contexto
        console.log('Obteniendo token...');
        
        let token = null;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!token && attempts < maxAttempts) {
          attempts++;
          console.log(`Intento ${attempts}/${maxAttempts} de obtener token...`);
          
          // Esperar que el estado se actualice
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            // Método 1: Usar el contexto
            token = await getToken();
            
            // Método 2: Si el contexto falla, obtener directamente de Firebase auth
            if (!token) {
              const currentUser = auth.currentUser;
              if (currentUser) {
                token = await currentUser.getIdToken(true);
                console.log('Token obtenido directamente de Firebase auth');
              }
            }
            
            if (token) {
              console.log(`✅ Token obtenido en intento ${attempts}`);
              break;
            }
          } catch (error) {
            console.log(`Error en intento ${attempts}:`, error);
            
            // Si falla, intentar método directo
            try {
              const currentUser = auth.currentUser;
              if (currentUser) {
                token = await currentUser.getIdToken(true);
                console.log('Token obtenido por método directo en intento', attempts);
                break;
              }
            } catch {
              console.log('Método directo también falló');
            }
          }
          
          // Esperar más tiempo en intentos posteriores
          if (attempts >= 5) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (!token) {
          console.log('⚠️ No se pudo obtener token pero login verificado');
          
          // Como last resort, verificar que realmente esté autenticado
          const currentUser = auth.currentUser;
          if (currentUser) {
            console.log('Usuario confirmado en Firebase auth:', currentUser.email);
            
            // Proceder sin token del backend pero con Firebase confirmado
            const userIdentifier = sanitizedData.email.split('@')[0] + '_' + Date.now();
            sessionStorage.setItem("userId", userIdentifier);
            sessionStorage.setItem("userRole", "usuario");
            sessionStorage.setItem("email", sanitizedData.email);
            sessionStorage.setItem("firebaseUid", currentUser.uid);
            sessionStorage.setItem("loginMethod", "firebase_verified");
            
            window.location.href = "/";
            return;
          } else {
            throw new Error('Error crítico: Login exitoso pero usuario no encontrado en Firebase');
          }
        }
        
        firebaseToken = token;
        console.log('✅ Autenticación completa con token');

      } catch (firebaseError) {
        console.error('Error de Firebase:', firebaseError);
        let errorMessage = "Error de autenticación";
        
        if (firebaseError instanceof Error) {
          if (firebaseError.message.includes('user-not-found')) {
            errorMessage = "No existe una cuenta con este correo electrónico.";
          } else if (firebaseError.message.includes('wrong-password') || firebaseError.message.includes('invalid-credential')) {
            errorMessage = "Contraseña incorrecta. Verifica e intenta nuevamente.";
          } else if (firebaseError.message.includes('too-many-requests')) {
            errorMessage = "Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente.";
          } else if (firebaseError.message.includes('user-disabled')) {
            errorMessage = "Esta cuenta ha sido deshabilitada. Contacta al soporte.";
          } else if (firebaseError.message.includes('network-request-failed')) {
            errorMessage = "Error de conexión. Verifica tu internet e intenta nuevamente.";
          } else {
            errorMessage = firebaseError.message;
          }
        }
        
        // Incrementar intentos fallidos
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setIsBlocked(true);
          setBlockTimeLeft(300); // 5 minutos
          errorMessage = "Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.";
        }
        
        throw new Error(errorMessage);
      }

      // 2. Petición al backend para obtener el userId
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const res = await fetch(
          "https://back-complete-86430845382.us-central1.run.app/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              Authorization: `Bearer ${firebaseToken}`,
            },
            body: JSON.stringify(sanitizedData),
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
          let errorMessage = "Error al iniciar sesión";
          
          try {
            const errorData = await res.json();
            
            switch (res.status) {
              case 400:
                errorMessage = "Datos inválidos. Verifica tu correo y contraseña.";
                break;
              case 401:
                errorMessage = "Credenciales inválidas. Verifica tu correo y contraseña.";
                break;
              case 403:
                errorMessage = "Acceso denegado. Tu cuenta puede estar suspendida.";
                break;
              case 404:
                errorMessage = "Usuario no encontrado. Verifica tu correo o regístrate.";
                break;
              case 429:
                errorMessage = "Demasiados intentos de login. Espera unos minutos.";
                break;
              case 500:
                errorMessage = "Error interno del servidor. Intenta más tarde.";
                break;
              case 503:
                errorMessage = "Servicio temporalmente no disponible.";
                break;
              default:
                errorMessage = errorData.message || errorMessage;
            }
          } catch {
            errorMessage = `Error del servidor (${res.status}). Intenta más tarde.`;
          }

          // Incrementar intentos para errores de credenciales
          if (res.status === 401 || res.status === 404) {
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);
            
            if (newAttempts >= 5) {
              setIsBlocked(true);
              setBlockTimeLeft(300);
              errorMessage = "Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.";
            }
          }

          throw new Error(errorMessage);
        }

        // Procesar respuesta exitosa
        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error("Respuesta del servidor inválida. Intenta nuevamente.");
        }

        // Validar datos de respuesta
        if (!data.userId) {
          throw new Error("Respuesta del servidor incompleta. Intenta nuevamente.");
        }

        // Guardar datos de sesión
        try {
          sessionStorage.setItem("userId", data.userId);
          if (data.role) {
            sessionStorage.setItem("userRole", data.role);
          }
        } catch {
          console.warn('Error al guardar en sessionStorage');
          // Continuar con el login aunque falle el storage
        }

        // Resetear intentos fallidos en login exitoso
        setLoginAttempts(0);
        setIsBlocked(false);

        // Redireccionar
        window.location.href = "/";

      } catch (backendError) {
        if (backendError instanceof Error && backendError.name === 'AbortError') {
          throw new Error("La solicitud tardó demasiado tiempo. Verifica tu conexión.");
        }
        throw backendError;
      }

    } catch (err: unknown) {
      console.error('Error en login:', err);
      
      let errorMessage = "Error desconocido al iniciar sesión";

      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('NetworkError')) {
          errorMessage = "Error de conexión. Verifica tu internet e intenta nuevamente.";
        } else {
          errorMessage = err.message;
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear tiempo de bloqueo
  const formatBlockTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      {/* Indicador de conexión */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            Sin conexión a internet
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold text-black mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Iniciar sesión
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Accede a tu cuenta para continuar
          </motion.p>
        </div>

        {/* Formulario */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-8 rounded-2xl shadow-2xl border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Error general */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 text-sm font-medium">{errors.general}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicador de bloqueo */}
          <AnimatePresence>
            {isBlocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-orange-700 text-sm font-medium">
                    Cuenta bloqueada. Tiempo restante: {formatBlockTime(blockTimeLeft)}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {/* Campo Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  onBlur={() => handleFieldBlur('email')}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-black transition-all duration-200 focus:outline-none ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : fieldTouched.email && !errors.email
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="ejemplo@correo.com"
                  disabled={isLoading || isBlocked}
                  maxLength={100}
                />
                {fieldTouched.email && !errors.email && formData.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onBlur={() => handleFieldBlur('password')}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white text-black transition-all duration-200 focus:outline-none ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : fieldTouched.password && !errors.password
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="Ingresa tu contraseña"
                  disabled={isLoading || isBlocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading || isBlocked}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </motion.p>
              )}
            </div>
          </div>

          {/* Información de intentos */}
          {loginAttempts > 0 && !isBlocked && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm text-center">
                Intentos fallidos: {loginAttempts}/5
                {loginAttempts >= 3 && (
                  <span className="block mt-1 font-medium">
                    ⚠️ Cuidado: {5 - loginAttempts} intentos restantes antes del bloqueo
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Botón de login */}
          <motion.button
            type="submit"
            disabled={isLoading || !isOnline || isBlocked || Object.keys(validateForm()).length > 0}
            className={`w-full mt-8 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
              isLoading || !isOnline || isBlocked || Object.keys(validateForm()).length > 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800 active:bg-gray-900 shadow-lg hover:shadow-xl'
            }`}
            whileHover={!isLoading && isOnline && !isBlocked ? { scale: 1.02 } : {}}
            whileTap={!isLoading && isOnline && !isBlocked ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </div>
            ) : isBlocked ? (
              `Bloqueado (${formatBlockTime(blockTimeLeft)})`
            ) : (
              'Iniciar sesión'
            )}
          </motion.button>

          {/* Enlaces */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-gray-600 text-sm">
              ¿No tienes una cuenta?{' '}
              <a
                href="/register"
                className="text-black font-semibold hover:underline transition-all duration-200"
              >
                Regístrate aquí
              </a>
            </p>
            <a
              href="/forgot-password"
              className="block text-gray-500 text-sm hover:text-black transition-all duration-200"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </motion.form>

        {/* Información adicional */}
        <motion.div 
          className="mt-6 text-center text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Mantén tu cuenta segura. Nunca compartas tus credenciales.
        </motion.div>
      </motion.div>
    </main>
  );
}
