"use client";

import { useState, useEffect } from "react";
import {
  Music,
  Heart,
  Send,
  Headphones,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuinceaneraConfig } from "@/hooks/useQuinceaneraConfig";

export default function MusicRequests() {
  const [songRequest, setSongRequest] = useState("");
  const [artistRequest, setArtistRequest] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [dbSongs, setDbSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const { colores } = useQuinceaneraConfig();

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoadingSongs(true);
      const { data, error } = await supabase
        .from("song_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error loading songs:", error);
        throw error;
      }

      setDbSongs(data || []);
    } catch (error) {
      console.error("Error loading songs:", error);
      setDbSongs([]);
    } finally {
      setLoadingSongs(false);
    }
  };

  const handleSubmit = async () => {
    if (!songRequest.trim()) return;

    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("song_requests")
        .insert([
          {
            song_name: songRequest.trim(),
            artist_name: artistRequest.trim() || null,
            message: message.trim() || null,
            ip_address: null,
          },
        ])
        .select();

      if (error) {
        console.error("Error de Supabase:", error);
        throw error;
      }

      if (data && data[0]) {
        setDbSongs((prev) => [data[0], ...prev]);
      }

      setSubmitted(true);
      setSongRequest("");
      setArtistRequest("");
      setMessage("");

      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
        setIsFlipped(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting song:", error);
      let errorMessage =
        "Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.";

      if (error.message.includes("policy")) {
        errorMessage = "Error de permisos en la base de datos";
      } else if (error.message.includes("network")) {
        errorMessage = "Error de conexión a internet";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSongsCountText = (count) => {
    if (count === 0) return "0 canciones";
    if (count === 1) return "1 canción";
    return `${count} canciones`;
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleFlipBack = () => {
    setIsFlipped(false);
    setShowForm(false);
  };

  return (
    <div className="relative">
      {/* LAYOUT MÓVIL */}
      <div className="lg:hidden">
        <div className={`music-flip-card ${isFlipped ? "flipped" : ""}`}>
          <div className="music-flip-card-inner">
            {/* FRONT: Imagen con botón */}
            <div className="music-flip-card-front">
              <div
                className="relative h-screen w-full flex items-center justify-center"
                style={{
                  backgroundImage: `url('/assets/8.jpg')`,
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

                <div className="relative flex flex-col items-center z-10 text-center max-w-lg mx-auto px-6">
                  <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute inset-0">
                      <div
                        className="w-24 h-24 rounded-full blur-2xl animate-pulse"
                        style={{
                          background: `linear-gradient(135deg, ${colores.primario[400]}80, ${colores.terciario[400]}80)`,
                        }}
                      />
                    </div>
                    <Music
                      className="w-12 h-12 relative z-10"
                      style={{ color: colores.primario[100] }}
                    />
                    <div className="absolute -top-2 -right-2 music-rotate-sparkles">
                      <Sparkles
                        className="w-6 h-6"
                        style={{ color: colores.terciario[300] }}
                      />
                    </div>
                  </div>

                  <h2
                    className="font-Emilys_Candy font-bold text-4xl sm:text-5xl mb-6 leading-tight"
                    style={{
                      color: colores.primario[100],
                      textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Pide tu Canción
                    <br />
                    <span className="font-Emilys_Candy text-3xl sm:text-4xl">
                      Favorita
                    </span>
                  </h2>

                  <p
                    className="text-lg mb-12 font-medium drop-shadow-lg"
                    style={{ color: `${colores.primario[100]}e6` }}
                  >
                    Ayúdanos a crear la playlist perfecta
                    <br />
                    ¡Tu canción favorita puede ser la que haga bailar a todos!
                  </p>

                  <button
                    onClick={() => setIsFlipped(true)}
                    className="music-golden-button px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center gap-3 mx-auto"
                    style={{
                      background: `linear-gradient(135deg, ${colores.primario[400]}, ${colores.primario[500]}, ${colores.primario[600]})`,
                      color: colores.primario[900],
                      boxShadow: `0 8px 32px ${colores.primario[400]}4d`,
                    }}
                  >
                    <Music className="w-6 h-6" />
                    Agregar Mi Canción
                  </button>
                </div>
              </div>
            </div>

            {/* BACK: Formulario y lista */}
            <div className="music-flip-card-back">
              <div
                className="h-screen flex items-center justify-center overflow-y-auto"
                style={{
                  background: `linear-gradient(135deg, ${colores.primario[50]}, ${colores.secundario[50]}, ${colores.primario[100]})`,
                }}
              >
                <div className="w-full max-w-lg px-6 py-8">
                  {!showForm ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3
                          className="font-bold text-lg flex items-center gap-2"
                          style={{ color: colores.primario[800] }}
                        >
                          <Music className="w-5 h-5" />
                          Playlist de la Fiesta
                        </h3>
                        <button
                          onClick={handleFlipBack}
                          className="transition-colors"
                          style={{ color: colores.primario[600] }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color =
                              colores.primario[800])
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                              colores.primario[600])
                          }
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

                      <div className="text-center">
                        <button
                          onClick={handleShowForm}
                          className="inline-flex items-center gap-3 rounded-full px-6 py-3 font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
                          style={{
                            background: `linear-gradient(to right, ${colores.primario[400]}, ${colores.primario[500]}, ${colores.terciario[400]})`,
                            color: colores.primario[900],
                          }}
                        >
                          <Music className="w-5 h-5" />
                          Agregar Mi Canción
                        </button>
                      </div>

                      <div className="text-center">
                        <div
                          className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-full px-6 py-3"
                          style={{
                            border: `1px solid ${colores.primario[300]}66`,
                          }}
                        >
                          <Headphones
                            className="w-5 h-5"
                            style={{ color: colores.primario[700] }}
                          />
                          <span
                            className="font-semibold"
                            style={{ color: colores.primario[800] }}
                          >
                            {loadingSongs
                              ? "Cargando..."
                              : getSongsCountText(dbSongs.length)}{" "}
                            agregadas
                          </span>
                        </div>
                      </div>

                      {loadingSongs ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2
                            className="w-8 h-8 animate-spin"
                            style={{ color: colores.primario[600] }}
                          />
                        </div>
                      ) : dbSongs.length > 0 ? (
                        <div
                          className="bg-white/40 backdrop-blur-sm rounded-2xl p-4"
                          style={{
                            border: `1px solid ${colores.primario[300]}66`,
                          }}
                        >
                          <h4
                            className="font-bold text-sm mb-3 flex items-center gap-2"
                            style={{ color: colores.primario[800] }}
                          >
                            <Music className="w-4 h-4" />
                            Últimas Canciones
                          </h4>
                          <div className="space-y-2 max-h-60 overflow-y-auto music-scrollbar">
                            {dbSongs.slice(0, 8).map((song, index) => (
                              <div
                                key={song.id}
                                className="flex items-center gap-2 p-3 bg-white/30 rounded-lg transition-opacity duration-300 music-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{
                                    background: `linear-gradient(to right, ${colores.primario[500]}, ${colores.terciario[400]})`,
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="font-medium truncate text-sm"
                                    style={{ color: colores.primario[900] }}
                                  >
                                    {song.song_name}
                                  </p>
                                  {song.artist_name && (
                                    <p
                                      className="text-xs truncate"
                                      style={{ color: colores.primario[700] }}
                                    >
                                      {song.artist_name}
                                    </p>
                                  )}
                                  {song.message && (
                                    <p
                                      className="text-xs truncate italic mt-1"
                                      style={{ color: colores.primario[600] }}
                                    >
                                      {song.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Music
                            className="w-12 h-12 mx-auto mb-4 opacity-60"
                            style={{ color: colores.primario[400] }}
                          />
                          <p style={{ color: colores.primario[600] }}>
                            Aún no hay canciones solicitadas. ¡Sé el primero!
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 relative shadow-2xl"
                      style={{
                        border: `1px solid ${colores.primario[300]}66`,
                      }}
                    >
                      <button
                        onClick={handleCloseForm}
                        className="absolute top-4 right-4 w-8 h-8 bg-white/40 hover:bg-white/60 rounded-full flex items-center justify-center transition-all text-sm hover:rotate-90"
                        style={{ color: colores.primario[800] }}
                      >
                        ✕
                      </button>

                      <div className="mb-4">
                        <h3
                          className="font-bold text-lg flex items-center gap-2"
                          style={{ color: colores.primario[800] }}
                        >
                          <Music className="w-5 h-5" />
                          Tu Canción Favorita
                        </h3>
                      </div>

                      {!submitted ? (
                        <div className="space-y-4">
                          {error && (
                            <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-700">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs">{error}</span>
                            </div>
                          )}

                          <div>
                            <label
                              className="block font-medium mb-2 text-sm"
                              style={{ color: colores.primario[800] }}
                            >
                              Nombre de la Canción *
                            </label>
                            <input
                              type="text"
                              value={songRequest}
                              onChange={(e) => setSongRequest(e.target.value)}
                              className="w-full px-3 py-2 bg-white/50 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm"
                              style={{
                                border: `1px solid ${colores.primario[300]}80`,
                                color: colores.primario[900],
                              }}
                              placeholder="Ej: Soy Cordobés"
                              disabled={loading}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleSubmit()
                              }
                            />
                          </div>

                          <div>
                            <label
                              className="block font-medium mb-2 text-sm"
                              style={{ color: colores.primario[800] }}
                            >
                              Artista
                            </label>
                            <input
                              type="text"
                              value={artistRequest}
                              onChange={(e) => setArtistRequest(e.target.value)}
                              className="w-full px-3 py-2 bg-white/50 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm"
                              style={{
                                border: `1px solid ${colores.primario[300]}80`,
                                color: colores.primario[900],
                              }}
                              placeholder="Ej: Rodrigo"
                              disabled={loading}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleSubmit()
                              }
                            />
                          </div>

                          <div>
                            <label
                              className="block font-medium mb-2 text-sm"
                              style={{ color: colores.primario[800] }}
                            >
                              Mensaje Especial (Opcional)
                            </label>
                            <textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 bg-white/50 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none text-sm"
                              style={{
                                border: `1px solid ${colores.primario[300]}80`,
                                color: colores.primario[900],
                              }}
                              placeholder="¿Por qué es especial esta canción?"
                              disabled={loading}
                            />
                          </div>

                          <button
                            onClick={handleSubmit}
                            disabled={loading || !songRequest.trim()}
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
                            {loading
                              ? "Enviando..."
                              : "¡Agregar a la Playlist!"}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Heart
                            className="w-12 h-12 mx-auto mb-3 animate-pulse"
                            style={{ color: colores.primario[600] }}
                          />
                          <h4
                            className="font-bold text-lg mb-2"
                            style={{ color: colores.primario[800] }}
                          >
                            ¡Canción Agregada!
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: colores.primario[700] }}
                          >
                            Tu canción ya está en la lista. ¡Esperamos que suene
                            durante la fiesta!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYOUT DESKTOP */}
      <div className="hidden lg:block relative min-h-screen overflow-hidden">
        {/* Imagen de fondo - Mitad izquierda */}
        <div className="absolute inset-0 lg:w-1/2 lg:left-0 lg:inset-y-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/assets/8.jpg')`,
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

        {/* Fondo degradado - Mitad derecha */}
        <div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{
            background: `linear-gradient(135deg, ${colores.primario[50]}, ${colores.secundario[50]}, ${colores.primario[100]})`,
          }}
        />

        {/* Contenido principal */}
        <div className="relative z-10 min-h-screen">
          <div className="w-full mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-0 min-h-screen">
              {/* Lado izquierdo - Hero */}
              <div className="flex items-center justify-center">
                <div className="text-center lg:text-left lg:pl-12">
                  <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute inset-0">
                      <div
                        className="w-24 h-24 rounded-full blur-2xl animate-pulse"
                        style={{
                          background: `linear-gradient(135deg, ${colores.primario[400]}80, ${colores.terciario[400]}80)`,
                        }}
                      />
                    </div>
                    <Music className="w-12 h-12 text-white relative z-10" />
                    <div className="absolute -top-2 -right-2 music-rotate-sparkles">
                      <Sparkles
                        className="w-6 h-6"
                        style={{ color: colores.terciario[300] }}
                      />
                    </div>
                  </div>

                  <h2
                    className="font-Emilys_Candy font-bold text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
                    style={{
                      textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Pide tu Canción
                    <br />
                    <span className="font-Emilys_Candy text-4xl md:text-5xl lg:text-6xl">
                      Favorita
                    </span>
                  </h2>

                  <p className="text-xl text-white/90 max-w-lg mx-auto lg:mx-0 mb-8 font-medium drop-shadow-lg">
                    Ayúdanos a crear la playlist perfecta
                    <br />
                    ¡Tu canción favorita puede ser la que haga bailar a todos!
                  </p>
                </div>
              </div>

              {/* Lado derecho - Interactivo */}
              <div className="flex items-center justify-center py-12">
                <div className="w-full max-w-lg">
                  {!showForm ? (
                    <div className="space-y-8">
                      <div className="text-center">
                        <button
                          onClick={handleShowForm}
                          className="inline-flex items-center gap-3 rounded-full px-8 py-4 font-bold text-xl shadow-2xl hover:scale-105 transition-transform"
                          style={{
                            background: `linear-gradient(to right, ${colores.primario[400]}, ${colores.primario[500]}, ${colores.terciario[400]})`,
                            color: colores.primario[900],
                            border: `1px solid ${colores.primario[300]}66`,
                          }}
                        >
                          <Music className="w-6 h-6" />
                          <span>Agregar Mi Canción</span>
                        </button>
                      </div>

                      <div className="text-center">
                        <div
                          className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-full px-8 py-4"
                          style={{
                            border: `1px solid ${colores.primario[300]}66`,
                          }}
                        >
                          <Headphones
                            className="w-6 h-6"
                            style={{ color: colores.primario[700] }}
                          />
                          <span
                            className="font-semibold text-xl"
                            style={{ color: colores.primario[800] }}
                          >
                            {loadingSongs
                              ? "Cargando..."
                              : getSongsCountText(dbSongs.length)}{" "}
                            agregadas
                          </span>
                        </div>
                      </div>

                      <div
                        className="bg-white/40 backdrop-blur-sm rounded-2xl p-6"
                        style={{
                          border: `1px solid ${colores.primario[300]}66`,
                        }}
                      >
                        <h3
                          className="font-bold text-xl mb-4 flex items-center gap-2"
                          style={{ color: colores.primario[800] }}
                        >
                          <Music className="w-6 h-6" />
                          Canciones Solicitadas
                        </h3>

                        {loadingSongs ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2
                              className="w-8 h-8 animate-spin"
                              style={{ color: colores.primario[600] }}
                            />
                          </div>
                        ) : dbSongs.length > 0 ? (
                          <div
                            className="space-y-3 overflow-y-auto music-scrollbar pr-2"
                            style={{ height: "240px" }}
                          >
                            {dbSongs.map((song, index) => (
                              <div
                                key={song.id}
                                className="p-3 bg-white/30 rounded-xl hover:bg-white/50 transition-all cursor-pointer group music-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <div className="flex items-start gap-3">
                                  <Music
                                    className="w-4 h-4 flex-shrink-0 mt-1 group-hover:text-yellow-700 transition-colors"
                                    style={{ color: colores.primario[600] }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="font-medium truncate group-hover:text-yellow-800 transition-colors"
                                      style={{ color: colores.primario[900] }}
                                    >
                                      {song.song_name}
                                    </p>
                                    {song.artist_name && (
                                      <p
                                        className="text-sm truncate"
                                        style={{ color: colores.primario[700] }}
                                      >
                                        {song.artist_name}
                                      </p>
                                    )}
                                    {song.message && (
                                      <div
                                        className="text-xs mt-1 italic music-scrollbar overflow-y-auto"
                                        style={{
                                          maxHeight: "40px",
                                          color: colores.primario[600],
                                        }}
                                        title={song.message}
                                      >
                                        {song.message}
                                      </div>
                                    )}
                                    <p
                                      className="text-xs mt-1"
                                      style={{ color: colores.primario[500] }}
                                    >
                                      {new Date(
                                        song.created_at
                                      ).toLocaleDateString("es-ES", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Music
                              className="w-12 h-12 mx-auto mb-4 opacity-60"
                              style={{ color: colores.primario[400] }}
                            />
                            <p style={{ color: colores.primario[600] }}>
                              Aún no hay canciones solicitadas. ¡Sé el primero!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 relative shadow-2xl"
                      style={{
                        border: `1px solid ${colores.primario[300]}66`,
                      }}
                    >
                      <button
                        onClick={handleCloseForm}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/40 hover:bg-white/60 rounded-full flex items-center justify-center transition-all text-xl hover:rotate-90"
                        style={{ color: colores.primario[800] }}
                      >
                        ✕
                      </button>

                      <div className="mb-6">
                        <h3
                          className="font-bold text-2xl flex items-center gap-3"
                          style={{ color: colores.primario[800] }}
                        >
                          <Music className="w-8 h-8" />
                          Solicita una Canción
                        </h3>
                      </div>

                      {!submitted ? (
                        <div className="space-y-6">
                          {error && (
                            <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-700">
                              <AlertCircle className="w-5 h-5" />
                              <span>{error}</span>
                            </div>
                          )}

                          <div>
                            <label
                              className="block font-medium mb-2"
                              style={{ color: colores.primario[800] }}
                            >
                              Nombre de la Canción *
                            </label>
                            <input
                              type="text"
                              value={songRequest}
                              onChange={(e) => setSongRequest(e.target.value)}
                              className="w-full px-4 py-3 bg-white/50 rounded-xl focus:outline-none focus:ring-2 transition-all"
                              style={{
                                border: `1px solid ${colores.primario[300]}80`,
                                color: colores.primario[900],
                              }}
                              placeholder="Ej: Soy Cordobés"
                              disabled={loading}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleSubmit()
                              }
                            />
                          </div>

                          <div>
                            <label
                              className="block font-medium mb-2"
                              style={{ color: colores.primario[800] }}
                            >
                              Artista
                            </label>
                            <input
                              type="text"
                              value={artistRequest}
                              onChange={(e) => setArtistRequest(e.target.value)}
                              className="w-full px-4 py-3 bg-white/50 rounded-xl focus:outline-none focus:ring-2 transition-all"
                              style={{
                                border: `1px solid ${colores.primario[300]}80`,
                                color: colores.primario[900],
                              }}
                              placeholder="Ej: Rodrigo"
                              disabled={loading}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleSubmit()
                              }
                            />
                          </div>

                          <div>
                            <label
                              className="block font-medium mb-2"
                              style={{ color: colores.primario[800] }}
                            >
                              Mensaje Especial (Opcional)
                            </label>
                            <textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 bg-white/50 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
                              style={{
                                border: `1px solid ${colores.primario[300]}80`,
                                color: colores.primario[900],
                              }}
                              placeholder="¿Por qué es especial esta canción para ti?"
                              disabled={loading}
                            />
                          </div>

                          <button
                            onClick={handleSubmit}
                            disabled={loading || !songRequest.trim()}
                            className="w-full px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-105"
                            style={{
                              background: `linear-gradient(to right, ${colores.primario[400]}, ${colores.primario[500]}, ${colores.terciario[400]})`,
                              color: colores.primario[900],
                            }}
                          >
                            {loading ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <Send className="w-6 h-6" />
                            )}
                            {loading ? "Enviando..." : "Enviar Solicitud"}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Heart
                            className="w-16 h-16 mx-auto mb-4 animate-pulse"
                            style={{ color: colores.primario[600] }}
                          />
                          <h4
                            className="font-bold text-2xl mb-3"
                            style={{ color: colores.primario[800] }}
                          >
                            ¡Canción Agregada Exitosamente!
                          </h4>
                          <p
                            className="mb-4"
                            style={{ color: colores.primario[700] }}
                          >
                            Tu canción aparece ahora en la lista. ¡Esperamos que
                            suene durante la fiesta!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
