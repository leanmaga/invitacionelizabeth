// config/theme.config.js
/**
 * 🎨 CONFIGURACIÓN DE TEMA Y COLORES
 * Cambia aquí todos los colores para personalizar la invitación
 */

export const themeConfig = {
  // 🌈 COLORES PRINCIPALES
  colores: {
    // Color primario (rosa polvoriento/dusty rose)
    primario: {
      50: "#fceef0", // Rosa muy muy claro
      100: "#f9dde0", // Rosa muy claro
      200: "#f3bbc1", // Rosa claro
      300: "#ec99a2", // Rosa medio claro
      400: "#e47783", // Rosa medio
      500: "#d4989d", // Color base - Rosa dusty (franja superior)
      600: "#c17b81", // Rosa oscuro
      700: "#a55d62", // Rosa más oscuro
      800: "#7d464a", // Rosa muy oscuro
      900: "#543032", // Rosa casi marrón
    },

    // Color secundario (beige/arena)
    secundario: {
      50: "#faf8f6", // Beige casi blanco
      100: "#f4f0eb", // Beige muy claro (franja inferior)
      200: "#ede7dc", // Beige claro
      300: "#e6ddd0", // Beige medio claro
      400: "#e1cfc4", // Beige medio (franja 3)
      500: "#d4bfb0", // Color base - Beige
      600: "#c0a999", // Beige oscuro
      700: "#a38977", // Beige más oscuro
      800: "#7a6557", // Marrón beige
      900: "#5a4a3f", // Marrón oscuro
    },

    // Color terciario (rosa claro para acentos)
    terciario: {
      50: "#fdf6f7",
      100: "#fbedf0",
      200: "#f7dbe0",
      300: "#f3c9d1",
      400: "#e8b4b8", // Rosa claro (franja 2)
      500: "#dfa0a7",
      600: "#d18c94",
      700: "#b97179",
      800: "#8f565c",
      900: "#6b4145",
    },

    // Colores elegantes (grises/negros)
    elegante: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617",
    },

    // Colores de acento
    acento: "#d4989d", // Rosa dusty
    acentoSecundario: "#e1cfc4", // Beige arena
    fondo: "#faf8f6", // Fondo beige muy claro
    texto: "#543032", // Texto rosa oscuro/marrón
    textoClaro: "#7d464a", // Texto medio
  },

  // 🎭 CÓDIGO DE VESTIMENTA - Colores restringidos
  codigoVestimenta: {
    coloresRestringidos: ["Beige", "Arena"], // Colores que los invitados NO deben usar
    mensajeRestriccion:
      "Para que la quinceañera brille en su día especial, te pedimos evitar los tonos",
  },

  // ✨ EFECTOS Y ANIMACIONES
  efectos: {
    glassMorphism: {
      background: "rgba(255, 255, 255, 0.15)",
      backdropBlur: "6.1px",
      borderRadius: "16px",
      border: "1px solid rgba(255, 255, 255, 0.35)",
    },
    transicion: "0.3s ease",
    duracionAnimacion: "0.8s",
  },

  // 🔤 TIPOGRAFÍA
  fuentes: {
    titulo: "var(--font-Emilys_Candy)", // Fuente elegante para títulos
    cursiva: "var(--font-dancing)", // Fuente decorativa
    texto: "var(--font-sans)", // Fuente para texto normal
    especial: "var(--font-Emilys_Candy)", // Fuente especial
  },

  // 📐 ESPACIADO Y TAMAÑOS
  espaciado: {
    radius: {
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      "2xl": "1.5rem",
    },
  },
};

/**
 * 🎨 FUNCIÓN HELPER: Obtener color con opacidad
 * Uso: getColorWithOpacity('primario', 500, 0.8)
 */
export function getColorWithOpacity(categoria, tono, opacidad = 1) {
  const color = themeConfig.colores[categoria]?.[tono];
  if (!color) return null;

  // Convertir hex a rgba si se necesita opacidad
  if (opacidad < 1) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacidad})`;
  }

  return color;
}

/**
 * 🎨 FUNCIÓN HELPER: Obtener clase de Tailwind según el color primario
 */
export function getPrimaryColorClasses() {
  return {
    bg: "bg-[#d4989d]", // Rosa dusty
    bgHover: "hover:bg-[#c17b81]", // Rosa oscuro
    text: "text-[#d4989d]", // Rosa dusty
    border: "border-[#d4989d]", // Rosa dusty
    gradient: "from-[#e8b4b8] via-[#d4989d] to-[#e1cfc4]", // Degradado rosa a beige
    gradientReverse: "from-[#e1cfc4] via-[#e8b4b8] to-[#d4989d]", // Degradado inverso
  };
}

/**
 * 🎨 FUNCIÓN HELPER: Obtener clases de color secundario (beige)
 */
export function getSecondaryColorClasses() {
  return {
    bg: "bg-[#e1cfc4]", // Beige arena
    bgHover: "hover:bg-[#d4bfb0]", // Beige oscuro
    text: "text-[#e1cfc4]", // Beige arena
    border: "border-[#e1cfc4]", // Beige arena
  };
}

export default themeConfig;
