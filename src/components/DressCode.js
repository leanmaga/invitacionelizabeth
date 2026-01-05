"use client";

import { useState, useEffect } from "react";
import {
  Crown,
  Waves,
  Sun,
  Sparkles,
  Heart,
  Star,
  Gem,
  Flower2,
} from "lucide-react";
import Image from "next/image";
import {
  useQuinceaneraConfig,
  useDressCode,
} from "@/hooks/useQuinceaneraConfig";

export default function DressCodeSection() {
  const [activeCategory, setActiveCategory] = useState("formal");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [particles, setParticles] = useState([]);

  // ✅ Usar configuración centralizada
  const { colores } = useQuinceaneraConfig();
  const dressCode = useDressCode();

  // Generar partículas flotantes
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const formalStyles = {
    caballeros: [
      {
        title: "Elegante",
        image: "/assets/manTraje.jpeg",
      },
    ],
    damas: [
      {
        title: "Elegante",
        image: "/assets/womanTraje.jpeg",
      },
    ],
  };

  const categories = {
    formal: {
      title: "Elegante sport",
      subtitle: "Atuendo sofisticado y cómodo",
      icon: Crown,
      colorClass: "from-rose-400 to-rose-500",
    },
    pileta: {
      title: "Diversión Acuática",
      subtitle: "Ropa informal para andar por el parque",
      icon: Waves,
      colorClass: "from-blue-400 to-cyan-500",
      items: {
        general: {
          title: "Esenciales para la Pileta",
          icon: Sun,
          items: [
            "Traje de baño o bikini",
            "Toallón personal",
            "Ojotas o sandalias",
            "Protector solar",
            "Gorra o sombrero",
            "Ropa de cambio",
          ],
          tips: "No olvides traer una bolsa impermeable para tu ropa seca",
        },
      },
    },
  };

  return (
    <section
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colores.primario[50]} 0%, ${colores.secundario[50]} 50%, ${colores.primario[100]} 100%)`,
      }}
    >
      {/* Partículas flotantes de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 dresscode-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              "--delay": `${particle.delay}s`,
              "--duration": `${particle.duration}s`,
            }}
          >
            <Star
              className="w-full h-full opacity-40"
              style={{ color: colores.primario[300] }}
            />
          </div>
        ))}
      </div>

      {/* Sparkles decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute dresscode-sparkle-particle"
            style={{
              left: `${20 + i * 10}%`,
              top: `${10 + (i % 3) * 30}%`,
              "--delay": `${i * 0.5}s`,
            }}
          >
            <Sparkles
              className="w-4 h-4 opacity-60"
              style={{ color: colores.primario[400] }}
            />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Espectacular */}
        <div className="text-center mb-16 dresscode-slide-up">
          <div className="relative inline-block mb-6">
            <div
              className="absolute inset-0 blur-3xl"
              style={{
                background: `linear-gradient(to right, ${colores.primario[400]}30, ${colores.terciario[400]}30)`,
              }}
            />
            <Crown
              className="relative w-16 h-16 mx-auto"
              style={{ color: colores.primario[600] }}
            />
          </div>

          <h2
            className="font-Emilys_Candy text-5xl md:text-7xl font-bold mb-8 p-4 dresscode-shimmer-text"
            style={{
              background: `linear-gradient(90deg, ${colores.primario[500]} 0%, ${colores.terciario[400]} 50%, ${colores.primario[500]} 100%)`,
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Código de Vestimenta
          </h2>
        </div>

        {/* Navegación de Categorías */}
        <div
          className="flex justify-center mb-12 dresscode-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="glass-morphism rounded-full p-2 shadow-2xl">
            <div className="flex space-x-2">
              {Object.entries(categories).map(([key, category]) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-500 flex items-center gap-3 ${
                      activeCategory === key
                        ? `bg-gradient-to-r ${category.colorClass} text-white shadow-xl scale-110`
                        : "hover:bg-white/50"
                    }`}
                    style={{
                      color:
                        activeCategory === key
                          ? "#000000"
                          : colores.primario[700],
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="hidden sm:block">{category.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenido de la Categoría Activa */}
        <div className="dresscode-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="text-center mb-12">
            <h3
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: colores.primario[800] }}
            >
              {categories[activeCategory].title}
            </h3>
            <p className="text-xl" style={{ color: colores.primario[600] }}>
              {categories[activeCategory].subtitle}
            </p>
          </div>

          {/* Cards para Categoría Formal */}
          {activeCategory === "formal" && (
            <div className="max-w-7xl mx-auto">
              {/* Grid de Cards para Caballeros y Damas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Card Caballeros */}
                <div className="glass-morphism rounded-2xl overflow-hidden shadow-2xl dresscode-card-hover h-full dresscode-slide-left">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      width={600}
                      height={800}
                      src={formalStyles.caballeros[0].image}
                      alt={formalStyles.caballeros[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 text-center"
                      style={{
                        background: `linear-gradient(to top, ${colores.primario[900]}cc, transparent)`,
                      }}
                    >
                      <h4 className="text-2xl font-bold text-white">
                        Para Caballeros
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Card Damas */}
                <div className="glass-morphism rounded-2xl overflow-hidden shadow-2xl dresscode-card-hover h-full dresscode-slide-right">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      width={600}
                      height={800}
                      src={formalStyles.damas[0].image}
                      alt={formalStyles.damas[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 text-center"
                      style={{
                        background: `linear-gradient(to top, ${colores.primario[900]}cc, transparent)`,
                      }}
                    >
                      <h4 className="text-2xl font-bold text-white">
                        Para Damas
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cards para Categoría Pileta */}
          {activeCategory === "pileta" && (
            <div className="flex justify-center">
              <div className="max-w-lg">
                {Object.entries(categories[activeCategory].items).map(
                  ([itemKey, item], index) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={itemKey}
                        className="dresscode-card-hover glass-morphism rounded-3xl p-8 shadow-2xl relative dresscode-slide-up"
                        style={{ animationDelay: `${0.6 + index * 0.2}s` }}
                        onMouseEnter={() => setHoveredCard(itemKey)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        {/* Header de la Card */}
                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className={`p-4 rounded-2xl bg-gradient-to-r ${categories[activeCategory].colorClass}`}
                          >
                            <ItemIcon className="w-8 h-8 text-white" />
                          </div>
                          <h4
                            className="text-2xl font-bold"
                            style={{ color: colores.primario[800] }}
                          >
                            {item.title}
                          </h4>
                        </div>

                        {/* Lista de Items */}
                        <div className="space-y-3 mb-6">
                          {item.items.map((listItem, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
                              style={{
                                backgroundColor:
                                  hoveredCard === itemKey
                                    ? `${colores.primario[100]}50`
                                    : "transparent",
                              }}
                            >
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{
                                  background: `linear-gradient(to right, ${colores.primario[400]}, ${colores.terciario[400]})`,
                                }}
                              />
                              <span
                                className="font-medium"
                                style={{ color: colores.primario[800] }}
                              >
                                {listItem}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Tip especial */}
                        <div
                          className="rounded-2xl p-4"
                          style={{
                            background: `linear-gradient(to right, ${colores.primario[100]}80, ${colores.secundario[100]}80)`,
                            border: `1px solid ${colores.primario[300]}50`,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Heart
                              className="w-5 h-5 flex-shrink-0 mt-0.5"
                              style={{ color: colores.primario[600] }}
                            />
                            <p
                              className="text-sm italic"
                              style={{ color: colores.primario[700] }}
                            >
                              <span className="font-semibold">
                                Tip especial:
                              </span>{" "}
                              {item.tips}
                            </p>
                          </div>
                        </div>

                        {/* Efecto hover especial */}
                        {hoveredCard === itemKey && (
                          <div
                            className="absolute inset-0 rounded-3xl pointer-events-none"
                            style={{
                              background: `linear-gradient(135deg, ${colores.primario[400]}10, ${colores.terciario[400]}10)`,
                            }}
                          >
                            <div className="absolute top-4 right-4">
                              <Sparkles
                                className="w-6 h-6 animate-spin"
                                style={{ color: colores.primario[500] }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mensaje Final Inspirador */}
        <div
          className="text-center mt-16 dresscode-slide-up"
          style={{ animationDelay: "1s" }}
        >
          <div className="glass-morphism rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Flower2
                className="w-8 h-8"
                style={{ color: colores.primario[600] }}
              />
              <Gem
                className="w-10 h-10"
                style={{ color: colores.primario[500] }}
              />
              <Flower2
                className="w-8 h-8"
                style={{ color: colores.primario[600] }}
              />
            </div>

            <h3
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: colores.primario[800] }}
            >
              Una Celebración Inolvidable Te Espera
            </h3>

            <p
              className="text-lg leading-relaxed"
              style={{ color: colores.primario[700] }}
            >
              Recuerda que lo más importante es que te sientas cómodo y seguro
              para disfrutar al máximo de esta celebración única. Tu presencia
              es el mejor regalo y tu sonrisa será el accesorio más hermoso del
              día.
            </p>

            <div className="flex items-center justify-center gap-4 mt-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 dresscode-sparkle-particle"
                  style={{
                    color: colores.primario[500],
                    "--delay": `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
