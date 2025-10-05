"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Sparkles,
  Crown,
  Gift,
  Copy,
  Check,
} from "lucide-react";
import { useQuinceaneraConfig } from "@/hooks/useQuinceaneraConfig";

export default function DelicateEventDetails() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [copied, setCopied] = useState(false);

  // ✅ Usar configuración centralizada
  const {
    fechaEvento,
    horaEvento,
    lugar,
    direccion,
    alias,
    mostrarRegalos,
    mensajeRegalos,
    colores,
  } = useQuinceaneraConfig();

  // Función para copiar el alias al portapapeles
  const handleCopyAlias = async () => {
    if (alias) {
      try {
        await navigator.clipboard.writeText(alias);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error al copiar:", err);
      }
    }
  };

  // Configuración de las cards de detalles
  const details = [
    {
      icon: Calendar,
      title: "Fecha",
      value: fechaEvento,
      color: `from-[${colores.primario[400]}] to-[${colores.terciario[400]}]`,
      gradient: "bg-gradient-to-br from-[#e47783] to-[#e8b4b8]",
    },
    {
      icon: Clock,
      title: "Hora",
      value: horaEvento,
      color: `from-[${colores.terciario[400]}] to-[${colores.primario[400]}]`,
      gradient: "bg-gradient-to-br from-[#e8b4b8] to-[#e47783]",
    },
    {
      icon: MapPin,
      title: "Lugar",
      value: lugar,
      description: direccion,
      color: `from-[${colores.primario[500]}] to-[${colores.terciario[400]}]`,
      gradient: "bg-gradient-to-br from-[#d4989d] to-[#e8b4b8]",
    },
  ];

  return (
    <section
      className="relative py-8 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colores.primario[50]} 0%, ${colores.fondo} 50%, ${colores.secundario[100]} 100%)`,
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sparkles flotantes con colores rosa */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            <Sparkles
              className="w-3 h-3 opacity-40"
              style={{ color: colores.primario[300] }}
            />
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header elegante y delicado */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-3">
            <div
              className="absolute inset-0 blur-lg rounded-full"
              style={{
                background: `linear-gradient(to right, ${colores.primario[200]}80, ${colores.terciario[200]}80)`,
              }}
            />
            <Crown
              className="relative w-6 h-6 mx-auto"
              style={{ color: colores.primario[600] }}
            />
          </div>

          <h2
            className="font-serif text-xl md:text-2xl font-semibold mb-2"
            style={{
              background: `linear-gradient(to right, ${colores.primario[700]}, ${colores.terciario[600]})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Detalles del Evento
          </h2>

          <div
            className="w-12 h-px mx-auto rounded-full"
            style={{
              background: `linear-gradient(to right, ${colores.primario[400]}, ${colores.terciario[400]})`,
            }}
          />
        </div>

        {/* Cards de información - compactas y elegantes */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {details.map((detail, index) => {
            const IconComponent = detail.icon;
            return (
              <div
                key={detail.title}
                className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                style={{
                  border: `1px solid ${colores.primario[200]}80`,
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Icono */}
                <div className="text-center mb-3">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 ${detail.gradient} rounded-xl mb-2 shadow-md`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>

                  <h3
                    className="font-serif text-base font-semibold"
                    style={{ color: colores.primario[800] }}
                  >
                    {detail.title}
                  </h3>
                </div>

                {/* Contenido */}
                <div className="text-center space-y-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: colores.primario[700] }}
                  >
                    {detail.value}
                  </p>

                  {detail.description && (
                    <p
                      className="text-xs"
                      style={{ color: colores.primario[600] }}
                    >
                      {detail.description}
                    </p>
                  )}
                </div>

                {/* Línea decorativa */}
                <div className="mt-3 flex justify-center">
                  <div
                    className="h-0.5 w-8 rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${colores.primario[400]}, ${colores.terciario[400]})`,
                    }}
                  />
                </div>

                {/* Efectos hover sutiles */}
                {hoveredCard === index && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${colores.primario[100]}40, ${colores.terciario[100]}40)`,
                    }}
                  >
                    <div className="absolute top-2 right-2">
                      <Sparkles
                        className="w-3 h-3 animate-spin"
                        style={{ color: colores.primario[500] }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sección de regalos - delicada (condicional) */}
        {mostrarRegalos && (
          <div
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm max-w-2xl mx-auto"
            style={{
              border: `1px solid ${colores.primario[200]}80`,
            }}
          >
            {/* Header de regalos */}
            <div className="mb-4">
              <div className="relative inline-block mb-2">
                <div
                  className="absolute inset-0 blur-md rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${colores.primario[200]}80, ${colores.terciario[200]}80)`,
                  }}
                />
                <Gift
                  className="relative w-6 h-6 mx-auto"
                  style={{ color: colores.primario[600] }}
                />
              </div>

              <h3
                className="font-serif text-lg font-semibold mb-2"
                style={{
                  background: `linear-gradient(to right, ${colores.primario[700]}, ${colores.terciario[600]})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Un Detalle Especial
              </h3>
            </div>

            {/* Contenido de regalos */}
            <div className="space-y-3 mb-4">
              <p
                className="text-sm font-medium"
                style={{ color: colores.primario[800] }}
              >
                {mensajeRegalos ||
                  "Podés dejar tu obsequio de manera monetaria al:"}
              </p>

              {/* Alias destacado con botón de copiar */}
              {alias && (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="inline-block rounded-lg px-3 py-1.5 shadow-sm"
                    style={{
                      backgroundColor: `${colores.primario[50]}cc`,
                      border: `1px solid ${colores.primario[200]}80`,
                    }}
                  >
                    <div
                      className="text-base font-bold"
                      style={{
                        background: `linear-gradient(to right, ${colores.primario[700]}, ${colores.terciario[600]})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {alias}
                    </div>
                  </div>

                  {/* Botón de copiar */}
                  <button
                    onClick={handleCopyAlias}
                    className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
                    style={{
                      backgroundColor: copied
                        ? colores.primario[500]
                        : `${colores.primario[100]}cc`,
                      border: `1px solid ${colores.primario[200]}80`,
                    }}
                    aria-label="Copiar alias"
                  >
                    {copied ? (
                      <Check
                        className="w-4 h-4 text-white animate-bounce"
                        style={{ animationIterationCount: 1 }}
                      />
                    ) : (
                      <Copy
                        className="w-4 h-4 transition-colors duration-300"
                        style={{ color: colores.primario[600] }}
                      />
                    )}

                    {/* Tooltip */}
                    <div
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md"
                      style={{
                        backgroundColor: colores.primario[700],
                        color: "white",
                      }}
                    >
                      {copied ? "¡Copiado!" : "Copiar"}
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Decoración final */}
            <div className="flex justify-center items-center gap-2">
              <Heart
                className="w-3 h-3 animate-pulse"
                style={{ color: colores.primario[500] }}
              />
              <div className="flex gap-1">
                <div
                  className="w-1 h-1 rounded-full animate-pulse"
                  style={{
                    backgroundColor: colores.primario[500],
                    animationDelay: "0s",
                  }}
                />
                <div
                  className="w-1 h-1 rounded-full animate-pulse"
                  style={{
                    backgroundColor: colores.primario[500],
                    animationDelay: "0.2s",
                  }}
                />
                <div
                  className="w-1 h-1 rounded-full animate-pulse"
                  style={{
                    backgroundColor: colores.primario[500],
                    animationDelay: "0.4s",
                  }}
                />
              </div>
              <Heart
                className="w-3 h-3 animate-pulse"
                style={{ color: colores.primario[500] }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Estilos adicionales para animaciones suaves */}
      <style jsx>{`
        @keyframes float-sparkle {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  );
}
