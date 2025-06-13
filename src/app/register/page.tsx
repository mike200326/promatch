"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "usuario"
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [, setFormTouched] = useState(false);
  const [fieldTouched, setFieldTouched] = useState({
    name: false,
    email: false,
    password: false
  });

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

  // Validación en tiempo real
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es obligatorio';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (value.trim().length > 50) return 'El nombre no puede exceder 50 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) return 'El nombre solo puede contener letras y espacios';
        return '';

      case 'email':
        if (!value.trim()) return 'El correo electrónico es obligatorio';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Formato de correo electrónico inválido';
        if (value.length > 100) return 'El correo electrónico es demasiado largo';
        return '';

      case 'password':
        if (!value) return 'La contraseña es obligatoria';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (value.length > 128) return 'La contraseña no puede exceder 128 caracteres';
        if (!/(?=.*[a-z])/.test(value)) return 'La contraseña debe contener al menos una letra minúscula';
        if (!/(?=.*[A-Z])/.test(value)) return 'La contraseña debe contener al menos una letra mayúscula';
        if (!/(?=.*\d)/.test(value)) return 'La contraseña debe contener al menos un número';
        if (!/(?=.*[@$!%*?&])/.test(value)) return 'La contraseña debe contener al menos un carácter especial (@$!%*?&)';
        if (/\s/.test(value)) return 'La contraseña no puede contener espacios';
        return '';

      default:
        return '';
    }
  };

  // Validar todo el formulario
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'role') {
        const error = validateField(key, value);
        if (error) newErrors[key as keyof ValidationErrors] = error;
      }
    });

    return newErrors;
  };

  // Manejar cambios en los campos
  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      setErrors({ general: 'No hay conexión a internet. Verifica tu conexión e intenta nuevamente.' });
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
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };

      // Realizar petición con timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout

      const response = await fetch("https://back-complete-86430845382.us-central1.run.app/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(sanitizedData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Manejar respuesta
      if (!response.ok) {
        let errorMessage = "Error al registrar la cuenta";
        
        try {
          const errorData = await response.json();
          
          // Manejar diferentes tipos de errores del servidor
          switch (response.status) {
            case 400:
              errorMessage = errorData.message || "Datos inválidos. Verifica la información ingresada.";
              break;
            case 409:
              errorMessage = "Este correo electrónico ya está registrado. Intenta con otro correo o inicia sesión.";
              break;
            case 422:
              errorMessage = "Los datos proporcionados no son válidos. Verifica todos los campos.";
              break;
            case 429:
              errorMessage = "Demasiados intentos de registro. Espera unos minutos e intenta nuevamente.";
              break;
            case 500:
              errorMessage = "Error interno del servidor. Intenta nuevamente más tarde.";
              break;
            case 503:
              errorMessage = "Servicio temporalmente no disponible. Intenta nuevamente en unos minutos.";
              break;
            default:
              errorMessage = errorData.message || errorMessage;
          }
        } catch {
          // Si no se puede parsear la respuesta JSON
          errorMessage = `Error del servidor (${response.status}). Intenta nuevamente más tarde.`;
        }

        throw new Error(errorMessage);
      }

      // Verificar que la respuesta sea JSON válido
      try {
        await response.json();
      } catch {
        console.warn('Respuesta del servidor no es JSON válido, pero el registro parece exitoso');
      }

      // Registro exitoso
      router.push("/login?registered=true");

    } catch (err: unknown) {
      console.error('Error en registro:', err);
      
      let errorMessage = "Error desconocido al registrar";

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = "La solicitud tardó demasiado tiempo. Verifica tu conexión e intenta nuevamente.";
        } else if (err.message.includes('fetch')) {
          errorMessage = "Error de conexión. Verifica tu internet e intenta nuevamente.";
        } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          errorMessage = "Error de red. Verifica tu conexión a internet.";
        } else {
          errorMessage = err.message;
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular fortaleza de contraseña
  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const labels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Perfecta'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength,
      label: labels[strength] || 'Muy débil',
      color: colors[strength] || 'bg-red-500'
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
            Crear cuenta
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Regístrate para comenzar tu experiencia
          </motion.p>
        </div>

        {/* Formulario */}
        <motion.form
          onSubmit={handleRegister}
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

          <div className="space-y-6">
            {/* Campo Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  onBlur={() => handleFieldBlur('name')}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-black transition-all duration-200 focus:outline-none ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500' 
                      : fieldTouched.name && !errors.name
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="Ingresa tu nombre completo"
                  disabled={isLoading}
                  maxLength={50}
                />
                {fieldTouched.name && !errors.name && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </motion.p>
              )}
            </div>

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
                  disabled={isLoading}
                  maxLength={100}
                />
                {fieldTouched.email && !errors.email && (
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
                      : fieldTouched.password && !errors.password && passwordStrength.strength >= 4
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="Crea una contraseña segura"
                  disabled={isLoading}
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
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

              {/* Indicador de fortaleza de contraseña */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Fortaleza de la contraseña</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength >= 4 ? 'text-green-600' : 
                      passwordStrength.strength >= 3 ? 'text-blue-600' :
                      passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600 flex items-start"
                >
                  <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Campo Rol */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de cuenta *
              </label>
              <select
                value={formData.role}
                onChange={handleInputChange('role')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-black focus:outline-none focus:border-black transition-all duration-200"
                disabled={isLoading}
              >
                <option value="usuario">Usuario Individual</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>
          </div>

          {/* Botón de registro */}
          <motion.button
            type="submit"
            disabled={isLoading || !isOnline || Object.keys(validateForm()).length > 0}
            className={`w-full mt-8 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
              isLoading || !isOnline || Object.keys(validateForm()).length > 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800 active:bg-gray-900 shadow-lg hover:shadow-xl'
            }`}
            whileHover={!isLoading && isOnline ? { scale: 1.02 } : {}}
            whileTap={!isLoading && isOnline ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </div>
            ) : (
              'Crear cuenta'
            )}
          </motion.button>

          {/* Enlaces */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes una cuenta?{' '}
              <a
                href="/login"
                className="text-black font-semibold hover:underline transition-all duration-200"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </motion.form>

        {/* Información adicional */}
        <motion.div 
          className="mt-6 text-center text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Al registrarte, aceptas nuestros términos de servicio y política de privacidad
        </motion.div>
      </motion.div>
    </main>
  );
}