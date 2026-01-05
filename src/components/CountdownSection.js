"use client";

import { useState, useEffect } from "react";
import { Clock, Sparkles, Star, Crown, Heart } from "lucide-react";
import { useQuinceaneraConfig } from "@/hooks/useQuinceaneraConfig";
import { getPrimaryColorClasses } from "@/config/theme.config";

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [particles, setParticles] = useState([]);
  const [pulseKey, setPulseKey] = useState(0);

  // ✅ Usar configuración centralizada
  const {
    fechaEvento,
    fechaCompleta,
    horaEvento,
    nombre,
    colores,
    horaInicio,
  } = useQuinceaneraConfig();

  // Obtener clases de color
  const colorClasses = getPrimaryColorClasses();

  // Generar partículas sutiles
  useEffect(() => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 3,
      size: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    // Parsear la fecha del evento
    const calculateTimeLeft = () => {
      try {
        const eventDate = new Date(`${fechaCompleta}T${horaInicio}:00`);
        const now = new Date();
        const difference = eventDate - now;

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      } catch (error) {
        console.error("Error calculando countdown:", error);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(() => {
      calculateTimeLeft();
      setPulseKey((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [fechaCompleta]);

  // Traducción de unidades
  const timeUnits = {
    days: "Días",
    hours: "Horas",
    minutes: "Minutos",
    seconds: "Segundos",
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4"
      style={{
        background: `linear-gradient(135deg, ${colores.primario[100]} 0%, ${colores.secundario[100]} 50%, ${colores.primario[50]} 100%)`,
      }}
    >
      {/* Partículas animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: colores.primario[300],
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Círculos decorativos */}
      <div
        className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: colores.primario[300] }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: colores.secundario[300] }}
      />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(5px);
          }
        }

        @keyframes pulse-soft {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px 0 rgba(212, 152, 157, 0.2);
        }

        .shimmer {
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Título del countdown */}
        <h3
          className="font-Emilys_Candy text-3xl md:text-4xl font-bold mb-8"
          style={{ color: colores.primario[600] }}
        >
          Faltan
        </h3>

        {/* Countdown cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-8">
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <div
              key={unit}
              className="glass-card rounded-2xl p-6 md:p-8 transform transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 0.1}s`,
                borderColor: colores.primario[200],
              }}
            >
              {/* Icono decorativo */}
              <div className="mb-4 flex justify-center">
                {unit === "days" && (
                  <Star
                    className="w-8 h-8"
                    style={{ color: colores.primario[400] }}
                  />
                )}
                {unit === "hours" && (
                  <Clock
                    className="w-8 h-8"
                    style={{ color: colores.primario[400] }}
                  />
                )}
                {unit === "minutes" && (
                  <Sparkles
                    className="w-8 h-8"
                    style={{ color: colores.primario[400] }}
                  />
                )}
                {unit === "seconds" && (
                  <Heart
                    className="w-8 h-8 animate-pulse-soft"
                    style={{ color: colores.primario[400] }}
                  />
                )}
              </div>

              {/* Número */}
              <div
                className="text-5xl md:text-6xl font-bold mb-2 font-serif"
                style={{ color: colores.primario[600] }}
              >
                {String(value).padStart(2, "0")}
              </div>

              {/* Etiqueta */}
              <div
                className="text-sm md:text-base font-medium uppercase tracking-wider"
                style={{ color: colores.textoClaro }}
              >
                {timeUnits[unit]}
              </div>

              {/* Línea decorativa */}
              <div
                className="mt-4 mx-auto w-12 h-1 rounded-full opacity-50"
                style={{ backgroundColor: colores.primario[300] }}
              />
            </div>
          ))}
        </div>

        {/* Mensaje motivacional */}
        <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto">
          <p
            className="text-lg md:text-xl italic"
            style={{ color: colores.texto }}
          >
            Cada momento que pasa nos acerca más a esta celebración especial
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Heart
              className="w-5 h-5"
              style={{ color: colores.primario[500] }}
            />
            <Heart
              className="w-5 h-5"
              style={{ color: colores.primario[400] }}
            />
            <Heart
              className="w-5 h-5"
              style={{ color: colores.primario[500] }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
