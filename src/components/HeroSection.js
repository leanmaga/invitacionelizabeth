"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useQuinceaneraConfig } from "@/hooks/useQuinceaneraConfig";

// Componente de destellos estilo Ghibli
const GhibliSparkles = ({ count = 15, colores }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const colors = [colores.primario[400], colores.terciario[400]];
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setSparkles(newSparkles);
  }, [count, colores]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: sparkle.color,
            boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, sparkle.opacity, 0],
            scale: [0, 1, 0.5, 1, 0],
            x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
            y: [0, -Math.random() * 30 - 10, -Math.random() * 60 - 20],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Componente de partículas grandes para efectos
const ColorfulParticles = ({ count = 8, colores }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = [
      colores.primario[400],
      colores.terciario[400],
      colores.primario[500],
    ];
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 12 + 8,
      delay: Math.random() * 2,
      duration: Math.random() * 4 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, [count, colores]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0.8, 1.2, 0],
            x: [0, Math.random() * 30 - 15, Math.random() * 50 - 25],
            y: [0, -Math.random() * 40 - 20, -Math.random() * 80 - 30],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function HeroSection() {
  const { nombre, edad, colores } = useQuinceaneraConfig();

  // Estilos para los textos principales
  const titleStyles = {
    className: "text-6xl md:text-8xl lg:text-9xl font-bold mb-4 relative z-10",
    style: {
      fontFamily: "var(--font-Emilys_Candy)",
      color: colores.primario[200],
      textShadow: `0 0 20px ${colores.primario[400]}, 0 0 40px ${colores.primario[500]}, 0 0 60px ${colores.terciario[400]}, 2px 2px 8px rgba(0,0,0,0.8)`,
    },
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Tapiz con opacidad para que se vea sobre el fondo claro */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/assets/tapiz.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",

          mixBlendMode: "multiply",
        }}
      />

      {/* Overlay sutil para dar profundidad sin oscurecer demasiado */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, 
              ${colores.primario[50]}20, 
              transparent 30%, 
              transparent 70%, 
              ${colores.primario[100]}30
            )
          `,
        }}
      />

      <GhibliSparkles count={25} colores={colores} />
      <ColorfulParticles count={12} colores={colores} />

      <div className="text-center z-10 px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 relative"
        >
          {/* Contenedor del nombre */}
          <div className="relative">
            <motion.h1
              className={titleStyles.className}
              style={titleStyles.style}
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  `0 0 20px ${colores.primario[400]}, 0 0 40px ${colores.primario[500]}, 0 0 60px ${colores.terciario[400]}, 2px 2px 8px rgba(0,0,0,0.8)`,
                  `0 0 30px ${colores.primario[400]}, 0 0 50px ${colores.primario[500]}, 0 0 70px ${colores.terciario[400]}, 2px 2px 8px rgba(0,0,0,0.8)`,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {nombre}
            </motion.h1>
          </div>

          {/* Sección con número 15 entre líneas */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className="h-px w-24"
              style={{
                background: `linear-gradient(to right, transparent, ${colores.primario[400]}, transparent)`,
              }}
            />

            {/* Número 15 con efectos especiales */}
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.span
                className={titleStyles.className}
                style={titleStyles.style}
                animate={{
                  textShadow: [
                    `0 0 20px ${colores.primario[400]}, 0 0 40px ${colores.primario[500]}, 0 0 60px ${colores.terciario[400]}, 2px 2px 8px rgba(0,0,0,0.8)`,
                    `0 0 30px ${colores.primario[400]}, 0 0 50px ${colores.primario[500]}, 0 0 70px ${colores.terciario[400]}, 2px 2px 8px rgba(0,0,0,0.8)`,
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {edad}
              </motion.span>

              {/* Partículas alrededor del número */}
              <ColorfulParticles count={6} colores={colores} />
            </motion.div>

            <div
              className="h-px w-24"
              style={{
                background: `linear-gradient(to right, transparent, ${colores.primario[400]}, transparent)`,
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 relative"
        >
          {/* "AÑOS" con los mismos estilos que el nombre */}
          <motion.h1
            className={titleStyles.className}
            style={titleStyles.style}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Años
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl font-light relative z-10"
            style={{
              color: colores.primario[100],
              textShadow: `2px 2px 4px rgba(0,0,0,0.8), 0 0 15px ${colores.primario[400]}`,
            }}
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Acompañanos a celebrar bajo del mar
          </motion.p>
        </motion.div>
      </div>

      {/* Luciérnagas decorativas */}
      <motion.div
        className="absolute top-10 left-10"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.8, 1.2, 0.8],
          x: [0, 10, -5, 0],
          y: [0, -8, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 1,
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: colores.primario[400],
            boxShadow: `0 0 15px ${colores.primario[400]}, 0 0 30px ${colores.primario[400]}60`,
          }}
        />
      </motion.div>

      <motion.div
        className="absolute top-20 right-16"
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [0.6, 1, 0.6],
          x: [0, -15, 8, 0],
          y: [0, 12, -6, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: 2,
        }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: colores.terciario[300],
            boxShadow: `0 0 12px ${colores.terciario[300]}, 0 0 24px ${colores.terciario[300]}40`,
          }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-20"
        animate={{
          opacity: [0.4, 0.9, 0.4],
          scale: [0.7, 1.1, 0.7],
          x: [0, 18, -10, 0],
          y: [0, -12, 8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 0.5,
        }}
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{
            backgroundColor: colores.primario[400],
            boxShadow: `0 0 18px ${colores.primario[400]}, 0 0 36px ${colores.primario[400]}50`,
          }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-24"
        animate={{
          opacity: [0.6, 1, 0.4, 0.8],
          scale: [0.8, 1.2, 0.9, 1],
          x: [0, -20, 15, 0],
          y: [0, -18, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: colores.terciario[300],
            boxShadow: `0 0 14px ${colores.terciario[300]}, 0 0 28px ${colores.terciario[300]}40`,
          }}
        />
      </motion.div>
    </section>
  );
}
