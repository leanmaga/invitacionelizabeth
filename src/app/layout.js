import "./globals.css";
import {
  Inter,
  Playfair_Display,
  Cookie,
  Imperial_Script,
  Emilys_Candy,
} from "next/font/google";
import {
  clientConfig,
  getSiteTitle,
  getSiteDescription,
} from "@/config/client.config";

// ✨ Fuentes de Google
const inter = Inter({ subsets: ["latin"] });

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const dancing = Imperial_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dancing",
});

const coockie = Cookie({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-coockie",
});

const candy = Emilys_Candy({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-Emilys_Candy",
});

// ✅ Obtener configuración desde client.config.js
const { nombre, edad } = clientConfig.quinceañera;
const { url: siteUrl, idioma, imagenOG } = clientConfig.sitio;

// URLs según el entorno
const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_URL || siteUrl
    : "http://localhost:3000";

// ✅ Metadata dinámica usando la configuración
export const metadata = {
  metadataBase: new URL(baseUrl),

  // Títulos y descripciones desde la configuración
  title: getSiteTitle(),
  description: getSiteDescription(),

  // Meta tags para Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: getSiteTitle(),
    description: getSiteDescription(),
    url: baseUrl,
    siteName: `15 Años de ${nombre}`,
    images: [
      {
        url: imagenOG || "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `Invitación - ${nombre} 15 Años`,
      },
    ],
    locale: idioma === "es" ? "es_ES" : "en_US",
    type: "website",
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: getSiteTitle(),
    description: getSiteDescription(),
    images: [imagenOG || "/og-image.jpg"],
  },

  // Meta tags adicionales
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // Favicons y iconos
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico" },
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon_io/favicon.ico",
  },

  // Manifest para PWA
  manifest: "/favicon_io/site.webmanifest",

  // Otros meta tags
  authors: [{ name: nombre }],
  keywords: [
    "15 años",
    nombre.toLowerCase(),
    "quinceañera",
    "celebración",
    "fiesta",
    "invitación",
    "mis 15",
    `${nombre.toLowerCase()} 15`,
  ],
  category: "event",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang={idioma}
      className={`${playfair.variable} ${dancing.variable} ${coockie.variable} ${candy.variable}`}
    >
      <head>
        {/* Preconexión a Google Fonts para mejor rendimiento */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Meta tags adicionales para mejor SEO y experiencia */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* ✅ Theme color usando el color rosa dusty de la configuración */}
        <meta name="theme-color" content="#d4989d" />
        <meta name="msapplication-TileColor" content="#d4989d" />

        {/* Meta tags de autor y copyright */}
        <meta name="author" content={nombre} />
        <meta name="creator" content={nombre} />

        {/* Meta tags para dispositivos móviles */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content={`${nombre} - 15 Años`}
        />

        {/* Meta tag para formato de número de teléfono */}
        <meta name="format-detection" content="telephone=no" />
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
