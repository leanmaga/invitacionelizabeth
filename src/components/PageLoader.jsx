"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuinceaneraConfig } from "@/hooks/useQuinceaneraConfig";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/components/AudioContext";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [showAudioChoice, setShowAudioChoice] = useState(false);

  const updateImageCount = (total) => {
    setTotalImages(total);
  };

  const incrementLoadedImages = () => {
    setLoadedImages((prev) => prev + 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingProgress(20);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (totalImages > 0) {
      const imageProgress = (loadedImages / totalImages) * 70;
      const baseProgress = 20;
      const finalProgress = Math.min(baseProgress + imageProgress, 90);
      setLoadingProgress(finalProgress);

      if (loadedImages === totalImages) {
        setTimeout(() => {
          setLoadingProgress(100);
          // ✅ NUEVO: Mostrar opciones de audio en lugar de cerrar inmediatamente
          setTimeout(() => {
            setShowAudioChoice(true);
          }, 500);
        }, 300);
      }
    }
  }, [loadedImages, totalImages]);

  const closeLoader = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingProgress,
        updateImageCount,
        incrementLoadedImages,
        setIsLoading,
        totalImages,
        loadedImages,
        showAudioChoice,
        closeLoader,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

const PageLoader = () => {
  const {
    loadingProgress,
    totalImages,
    loadedImages,
    showAudioChoice,
    closeLoader,
  } = useLoading();
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState([]);

  const { colores } = useQuinceaneraConfig();
  const { togglePlayPause, isPlaying } = useAudio();

  useEffect(() => {
    setIsClient(true);
    const particleData = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 1000,
      y: Math.random() * 800 + 600,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 2,
    }));
    setParticles(particleData);
  }, []);

  // ✅ NUEVO: Manejar click en "Reproducir Audio"
  const handlePlayWithAudio = async () => {
    if (!isPlaying) {
      await togglePlayPause();
    }
    closeLoader();
  };

  // ✅ NUEVO: Manejar click en "Continuar sin Audio"
  const handleContinueWithoutAudio = () => {
    closeLoader();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        transition: { duration: 1, ease: "easeInOut" },
      }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, ${colores.primario[400]}4d 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${colores.primario[500]}4d 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, ${colores.primario[600]}33 0%, transparent 50%),
          linear-gradient(135deg, ${colores.primario[50]} 0%, ${colores.secundario[100]} 25%, ${colores.terciario[200]} 75%, ${colores.primario[300]} 100%)
        `,
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full opacity-70"
            style={{
              background: `linear-gradient(to right, ${colores.primario[400]}, ${colores.terciario[400]})`,
            }}
            initial={{
              x: particle.x,
              y: particle.y,
              scale: particle.scale,
            }}
            animate={{
              y: -10,
              x: particle.x + Math.sin(particle.id) * 100,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 px-8">
        {/* ✅ ACTUALIZADO: Ocultar animaciones cuando se muestran los botones */}
        <AnimatePresence mode="wait">
          {!showAudioChoice ? (
            <motion.div
              key="loading"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-12"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 w-32 h-32 mx-auto rounded-full opacity-30"
                    style={{
                      border: `4px solid ${colores.primario[400]}`,
                    }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-2 w-28 h-28 mx-auto rounded-full opacity-50"
                    style={{
                      border: `2px solid ${colores.terciario[400]}`,
                    }}
                  />
                  <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="text-6xl font-serif"
                      style={{
                        background: `linear-gradient(135deg, ${colores.primario[600]}, ${colores.primario[600]}, ${colores.terciario[600]})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      ✨
                    </motion.span>
                  </div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-4xl md:text-5xl font-serif font-bold mb-8"
                style={{
                  background: `linear-gradient(to right, ${colores.primario[700]}, ${colores.primario[600]}, ${colores.terciario[700]})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Cargando...
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="w-80 max-w-md mx-auto mb-6"
              >
                <div className="relative">
                  <div
                    className="h-3 rounded-full overflow-hidden shadow-inner"
                    style={{
                      background: `linear-gradient(to right, ${colores.primario[200]}, ${colores.secundario[200]})`,
                      border: `1px solid ${colores.primario[300]}`,
                    }}
                  >
                    <motion.div
                      className="h-full rounded-full relative"
                      style={{
                        background: `linear-gradient(to right, ${colores.primario[500]}, ${colores.primario[400]}, ${colores.terciario[500]})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background:
                            "linear-gradient(to right, transparent, white, transparent)",
                        }}
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-2xl font-bold"
                style={{
                  background: `linear-gradient(to right, ${colores.primario[600]}, ${colores.terciario[600]})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <motion.span
                  key={loadingProgress}
                  initial={{ scale: 1.2, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {Math.round(loadingProgress)}%
                </motion.span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-4 font-medium"
                style={{ color: colores.primario[700] }}
              >
                {loadingProgress < 30 && "Preparando la experiencia..."}
                {loadingProgress >= 30 &&
                  loadingProgress < 90 &&
                  totalImages > 0 &&
                  `Cargando fotografías... ${loadedImages}/${totalImages}`}
                {loadingProgress >= 30 &&
                  loadingProgress < 90 &&
                  totalImages === 0 &&
                  "Cargando fotografías..."}
                {loadingProgress >= 90 &&
                  loadingProgress < 100 &&
                  "Casi listo..."}
                {loadingProgress === 100 && "¡Completado!"}
              </motion.p>
            </motion.div>
          ) : (
            // ✅ NUEVO: Pantalla de elección de audio
            <motion.div
              key="audio-choice"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colores.primario[400]}, ${colores.terciario[400]})`,
                    boxShadow: `0 8px 32px ${colores.primario[400]}66`,
                  }}
                >
                  <Volume2 className="w-12 h-12 text-white" />
                </motion.div>

                <h2
                  className="text-3xl md:text-4xl font-serif font-bold mb-4"
                  style={{
                    background: `linear-gradient(to right, ${colores.primario[700]}, ${colores.terciario[700]})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ¿Deseas música?
                </h2>

                <p
                  className="text-lg mb-8"
                  style={{ color: colores.primario[700] }}
                >
                  Para una mejor experiencia, te recomendamos reproducir la
                  música
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {/* Botón: Reproducir con Audio */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlayWithAudio}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-lg text-white shadow-xl relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${colores.primario[500]}, ${colores.terciario[500]})`,
                    boxShadow: `0 8px 24px ${colores.primario[500]}66`,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                    initial={false}
                  />

                  <motion.div
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 opacity-30"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      backgroundSize: "200% 100%",
                    }}
                  />

                  <span className="relative flex items-center justify-center gap-3">
                    <Volume2 className="w-6 h-6" />
                    Reproducir con Música
                  </span>
                </motion.button>

                {/* Botón: Continuar sin Audio */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinueWithoutAudio}
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg border-2 transition-all"
                  style={{
                    color: colores.primario[700],
                    borderColor: colores.primario[300],
                    backgroundColor: `${colores.primario[50]}cc`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colores.primario[100]}`;
                    e.currentTarget.style.borderColor = colores.primario[400];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${colores.primario[50]}cc`;
                    e.currentTarget.style.borderColor = colores.primario[300];
                  }}
                >
                  <span className="flex items-center justify-center gap-3">
                    <VolumeX className="w-5 h-5" />
                    Continuar sin Música
                  </span>
                </motion.button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-sm"
                style={{ color: colores.primario[600] }}
              >
                Puedes cambiar esto en cualquier momento desde el menú
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colores.primario[400]}1a, transparent, ${colores.terciario[400]}1a)`,
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default PageLoader;
