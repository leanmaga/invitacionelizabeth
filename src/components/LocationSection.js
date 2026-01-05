"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useQuinceaneraConfig } from "@/hooks/useQuinceaneraConfig";
import { useLoading } from "@/components/PageLoader"; // ✅ Importar el hook del loader

export default function LocationSection() {
  // ✅ Usar configuración centralizada
  const {
    lugar,
    direccion,
    telefono,
    horaInicio,
    horaFin,
    googleMapsUrl,
    wazeUrl,
    imagenesSalon,
    colores,
  } = useQuinceaneraConfig();

  // ✅ Hook del loader para reportar imágenes
  const { incrementLoadedImages } = useLoading();

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Reportar carga de imágenes al loader
  const handleImageLoad = () => {
    incrementLoadedImages();
    console.log(`✅ Imagen del salón cargada`);
  };

  const handleImageError = (imageSrc) => {
    console.warn(`⚠️ Error al cargar imagen del salón: ${imageSrc}`);
    incrementLoadedImages(); // También contar las que fallan
  };

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imagenesSalon.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [imagenesSalon.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % imagenesSalon.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + imagenesSalon.length) % imagenesSalon.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section
      id="location"
      className="py-20 min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colores.primario[50]} 0%, ${colores.secundario[50]} 50%, ${colores.primario[100]} 100%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 location-fade-in-up">
          <MapPin
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: colores.primario[600] }}
          />
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
            Ubicación del Evento
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Location Details */}
          <div className="space-y-8 location-fade-in-left">
            <div
              className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
              style={{
                border: `1px solid ${colores.primario[300]}66`,
              }}
            >
              <h3
                className="font-serif text-3xl font-bold mb-6"
                style={{ color: colores.primario[800] }}
              >
                {lugar}
              </h3>

              <div className="space-y-6">
                <div
                  className="flex items-start gap-4 p-4 rounded-2xl transition-colors location-scale-hover"
                  style={{
                    ":hover": {
                      backgroundColor: `${colores.primario[100]}80`,
                    },
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = `${colores.primario[100]}80`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <MapPin
                    className="w-6 h-6 flex-shrink-0 mt-1"
                    style={{ color: colores.primario[600] }}
                  />
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: colores.primario[800] }}
                    >
                      Dirección
                    </h4>
                    <p style={{ color: colores.primario[700] }}>{direccion}</p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-4 p-4 rounded-2xl transition-colors location-scale-hover"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = `${colores.primario[100]}80`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Phone
                    className="w-6 h-6 flex-shrink-0 mt-1"
                    style={{ color: colores.primario[600] }}
                  />
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: colores.primario[800] }}
                    >
                      Contacto
                    </h4>
                    <p style={{ color: colores.primario[700] }}>{telefono}</p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-4 p-4 rounded-2xl transition-colors location-scale-hover"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = `${colores.primario[100]}80`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Clock
                    className="w-6 h-6 flex-shrink-0 mt-1"
                    style={{ color: colores.primario[600] }}
                  />
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: colores.primario[800] }}
                    >
                      Horario
                    </h4>
                    <p style={{ color: colores.primario[700] }}>
                      Recepción: {horaInicio}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
                <button
                  className="flex-1 font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 border-2"
                  style={{
                    background: "linear-gradient(to right, #dc2626, #b91c1c)",
                    color: "#ffffff",
                    borderColor: "#991b1b",
                  }}
                  onClick={() => window.open(googleMapsUrl, "_blank")}
                >
                  <Image
                    src="/assets/gmaps.png"
                    alt="Google Maps"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  Google Maps
                </button>

                <button
                  className="flex-1 font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 border-2"
                  style={{
                    background: "linear-gradient(to right, #3b82f6, #2563eb)",
                    color: "#ffffff",
                    borderColor: "#1d4ed8",
                  }}
                  onClick={() => window.open(wazeUrl, "_blank")}
                >
                  <Image
                    src="/assets/waze.png"
                    alt="Waze"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  Waze
                </button>
              </div>
            </div>
          </div>

          {/* Image Slider */}
          <div className="relative location-fade-in-right">
            <div
              className="aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl relative"
              style={{
                background: `linear-gradient(135deg, ${colores.primario[100]}, ${colores.secundario[100]})`,
              }}
            >
              {/* Image Container */}
              <div className="relative w-full h-full overflow-hidden">
                <div
                  className="flex h-full location-slide-transition"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {imagenesSalon.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-full h-full flex-shrink-0"
                    >
                      <Image
                        src={image}
                        alt={`Imagen del salón ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="w-full h-full object-cover"
                        onLoad={handleImageLoad}
                        onError={() => handleImageError(image)}
                        priority={true}
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-20"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-20"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                  {imagenesSalon.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-white scale-125 shadow-lg"
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                      aria-label={`Ir a imagen ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/40 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
                  {currentSlide + 1} / {imagenesSalon.length}
                </div>

                {/* Overlay with salon info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 z-20">
                  <div className="text-white">
                    <h3 className="font-serif text-xl font-bold mb-1">
                      {lugar}
                    </h3>
                    <p className="text-sm opacity-90">
                      Conoce nuestras instalaciones
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 z-20">
                  <div
                    className="w-8 h-8 border-2 border-dashed rounded-full location-rotate-element"
                    style={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
