// hooks/useQuinceaneraConfig.js
"use client";

import {
  clientConfig,
  getHashtag,
  getMapUrls,
  getSiteTitle,
  getSiteDescription,
} from "@/config/client.config";
import { themeConfig } from "@/config/theme.config";

/**
 * 🎯 HOOK CENTRALIZADO DE CONFIGURACIÓN
 *
 * Este hook combina:
 * 1. Configuración del cliente (client.config.js)
 * 2. Variables de entorno (para valores sensibles como API keys)
 * 3. Configuración de tema (theme.config.js)
 *
 * PRIORIDAD: client.config.js > variables de entorno > valores por defecto
 */
export function useQuinceaneraConfig() {
  // 👤 INFORMACIÓN PERSONAL
  const nombre = clientConfig.quinceañera.nombre;
  const edad = clientConfig.quinceañera.edad;
  const apodo = clientConfig.quinceañera.apodo;

  // 📅 INFORMACIÓN DEL EVENTO
  const fechaEvento = clientConfig.evento.fecha;
  const fechaCompleta = clientConfig.evento.fechaCompleta;
  const horaEvento = clientConfig.evento.hora;
  const horaInicio = clientConfig.evento.horaInicio;
  const horaFin = clientConfig.evento.horaFin;

  // 📍 UBICACIÓN
  const lugar = clientConfig.ubicacion.nombreLugar;
  const direccion = clientConfig.ubicacion.direccion;
  const ciudad = clientConfig.ubicacion.ciudad;
  const provincia = clientConfig.ubicacion.provincia;
  const pais = clientConfig.ubicacion.pais;
  const imagenesSalon = clientConfig.ubicacion.imagenesSalon;
  const mapUrls = getMapUrls();

  // 👨‍👩‍👧‍👦 INFORMACIÓN DE CONTACTO
  const nombreFamilia = clientConfig.contacto.nombreFamilia;
  const telefono = clientConfig.contacto.telefono;
  const email = clientConfig.contacto.email;
  const whatsapp = clientConfig.contacto.whatsapp;

  // 📱 REDES SOCIALES
  const instagramUser = clientConfig.redes.instagram.usuario;
  const instagramUrl = clientConfig.redes.instagram.url;
  const hashtag = getHashtag();

  // 📝 CONFIRMACIÓN DE ASISTENCIA (RSVP)
  const fechaLimiteRSVP = clientConfig.rsvp.fechaLimite;
  const fechaLimiteRSVPISO = clientConfig.rsvp.fechaLimiteISO;
  const mensajeCierreRSVP = clientConfig.rsvp.mensajeCierre;
  const mostrarDietaryRestrictions =
    clientConfig.rsvp.mostrarDietaryRestrictions;

  // 🎁 INFORMACIÓN BANCARIA PARA REGALOS
  const mostrarRegalos = clientConfig.regalos.mostrarOpcion;
  const alias = clientConfig.regalos.alias;
  const cbu = clientConfig.regalos.cbu;
  const nombreCuentaBancaria = clientConfig.regalos.nombreCuenta;
  const mensajeRegalos = clientConfig.regalos.mensajePersonalizado;

  // 🎵 MÚSICA
  const musicUrl = clientConfig.musica.url;
  const musicTitle = clientConfig.musica.titulo;
  const musicAutoplay = clientConfig.musica.autoplay;

  // 🎨 CÓDIGO DE VESTIMENTA
  const codigoVestimenta = clientConfig.codigoVestimenta;

  // 🔐 ADMIN
  const adminPassword = clientConfig.admin.password;

  // 🗄️ SERVICIOS EXTERNOS (Usar variables de entorno para seguridad)
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || clientConfig.servicios.supabase.url;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    clientConfig.servicios.supabase.anonKey;
  const emailJsServiceId =
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
    clientConfig.servicios.emailjs.serviceId;
  const emailJsTemplateId =
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
    clientConfig.servicios.emailjs.templateId;
  const emailJsPublicKey =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
    clientConfig.servicios.emailjs.publicKey;

  // 🌐 CONFIGURACIÓN DEL SITIO
  const siteTitle = getSiteTitle();
  const siteDescription = getSiteDescription();
  const productionUrl =
    process.env.NEXT_PUBLIC_PRODUCTION_URL || clientConfig.sitio.url;
  const siteName = clientConfig.sitio.nombre;
  const siteLanguage = clientConfig.sitio.idioma;
  const ogImage = clientConfig.sitio.imagenOG;

  // 🎭 SECCIONES VISIBLES
  const seccionesVisibles = clientConfig.seccionesVisibles;

  // 🎨 TEMA Y COLORES
  const colores = themeConfig.colores;
  const efectos = themeConfig.efectos;
  const fuentes = themeConfig.fuentes;

  // 📊 TÍTULOS DINÁMICOS (para meta tags)
  const titulos = {
    principal: siteTitle,
    admin: `Panel de Administración - ${nombre}`,
    descripcion: siteDescription,
    redes: `${nombre} ${edad} Años`,
  };

  // 🔄 VALIDACIONES
  if (!whatsapp && process.env.NODE_ENV === "development") {
    console.warn("⚠️ Número de WhatsApp no configurado");
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "⚠️ Supabase no está configurado. Algunas funciones pueden no funcionar."
    );
  }

  // 🎯 RETURN: Toda la configuración en un solo objeto
  return {
    // Personal
    nombre,
    edad,
    apodo,

    // Evento
    fechaEvento,
    fechaCompleta,
    horaEvento,
    horaInicio,
    horaFin,

    // Ubicación
    lugar,
    direccion,
    ciudad,
    provincia,
    pais,
    imagenesSalon,
    googleMapsUrl: mapUrls.google,
    wazeUrl: mapUrls.waze,

    // Contacto
    nombreFamilia,
    telefono,
    email,
    whatsapp,

    // Redes sociales
    instagramUser,
    instagramUrl,
    hashtag,

    // RSVP
    fechaLimiteRSVP,
    fechaLimiteRSVPISO,
    mensajeCierreRSVP,
    mostrarDietaryRestrictions,

    // Regalos
    mostrarRegalos,
    alias,
    cbu,
    nombreCuentaBancaria,
    mensajeRegalos,

    // Música
    musicUrl,
    musicTitle,
    musicAutoplay,

    // Código de vestimenta
    codigoVestimenta,

    // Admin
    adminPassword,

    // Servicios
    supabaseUrl,
    supabaseAnonKey,
    emailJsServiceId,
    emailJsTemplateId,
    emailJsPublicKey,

    // Sitio
    siteTitle,
    siteDescription,
    productionUrl,
    siteName,
    siteLanguage,
    ogImage,
    titulos,

    // Secciones visibles
    seccionesVisibles,

    // Tema
    colores,
    efectos,
    fuentes,
  };
}

/**
 * 🎨 HOOK PARA OBTENER SOLO LOS COLORES
 */
export function useThemeColors() {
  return themeConfig.colores;
}

/**
 * 📋 HOOK PARA OBTENER SOLO EL CÓDIGO DE VESTIMENTA
 */
export function useDressCode() {
  return clientConfig.codigoVestimenta;
}

export default useQuinceaneraConfig;
