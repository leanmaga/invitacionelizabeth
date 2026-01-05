"use client";

import { useState, useEffect } from "react";
import {
  Send,
  User,
  Phone,
  Utensils,
  Heart,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useQuinceaneraConfig } from "@/hooks/useQuinceaneraConfig";
import { supabase } from "@/lib/supabase";

export default function RSVPSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dietary_restrictions: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingRSVP, setExistingRSVP] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const { nombre, whatsapp, telefono, fechaLimiteRSVP, colores } =
    useQuinceaneraConfig();

  if (!whatsapp) {
    console.error(
      "❌ NEXT_PUBLIC_WHATSAPP_NUMBER no está configurado en .env.local"
    );
  }

  const checkExistingRSVP = async (name, phone) => {
    if (!name.trim()) return null;

    try {
      return null;
    } catch (error) {
      console.error("Error checking existing RSVP:", error);
      return null;
    }
  };

  const saveToDatabase = async (data) => {
    try {
      const { error } = await supabase.from("rsvp_confirmations").insert([
        {
          name: data.name,
          email: "no-email@temp.com",
          phone: data.phone || null,
          guests: 1,
          dietary_restrictions: data.dietary_restrictions || null,
          message: data.message || null,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error("Error guardando en BD:", error);
      throw error;
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.name.trim().length >= 3) {
        setCheckingExisting(true);
        const existing = await checkExistingRSVP(formData.name, formData.phone);
        setExistingRSVP(existing);
        setCheckingExisting(false);

        if (existing) {
          setSubmitted(true);
          setIsFlipped(false);
        }
      } else {
        setExistingRSVP(null);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData.name, formData.phone]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    if (e.target.name === "name" && !e.target.value.trim()) {
      setSubmitted(false);
      setExistingRSVP(null);
      setIsFlipped(false);
    }
  };

  const formatWhatsAppMessage = (data) => {
    let message = `🎉 *CONFIRMACIÓN DE ASISTENCIA - QUINCEAÑERA ${nombre.toUpperCase()}*\n\n`;
    message += `👤 *Nombre:* ${data.name}\n`;
    message += `📱 *Teléfono:* ${data.phone || "No proporcionado"}\n`;

    if (data.dietary_restrictions) {
      message += `🍽️ *Restricciones alimentarias:* ${data.dietary_restrictions}\n`;
    }

    if (data.message) {
      message += `💌 *Mensaje para ${nombre}:* ${data.message}\n`;
    }

    message += `\n📅 *Fecha:* ${new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    return encodeURIComponent(message);
  };

  const sendToWhatsApp = (data) => {
    const message = formatWhatsAppMessage(data);
    const whatsappURL = `https://wa.me/${whatsapp}?text=${message}`;
    window.open(whatsappURL, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existing = await checkExistingRSVP(formData.name, formData.phone);
    if (existing) {
      setExistingRSVP(existing);
      setSubmitted(true);
      setIsFlipped(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await saveToDatabase(formData);
      sendToWhatsApp(formData);
      setSubmitted(true);
      setIsFlipped(false);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setError(
        "Hubo un error al guardar la confirmación. El WhatsApp se abrirá de todas formas."
      );

      sendToWhatsApp(formData);
      setSubmitted(true);
      setIsFlipped(false);
    } finally {
      setLoading(false);
    }
  };

  // PANTALLA DE CONFIRMACIÓN
  if (submitted || existingRSVP) {
    const rsvpData = existingRSVP || formData;
    const isExisting = !!existingRSVP;

    return (
      <div className="relative">
        {/* LAYOUT MÓVIL - Confirmación */}
        <div className="lg:hidden">
          <div
            className="relative h-screen w-full flex items-center justify-center"
            style={{
              backgroundImage: `url('/assets/1.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${colores.primario[50]}e6, ${colores.secundario[50]}d9, ${colores.primario[100]}cc)`,
              }}
            />

            <div className="relative z-10 text-center max-w-lg mx-auto px-6 rsvp-fade-in-up">
              <div className="flex justify-center mb-8">
                <div className="rsvp-bounce-icon">
                  {isExisting ? (
                    <CheckCircle
                      className="w-20 h-20"
                      style={{ color: colores.primario[600] }}
                    />
                  ) : (
                    <Heart
                      className="w-20 h-20"
                      style={{ color: colores.primario[600] }}
                    />
                  )}
                </div>
              </div>

              <h2
                className="font-Emilys_Candy font-bold text-4xl sm:text-5xl mb-6 leading-tight"
                style={{
                  color: colores.primario[800],
                  textShadow: `0 4px 20px ${colores.primario[600]}4d`,
                }}
              >
                {isExisting ? "¡Ya Confirmaste!" : "¡Confirmación Enviada!"}
              </h2>

              <p
                className="text-lg max-w-lg mx-auto mb-8 font-medium"
                style={{ color: `${colores.primario[900]}cc` }}
              >
                {isExisting
                  ? `Hola ${rsvpData.name}, ya confirmaste tu asistencia para la fiesta de ${nombre}. ¡Te esperamos!`
                  : `Tu confirmación se envió por WhatsApp. ¡No podemos esperar a celebrar contigo en la fiesta de ${nombre}!`}
              </p>

              {/* Mostrar datos confirmados */}
              <div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 mb-6 text-left"
                style={{
                  border: `1px solid ${colores.primario[300]}66`,
                }}
              >
                <div className="space-y-2 text-sm">
                  <div
                    className="flex items-center gap-2"
                    style={{ color: colores.primario[800] }}
                  >
                    <User className="w-4 h-4" />
                    <span>
                      <strong>Nombre:</strong> {rsvpData.name}
                    </span>
                  </div>
                  {rsvpData.phone && (
                    <div
                      className="flex items-center gap-2"
                      style={{ color: colores.primario[800] }}
                    >
                      <Phone className="w-4 h-4" />
                      <span>
                        <strong>Teléfono:</strong> {rsvpData.phone}
                      </span>
                    </div>
                  )}
                  {rsvpData.dietary_restrictions && (
                    <div
                      className="flex items-center gap-2"
                      style={{ color: colores.primario[800] }}
                    >
                      <Utensils className="w-4 h-4" />
                      <span>
                        <strong>Restricciones:</strong>{" "}
                        {rsvpData.dietary_restrictions}
                      </span>
                    </div>
                  )}
                  {rsvpData.message && (
                    <div
                      className="flex items-start gap-2"
                      style={{ color: colores.primario[800] }}
                    >
                      <Heart className="w-4 h-4 mt-1" />
                      <span>
                        <strong>Mensaje:</strong> {rsvpData.message}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setExistingRSVP(null);
                  setIsFlipped(false);
                  setFormData({
                    name: "",
                    phone: "",
                    dietary_restrictions: "",
                    message: "",
                  });
                }}
                className="px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-105"
                style={{
                  background: `linear-gradient(to right, ${colores.primario[200]}cc, ${colores.secundario[300]}cc)`,
                  color: colores.primario[800],
                  border: `1px solid ${colores.primario[400]}4d`,
                }}
              >
                Confirmar otra persona
              </button>
            </div>
          </div>
        </div>

        {/* LAYOUT DESKTOP - Confirmación */}
        <section className="hidden lg:block relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 lg:left-1/2 w-full lg:w-1/2">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url('/assets/1.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
          <div
            className="absolute inset-0 lg:w-1/2 lg:right-1/2"
            style={{
              background: `linear-gradient(135deg, ${colores.primario[50]}, ${colores.secundario[50]}, ${colores.primario[100]})`,
            }}
          />

          <div className="relative z-10 h-screen flex items-center">
            <div className="w-full h-full">
              <div className="grid lg:grid-cols-2 gap-0 h-full min-h-screen">
                <div className="flex items-center justify-center h-full min-h-screen lg:min-h-0 px-8">
                  <div className="text-center rsvp-scale-in">
                    <div className="flex justify-center mb-8">
                      <div className="rsvp-bounce-icon">
                        {isExisting ? (
                          <CheckCircle
                            className="w-24 h-24"
                            style={{ color: colores.primario[600] }}
                          />
                        ) : (
                          <Heart
                            className="w-24 h-24"
                            style={{ color: colores.primario[600] }}
                          />
                        )}
                      </div>
                    </div>

                    <h2
                      className="font-Emilys_Candy font-bold text-5xl md:text-6xl mb-6 leading-tight"
                      style={{
                        color: colores.primario[800],
                        textShadow: `0 4px 20px ${colores.primario[600]}4d`,
                      }}
                    >
                      {isExisting
                        ? "¡Ya Confirmaste!"
                        : "¡Confirmación Enviada!"}
                    </h2>

                    <p
                      className="text-xl max-w-lg mx-auto mb-8 font-medium"
                      style={{ color: `${colores.primario[900]}cc` }}
                    >
                      {isExisting
                        ? `Hola ${rsvpData.name}, ya confirmaste tu asistencia para la fiesta de ${nombre}. ¡Te esperamos!`
                        : `Tu confirmación se envió por WhatsApp. ¡No podemos esperar a celebrar contigo en la fiesta de ${nombre}!`}
                    </p>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setExistingRSVP(null);
                        setIsFlipped(false);
                        setFormData({
                          name: "",
                          phone: "",
                          dietary_restrictions: "",
                          message: "",
                        });
                      }}
                      className="px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-105"
                      style={{
                        background: `linear-gradient(to right, ${colores.primario[200]}cc, ${colores.secundario[300]}cc)`,
                        color: colores.primario[800],
                        border: `1px solid ${colores.primario[400]}4d`,
                      }}
                    >
                      Confirmar otra persona
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // FORMULARIO PRINCIPAL
  return (
    <div className="relative">
      {/* LAYOUT MÓVIL */}
      <div className="lg:hidden">
        <div className={`rsvp-flip-card ${isFlipped ? "flipped" : ""}`}>
          <div className="rsvp-flip-card-inner">
            {/* FRONT: Imagen con botón */}
            <div className="rsvp-flip-card-front">
              <div
                className="relative h-screen w-full flex items-center justify-center"
                style={{
                  backgroundImage: `url('/assets/1.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${colores.primario[900]}99, ${colores.primario[800]}b3, ${colores.primario[700]}cc)`,
                  }}
                />

                <div className="relative flex flex-col items-center z-10 text-center max-w-lg mx-auto px-6 rsvp-fade-in-up">
                  <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute inset-0 rsvp-pulse-glow">
                      <div
                        className="w-24 h-24 rounded-full blur-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${colores.primario[400]}80, ${colores.terciario[400]}80)`,
                        }}
                      />
                    </div>
                  </div>

                  <h2
                    className="font-Emilys_Candy font-bold text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight text-white"
                    style={{
                      textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Confirmá tu
                    <br />
                    Asistencia
                  </h2>

                  <p
                    className="text-lg mb-12 font-medium drop-shadow-lg"
                    style={{ color: `${colores.primario[100]}e6` }}
                  >
                    antes del{" "}
                    <span
                      className="font-bold"
                      style={{ color: colores.primario[200] }}
                    >
                      {fechaLimiteRSVP.split(",")[0]}
                    </span>
                    <br />
                    para que podamos preparar la fiesta perfecta de {nombre}
                  </p>

                  <button
                    onClick={() => setIsFlipped(true)}
                    className="rsvp-golden-button px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center gap-3 mx-auto"
                    style={{
                      background: `linear-gradient(135deg, ${colores.primario[400]}, ${colores.primario[500]}, ${colores.primario[600]})`,
                      color: colores.primario[900],
                    }}
                  >
                    <Send className="w-6 h-6" />
                    Confirmar Asistencia
                  </button>
                </div>
              </div>
            </div>

            {/* BACK: Formulario */}
            <div className="rsvp-flip-card-back">
              <div
                className="h-screen flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colores.primario[50]}, ${colores.secundario[50]}, ${colores.primario[100]})`,
                }}
              >
                <div className="w-full max-w-lg px-6">
                  <div
                    className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-2xl rsvp-scale-in"
                    style={{
                      border: `1px solid ${colores.primario[300]}66`,
                    }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3
                        className="font-bold text-lg flex items-center gap-2"
                        style={{ color: colores.primario[800] }}
                      >
                        <Send className="w-5 h-5" />
                        Confirmar Asistencia
                      </h3>
                      <button
                        onClick={() => setIsFlipped(false)}
                        className="transition-colors"
                        style={{ color: colores.primario[600] }}
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
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </button>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-700 mb-4">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label
                          className="block font-medium mb-2 flex items-center gap-2 text-sm"
                          style={{ color: colores.primario[800] }}
                        >
                          <User
                            className="w-4 h-4"
                            style={{ color: colores.primario[600] }}
                          />
                          Nombre Completo *
                          {checkingExisting && (
                            <Loader2
                              className="w-3 h-3 animate-spin"
                              style={{ color: colores.primario[600] }}
                            />
                          )}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="w-full px-3 py-2 bg-white/50 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm"
                          style={{
                            border: `1px solid ${colores.primario[300]}80`,
                            color: colores.primario[900],
                          }}
                          placeholder="Tu nombre completo"
                        />
                      </div>

                      <div>
                        <label
                          className="block font-medium mb-2 flex items-center gap-2 text-sm"
                          style={{ color: colores.primario[800] }}
                        >
                          <Phone
                            className="w-4 h-4"
                            style={{ color: colores.primario[600] }}
                          />
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-full px-3 py-2 bg-white/50 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm"
                          style={{
                            border: `1px solid ${colores.primario[300]}80`,
                            color: colores.primario[900],
                          }}
                          placeholder={telefono}
                        />
                      </div>

                      <div>
                        <label
                          className="block font-medium mb-2 flex items-center gap-2 text-sm"
                          style={{ color: colores.primario[800] }}
                        >
                          <Utensils
                            className="w-4 h-4"
                            style={{ color: colores.primario[600] }}
                          />
                          Restricciones Alimentarias
                        </label>
                        <input
                          type="text"
                          name="dietary_restrictions"
                          value={formData.dietary_restrictions}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-full px-3 py-2 bg-white/50 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm"
                          style={{
                            border: `1px solid ${colores.primario[300]}80`,
                            color: colores.primario[900],
                          }}
                          placeholder="Vegetariano, sin gluten, alergias, etc."
                        />
                      </div>

                      <div>
                        <label
                          className="block font-medium mb-2 flex items-center gap-2 text-sm"
                          style={{ color: colores.primario[800] }}
                        >
                          <Heart
                            className="w-4 h-4"
                            style={{ color: colores.primario[600] }}
                          />
                          Mensaje para {nombre}
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={2}
                          disabled={loading}
                          className="w-full px-3 py-2 bg-white/50 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none text-sm"
                          style={{
                            border: `1px solid ${colores.primario[300]}80`,
                            color: colores.primario[900],
                          }}
                          placeholder={`Comparte tus mejores deseos para ${nombre}...`}
                        />
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.name.trim()}
                        className="w-full px-4 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-105"
                        style={{
                          background: `linear-gradient(to right, ${colores.primario[400]}, ${colores.primario[500]}, ${colores.terciario[400]})`,
                          color: colores.primario[900],
                        }}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {loading ? "Enviando..." : "¡Confirmar Asistencia!"}
                      </button>

                      <div
                        className="mt-4 p-3 rounded-xl"
                        style={{
                          background: `linear-gradient(to right, ${colores.primario[100]}cc, ${colores.secundario[100]}cc)`,
                          border: `1px solid ${colores.primario[300]}66`,
                        }}
                      >
                        <p
                          className="text-center text-xs"
                          style={{ color: `${colores.primario[800]}cc` }}
                        >
                          <Calendar className="inline w-3 h-3 mr-1" />
                          <strong>Fecha límite:</strong> {fechaLimiteRSVP}
                          <br />
                          <Phone className="inline w-3 h-3 mr-1 mt-1" />
                          Contacto: {telefono}
                          <br />
                          <span
                            className="text-xs mt-1 block"
                            style={{ color: `${colores.primario[700]}99` }}
                          >
                            Tu confirmación se enviará por WhatsApp
                            automáticamente
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYOUT DESKTOP */}
      <section
        id="rsvp"
        className="hidden lg:block relative min-h-screen overflow-hidden"
      >
        <div className="absolute inset-0 lg:left-1/2 w-full lg:w-1/2">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/assets/1.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colores.primario[900]}99, ${colores.primario[800]}b3, ${colores.primario[700]}cc)`,
            }}
          />
        </div>

        <div
          className="absolute inset-0 lg:w-1/2 lg:right-1/2"
          style={{
            background: `linear-gradient(135deg, ${colores.primario[50]}, ${colores.secundario[50]}, ${colores.primario[100]})`,
          }}
        />

        <div className="relative z-10 h-screen flex items-center">
          <div className="w-full h-full">
            <div className="grid lg:grid-cols-2 gap-0 h-full min-h-screen">
              <div className="flex items-center justify-center h-full min-h-screen lg:min-h-0 px-8">
                <div className="w-full max-w-lg">
                  <div className="text-center mb-8 rsvp-fade-in-up">
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className="absolute inset-0 rsvp-pulse-glow">
                        <div
                          className="w-20 h-20 rounded-full blur-2xl"
                          style={{
                            background: `linear-gradient(135deg, ${colores.primario[400]}80, ${colores.terciario[400]}80)`,
                          }}
                        />
                      </div>
                    </div>

                    <h2
                      className="font-Emilys_Candy font-bold text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight"
                      style={{
                        color: colores.primario[800],
                        textShadow: `0 4px 20px ${colores.primario[600]}4d`,
                      }}
                    >
                      Confirmá tu
                      <br />
                      Asistencia
                    </h2>

                    <p
                      className="text-lg max-w-lg mx-auto mb-6 font-medium"
                      style={{ color: `${colores.primario[900]}cc` }}
                    >
                      antes del{" "}
                      <span
                        className="font-bold"
                        style={{ color: colores.primario[700] }}
                      >
                        {fechaLimiteRSVP.split(",")[0]}
                      </span>{" "}
                      para que podamos preparar la fiesta perfecta de {nombre}
                    </p>
                  </div>

                  <div
                    className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-2xl rsvp-scale-in"
                    style={{
                      border: `1px solid ${colores.primario[300]}66`,
                    }}
                  >
                    <div>
                      {error && (
                        <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-700 mb-4">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{error}</span>
                        </div>
                      )}

                      <div className="mb-4">
                        <label
                          className="block font-medium mb-2 flex items-center gap-2"
                          style={{ color: colores.primario[800] }}
                        >
                          <User
                            className="w-4 h-4"
                            style={{ color: colores.primario[600] }}
                          />
                          <span className="text-sm">Nombre Completo *</span>
                          {checkingExisting && (
                            <Loader2
                              className="w-3 h-3 animate-spin"
                              style={{ color: colores.primario[600] }}
                            />
                          )}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="w-full px-3 py-2 bg-white/50 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all backdrop-blur-sm disabled:opacity-50 text-sm"
                          style={{
                            border: `1px solid ${colores.primario[300]}80`,
                            color: colores.primario[900],
                          }}
                          placeholder="Tu nombre completo"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          className="block font-medium mb-2 flex items-center gap-2"
                          style={{ color: colores.primario[800] }}
                        >
                          <Phone
                            className="w-4 h-4"
                            style={{ color: colores.primario[600] }}
                          />
                          <span className="text-sm">Teléfono</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-full px-3 py-2 bg-white/50 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all backdrop-blur-sm disabled:opacity-50 text-sm"
                          style={{
                            border: `1px solid ${colores.primario[300]}80`,
                            color: colores.primario[900],
                          }}
                          placeholder={telefono}
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          className="block font-medium mb-2 flex items-center gap-2"
                          style={{ color: colores.primario[800] }}
                        >
                          <Utensils
                            className="w-4 h-4"
                            style={{ color: colores.primario[600] }}
                          />
                          <span className="text-sm">
                            Restricciones Alimentarias
                          </span>
                        </label>
                        <input
                          type="text"
                          name="dietary_restrictions"
                          value={formData.dietary_restrictions}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-full px-3 py-2 bg-white/50 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all backdrop-blur-sm disabled:opacity-50 text-sm"
                          style={{
                            border: `1px solid ${colores.primario[300]}80`,
                            color: colores.primario[900],
                          }}
                          placeholder="Vegetariano, sin gluten, alergias, etc."
                        />
                      </div>

                      <div className="mb-6">
                        <label
                          className="block font-medium mb-2 flex items-center gap-2"
                          style={{ color: colores.primario[800] }}
                        >
                          <Heart
                            className="w-4 h-4"
                            style={{ color: colores.primario[600] }}
                          />
                          <span className="text-sm">
                            Mensaje Especial para {nombre}
                          </span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={3}
                          disabled={loading}
                          className="w-full px-3 py-2 bg-white/50 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none backdrop-blur-sm disabled:opacity-50 text-sm"
                          style={{
                            border: `1px solid ${colores.primario[300]}80`,
                            color: colores.primario[900],
                          }}
                          placeholder={`Comparte tus mejores deseos para ${nombre}...`}
                        />
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.name.trim()}
                        className="w-full px-6 py-3 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl hover:scale-105"
                        style={{
                          background: `linear-gradient(to right, ${colores.primario[400]}, ${colores.primario[500]}, ${colores.terciario[400]})`,
                          color: colores.primario[900],
                          boxShadow: loading
                            ? ""
                            : `0 0 30px ${colores.primario[400]}66`,
                        }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            ¡Confirmar Asistencia!
                          </>
                        )}
                      </button>

                      <div
                        className="mt-4 p-3 rounded-xl"
                        style={{
                          background: `linear-gradient(to right, ${colores.primario[100]}cc, ${colores.secundario[100]}cc)`,
                          border: `1px solid ${colores.primario[300]}66`,
                        }}
                      >
                        <p
                          className="text-center text-xs"
                          style={{ color: `${colores.primario[800]}cc` }}
                        >
                          <Calendar className="inline w-3 h-3 mr-1" />
                          <strong>Fecha límite:</strong> {fechaLimiteRSVP}
                          <br />
                          <Phone className="inline w-3 h-3 mr-1 mt-1" />
                          Contacto: {telefono}
                          <br />
                          <span
                            className="text-xs mt-1 block"
                            style={{ color: `${colores.primario[700]}99` }}
                          >
                            Tu confirmación se enviará por WhatsApp
                            automáticamente
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
