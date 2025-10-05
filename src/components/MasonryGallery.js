import React, { useState, useEffect, useRef } from "react";
import { X, ZoomIn, MessageCircle, Send, Heart, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useLoading } from "@/components/PageLoader";
import "../app/masonry.css";
import { useQuinceaneraConfig } from "@/hooks/useQuinceaneraConfig";

const MasonryGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [illuminatedImages, setIlluminatedImages] = useState(new Set());
  const [imageHeights, setImageHeights] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Estados de comentarios
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({
    authorName: "",
    commentText: "",
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const { colores } = useQuinceaneraConfig();
  const { updateImageCount, incrementLoadedImages } = useLoading();
  const loadedCount = useRef(0);
  const hasInitialized = useRef(false); // ✅ AGREGADO

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const heights = {
      1: 2,
      2: 3,
      3: 3,
      4: 3,
      5: 2,
      6: 3,
      7: 2,
      8: 3,
      9: 2,
    };
    setImageHeights(heights);
  }, []);

  // ✅ ACTUALIZADO - Inicializar total de imágenes UNA SOLA VEZ
  useEffect(() => {
    if (!hasInitialized.current) {
      // 9 imágenes del MasonryGallery + 4 imágenes del LocationSection = 13 total
      const TOTAL_IMAGES = 13;
      updateImageCount(TOTAL_IMAGES);
      hasInitialized.current = true;
      console.log(`📊 Total de imágenes registradas: ${TOTAL_IMAGES}`);
    }
  }, []); // Array vacío - ejecutar solo una vez

  // ✅ SEPARADO - Cargar comentarios
  useEffect(() => {
    loadAllCommentCounts();
  }, []);

  const loadAllCommentCounts = async () => {
    try {
      const promises = images.map(async (image) => {
        const response = await fetch(`/api/image-comments?imageId=${image.id}`);
        const data = await response.json();
        return { imageId: image.id, comments: data.comments || [] };
      });

      const results = await Promise.all(promises);
      const commentsMap = {};
      results.forEach((result) => {
        commentsMap[result.imageId] = result.comments;
      });

      setComments(commentsMap);
    } catch (error) {
      console.error("Error loading comment counts:", error);
    }
  };

  const images = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    src: `/assets/${i + 1}.jpg`,
    alt: `Image ${i + 1}`,
  }));

  const loadComments = async (imageId) => {
    if (comments[imageId]) return;

    setLoadingComments((prev) => ({ ...prev, [imageId]: true }));

    try {
      const response = await fetch(`/api/image-comments?imageId=${imageId}`);
      const data = await response.json();

      if (response.ok) {
        setComments((prev) => ({
          ...prev,
          [imageId]: data.comments || [],
        }));
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoadingComments((prev) => ({ ...prev, [imageId]: false }));
    }
  };

  const submitComment = async () => {
    if (!newComment.authorName.trim() || !newComment.commentText.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    setSubmittingComment(true);

    try {
      const response = await fetch("/api/image-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId: selectedImage.id,
          authorName: newComment.authorName.trim(),
          commentText: newComment.commentText.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setComments((prev) => ({
          ...prev,
          [selectedImage.id]: [...(prev[selectedImage.id] || []), data.comment],
        }));

        setNewComment({ authorName: "", commentText: "" });
        setShowCommentForm(false);

        setTimeout(() => setIsFlipped(true), 300);
      } else {
        alert(data.error || "Error al enviar comentario");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Error al enviar comentario");
    } finally {
      setSubmittingComment(false);
    }
  };

  // ✅ ACTUALIZADO - Con console.log
  const handleImageLoad = () => {
    loadedCount.current += 1;
    incrementLoadedImages();
    console.log(`✅ Imagen cargada (${loadedCount.current})`);
  };

  // ✅ ACTUALIZADO - Con parámetro y console.warn
  const handleImageError = (imageSrc) => {
    loadedCount.current += 1;
    incrementLoadedImages();
    console.warn(`⚠️ Error al cargar imagen: ${imageSrc}`);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    loadComments(image.id);
    setIsFlipped(false);
    setShowCommentForm(false);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsFlipped(false);
    setShowCommentForm(false);
    setNewComment({ authorName: "", commentText: "" });
    document.body.style.overflow = "unset";
  };

  const handleImageClick = (image) => {
    if (isMobile) {
      const newIlluminated = new Set(illuminatedImages);
      if (newIlluminated.has(image.id)) {
        newIlluminated.delete(image.id);
      } else {
        newIlluminated.add(image.id);
      }
      setIlluminatedImages(newIlluminated);
    } else {
      openModal(image);
    }
  };

  const handleZoomClick = (e, image) => {
    e.stopPropagation();
    openModal(image);
  };

  const handleKeyDown = (event, callback) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  const handleModalKeyDown = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  const isImageIlluminated = (imageId) => {
    if (isMobile) {
      return illuminatedImages.has(imageId);
    } else {
      return hoveredImage === imageId;
    }
  };

  const getImageStyle = (imageId) => {
    const height = imageHeights[imageId] || 1;
    return {
      gridRowEnd: `span ${height * 10}`,
    };
  };

  const handleMessageClick = () => {
    setShowCommentForm(true);
  };

  const handleViewMessages = () => {
    setIsFlipped(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessagesText = (imageId) => {
    const messageCount = comments[imageId]?.length || 0;
    if (messageCount === 0) {
      return "aún no tiene mensajes para ver, escribele uno a Elizabeth";
    } else if (messageCount === 1) {
      return "ver 1 mensaje";
    } else {
      return `ver ${messageCount} mensajes`;
    }
  };

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colores.primario[50]} 0%, ${colores.fondo} 50%, ${colores.secundario[100]} 100%)`,
      }}
      role="main"
      id="gallery"
    >
      <div
        className="masonry-grid"
        role="img"
        aria-label="Galería de fotos de Elizabeth"
      >
        {images.map((image) => (
          <div
            key={image.id}
            className={`masonry-item ${
              isImageIlluminated(image.id) ? "illuminated" : ""
            }`}
            style={getImageStyle(image.id)}
            onMouseEnter={() => !isMobile && setHoveredImage(image.id)}
            onMouseLeave={() => !isMobile && setHoveredImage(null)}
            onClick={() => handleImageClick(image)}
            onKeyDown={(e) => handleKeyDown(e, () => handleImageClick(image))}
            role="button"
            aria-label={`Ver imagen ${image.id} de Elizabeth`}
            tabIndex={0}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="masonry-image"
              onLoad={handleImageLoad}
              onError={() => handleImageError(image.src)}
              priority={true}
            />

            {!isMobile && hoveredImage === image.id && (
              <div className="desktop-hover-overlay">
                <ZoomIn className="zoom-icon" size={32} />
              </div>
            )}

            {isMobile && (
              <div className="image-overlay">
                {isImageIlluminated(image.id) && (
                  <button
                    type="button"
                    className="zoom-button control-button"
                    onClick={(e) => handleZoomClick(e, image)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => handleZoomClick(e, image))
                    }
                    aria-label={`Ampliar imagen ${image.id}`}
                    tabIndex={0}
                  >
                    <ZoomIn className="text-white drop-shadow-lg" size={20} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeModal}
          onKeyDown={handleModalKeyDown}
          tabIndex={-1}
        >
          <div
            className="polaroid-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="paper-clip" role="presentation" />

            <div className={`polaroid-container ${isFlipped ? "flipped" : ""}`}>
              <div className="polaroid-front">
                <div className="polaroid-content">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="polaroid-image"
                  />

                  <div className="polaroid-footer">
                    <h2 id="modal-title" className="image-title">
                      <Heart className="text-pink-500" size={16} />
                    </h2>

                    <button
                      type="button"
                      onClick={handleMessageClick}
                      onKeyDown={(e) => handleKeyDown(e, handleMessageClick)}
                      className="message-button"
                      aria-label="Escribir mensaje para Elizabeth"
                      tabIndex={0}
                    >
                      <MessageCircle size={14} />
                      Mensaje
                    </button>
                  </div>

                  <div className="Elizabeth-messages">
                    <p className="Elizabeth-text">
                      💕 Mensajes para Elizabeth 💕
                    </p>
                    <button
                      type="button"
                      onClick={handleViewMessages}
                      onKeyDown={(e) => handleKeyDown(e, handleViewMessages)}
                      className="view-messages-button"
                      aria-label={`Ver mensajes de esta imagen. ${getMessagesText(
                        selectedImage.id
                      )}`}
                      tabIndex={0}
                    >
                      {getMessagesText(selectedImage.id)}
                    </button>
                  </div>

                  {showCommentForm && (
                    <div className="form-overlay">
                      <h3 className="form-title">
                        <Heart size={18} />
                        Escribe para Elizabeth
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <label htmlFor="author-name" className="sr-only">
                          Tu nombre
                        </label>
                        <input
                          id="author-name"
                          type="text"
                          placeholder="Tu nombre"
                          value={newComment.authorName}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              authorName: e.target.value,
                            }))
                          }
                          className="form-field"
                          maxLength={100}
                          required
                          aria-required="true"
                        />
                        <label htmlFor="message-text" className="sr-only">
                          Tu mensaje para Elizabeth
                        </label>
                        <textarea
                          id="message-text"
                          placeholder="Escribe tu mensaje para Elizabeth..."
                          value={newComment.commentText}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              commentText: e.target.value,
                            }))
                          }
                          className="form-field form-textarea"
                          maxLength={1000}
                          required
                          aria-required="true"
                        />
                        <div className="form-buttons">
                          <button
                            type="button"
                            onClick={submitComment}
                            disabled={submittingComment}
                            className="submit-button"
                            aria-label="Enviar mensaje para Elizabeth"
                          >
                            {submittingComment ? (
                              <span
                                className="loading-spinner"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <Send size={16} />
                            )}
                            {submittingComment ? "Enviando..." : "Enviar 💕"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCommentForm(false)}
                            onKeyDown={(e) =>
                              handleKeyDown(e, () => setShowCommentForm(false))
                            }
                            className="cancel-button"
                            aria-label="Cancelar mensaje"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={closeModal}
                    onKeyDown={(e) => handleKeyDown(e, closeModal)}
                    className="close-button"
                    aria-label="Cerrar ventana de imagen"
                    tabIndex={0}
                  >
                    <X size={isMobile ? 24 : 20} />
                  </button>
                </div>
              </div>

              <div className="polaroid-back">
                <div className="polaroid-back-content">
                  <div className="back-header">
                    <h3 className="back-title">
                      <Heart size={18} />
                      Para Elizabeth
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => setIsFlipped(false))
                      }
                      className="flip-button"
                      title="Voltear foto"
                      aria-label="Voltear foto al frente"
                      tabIndex={0}
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>

                  <div
                    className="messages-area"
                    role="list"
                    aria-label="Mensajes para Elizabeth"
                  >
                    {loadingComments[selectedImage.id] ? (
                      <div
                        className="loading-messages"
                        role="status"
                        aria-live="polite"
                      >
                        <span
                          className="loading-spinner"
                          aria-hidden="true"
                        ></span>
                        <p className="loading-text">Cargando mensajes...</p>
                      </div>
                    ) : (
                      <>
                        {comments[selectedImage.id] &&
                        comments[selectedImage.id].length > 0 ? (
                          <div className="messages-container">
                            {comments[selectedImage.id].map(
                              (comment, index) => (
                                <div
                                  key={comment.id}
                                  className="handwritten-message"
                                  role="listitem"
                                >
                                  <blockquote
                                    className={`message-text ${
                                      index % 2 === 0
                                        ? "rotate-left"
                                        : "rotate-right"
                                    }`}
                                  >
                                    {comment.comment_text}
                                  </blockquote>

                                  <div className="message-signature-area">
                                    <cite
                                      className={`message-signature ${
                                        index % 2 === 0
                                          ? "signature-rotate-left"
                                          : "signature-rotate-right"
                                      }`}
                                    >
                                      - {comment.author_name}
                                    </cite>

                                    <time
                                      className="message-date"
                                      dateTime={comment.created_at}
                                    >
                                      {formatDate(comment.created_at)}
                                    </time>
                                  </div>

                                  {index <
                                    comments[selectedImage.id].length - 1 && (
                                    <hr className="message-separator" />
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="empty-messages" role="status">
                            <p className="empty-message-text">
                              Aún no hay mensajes...
                            </p>
                            <p className="empty-subtext">
                              ¡Sé el primero en escribirle algo lindo!
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    onKeyDown={(e) => handleKeyDown(e, closeModal)}
                    className="close-button"
                    aria-label="Cerrar ventana de imagen"
                    tabIndex={0}
                  >
                    <X size={isMobile ? 24 : 20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasonryGallery;
