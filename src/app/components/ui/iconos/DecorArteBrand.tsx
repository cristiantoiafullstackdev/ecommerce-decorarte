import React from 'react';

/**
 * PALETA DE COLORES DE ARTESANÍAS DECORARTE (Madera, Hierro y Latón):
 * Tabla de Fondo: Siena natural y nogal cálido con vetas profundas.
 * Letras de Madera: Roble dorado y ámbar con bordes definidos.
 * Escudo de Hierro: Acero templado, carbón profundo y destellos metálicos.
 * Acentos: Latón cepillado y pernos de oro viejo.
 */
const BrandColors = {
  bgWoodDark: "#3A2212",
  bgWoodMedium: "#5C3A21",
  bgWoodLight: "#7A4F31",
  ironDark: "#1E1A17",
  ironMedium: "#3E3A37",
  ironLight: "#6E6864",
  woodDark: "#52301A",
  woodMedium: "#915B33",
  woodLight: "#E0A363",
  accentGold: "#D69624",
  accentGoldLight: "#FFE699"
};

/**
 * ESTILOS DE ANIMACIÓN TIPO VIDEOJUEGO
 * Se inyecta directamente en la aplicación para asegurar que las micro-interacciones
 * tengan un rebote (spring/bounce) adictivo, fluido y divertido al tacto.
 */
export const GameStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes gamePress {
      0% { transform: scale(1); }
      100% { transform: scale(0.88); }
    }
    
    .game-bounce {
      transition: transform 0.28s cubic-bezier(0.34, 1.75, 0.64, 1), filter 0.2s ease, box-shadow 0.2s ease;
      transform-origin: center;
      cursor: pointer;
    }
    
    /* Efecto flotante y rebote al pasar el cursor */
    .game-bounce:hover {
      transform: scale(1.12) translateY(-2px);
      filter: brightness(1.08) drop-shadow(0 6px 8px rgba(0,0,0,0.25));
    }
    
    /* Compresión rápida e instantánea al presionar (click) */
    .game-bounce:active {
      transform: scale(0.88) translateY(1px);
      filter: brightness(0.92) drop-shadow(0 2px 3px rgba(0,0,0,0.15));
      transition: transform 0.08s ease-out;
    }

    /* Enlaces del Header con estilo de interfaz de aventura */
    .game-link {
      position: relative;
      transition: color 0.15s ease, transform 0.2s cubic-bezier(0.34, 1.75, 0.64, 1);
    }
    .game-link:hover {
      color: ${BrandColors.woodMedium} !important;
      transform: scale(1.08) rotate(-1deg);
    }
    .game-link:active {
      transform: scale(0.94);
    }
    /* Subrayado animado expandible desde el centro */
    .game-link::after {
      content: '';
      position: absolute;
      width: 100%;
      transform: scaleX(0);
      height: 2px;
      bottom: -4px;
      left: 0;
      background-color: ${BrandColors.accentGold};
      transform-origin: bottom center;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .game-link:hover::after {
      transform: scaleX(1);
    }
  `}} />
);

/**
 * Isotipo Artesanías Decorarte (Versión Suprema):
 * 1. Base: Tabla de madera tallada irregularmente con relieve.
 * 2. Fondo: Escudo heráldico cuadrado de hierro forjado.
 * 3. Herramientas: Martillo y cincel cruzados en acero y madera.
 * 4. Letras A y D: Estructurales, del mismo grosor (11 unidades) y separadas para óptima lectura.
 */
export const DecorarteIsotype = ({ size = 50, className = "" }) => (
  <>
    <GameStyles />
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 140 140" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`game-bounce ${className}`}
    >
      <defs>
        {/* Gradiente para la tabla de madera rústica del fondo */}
        <linearGradient id="boardWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BrandColors.bgWoodLight} />
          <stop offset="60%" stopColor={BrandColors.bgWoodMedium} />
          <stop offset="100%" stopColor={BrandColors.bgWoodDark} />
        </linearGradient>

        {/* Gradiente para las letras A y D (Vigas de Madera de Roble) */}
        <linearGradient id="lettersWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BrandColors.woodLight} />
          <stop offset="50%" stopColor={BrandColors.woodMedium} />
          <stop offset="100%" stopColor={BrandColors.woodDark} />
        </linearGradient>

        {/* Gradiente para el Escudo de Hierro Forjado */}
        <linearGradient id="ironShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BrandColors.ironLight} />
          <stop offset="50%" stopColor={BrandColors.ironMedium} />
          <stop offset="100%" stopColor={BrandColors.ironDark} />
        </linearGradient>

        {/* Gradiente para el bisel del escudo */}
        <linearGradient id="ironBorderGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8E8884" />
          <stop offset="50%" stopColor={BrandColors.ironDark} />
          <stop offset="100%" stopColor="#0A0807" />
        </linearGradient>

        {/* Gradiente metálico de las herramientas */}
        <linearGradient id="steelToolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9E9894" />
          <stop offset="50%" stopColor="#3E3A37" />
          <stop offset="100%" stopColor="#1E1A17" />
        </linearGradient>

        {/* Gradiente para pernos de latón */}
        <linearGradient id="brassPernosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BrandColors.accentGoldLight} />
          <stop offset="100%" stopColor={BrandColors.accentGold} />
        </linearGradient>

        {/* Filtro de Sombra 3D */}
        <filter id="softShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="2" dy="4" stdDeviation="2.5" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* ========================================================
          1. TABLA DE MADERA RÚSTICA / PLACA DE FONDO (Contornos irregulares)
          ======================================================== */}
      <g filter="url(#softShadow)">
        <path 
          d="M 12,22 
             C 25,18 55,21 85,19 
             C 112,17 124,20 128,24 
             C 131,45 129,75 131,105 
             C 132,118 123,122 118,124 
             C 95,127 55,125 22,126 
             C 13,126 9,118 9,105 
             C 8,85 11,50 12,22 Z" 
          fill="url(#boardWoodGrad)" 
          stroke={BrandColors.bgWoodDark}
          strokeWidth="2.5"
        />
        <path d="M 16,35 Q 45,30 122,38" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" fill="none" />
        <path d="M 14,70 Q 70,75 125,65" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" fill="none" />
        <path d="M 15,105 Q 55,110 124,101" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />
        <path d="M 12,22 L 18,28" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <path d="M 128,24 L 122,30" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      </g>

      {/* ========================================================
          2. ESCUDO DE HIERRO CUADRADO (Sobre la madera)
          ======================================================== */}
      <g filter="url(#softShadow)">
        <path 
          d="M 32,28 
             L 108,28 
             L 108,72 
             C 108,94 90,108 70,115 
             C 50,108 32,94 32,72 
             Z" 
          fill="url(#ironBorderGrad)" 
        />
        <path 
          d="M 36,32 
             L 104,32 
             L 104,70 
             C 104,90 88,103 70,109 
             C 52,103 36,90 36,70 
             Z" 
          fill="url(#ironShieldGrad)" 
          stroke={BrandColors.ironDark}
          strokeWidth="1.5"
        />
        <circle cx="39" cy="35" r="1.5" fill="url(#brassPernosGrad)" />
        <circle cx="70" cy="35" r="1.5" fill="url(#brassPernosGrad)" />
        <circle cx="101" cy="35" r="1.5" fill="url(#brassPernosGrad)" />
        <circle cx="39" cy="68" r="1.5" fill="url(#brassPernosGrad)" />
        <circle cx="101" cy="68" r="1.5" fill="url(#brassPernosGrad)" />
        <circle cx="70" cy="104" r="1.5" fill="url(#brassPernosGrad)" />
      </g>

      {/* ========================================================
          3. HERRAMIENTAS (Martillo & Cincel cruzados)
          ======================================================== */}
      <g filter="url(#softShadow)">
        <g>
          <path d="M 42,92 L 84,50" stroke="url(#lettersWoodGrad)" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 80,42 L 92,54 L 88,58 L 76,46 Z" fill="url(#steelToolGrad)" stroke="#111" strokeWidth="1" />
          <path d="M 88,38 L 94,44 L 90,48 L 84,42 Z" fill="url(#steelToolGrad)" stroke="#111" strokeWidth="1" />
        </g>
        <g>
          <path d="M 98,92 L 56,50" stroke="url(#lettersWoodGrad)" strokeWidth="5" strokeLinecap="round" />
          <path d="M 54,48 L 44,38 L 48,34 L 58,44 Z" fill="url(#steelToolGrad)" stroke="#111" strokeWidth="1" />
          <rect x="54" y="48" width="4" height="4" transform="rotate(-45 54 48)" fill="url(#brassPernosGrad)" />
        </g>
      </g>

      {/* ========================================================
          4. LETRA "A" (Viga de Madera Estructurada - Espesor 11)
          ======================================================== */}
      <g filter="url(#softShadow)">
        <polygon points="34,88 45,88 61,41 50,41" fill="url(#lettersWoodGrad)" stroke={BrandColors.ironDark} strokeWidth="1.5" />
        <polygon points="50,41 61,41 77,88 66,88" fill="url(#lettersWoodGrad)" stroke={BrandColors.ironDark} strokeWidth="1.5" />
        <polygon points="38,71 72,71 70,62 40,62" fill="url(#lettersWoodGrad)" stroke={BrandColors.ironDark} strokeWidth="1.5" />
        <path d="M 40,84 L 48,58" stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
        <path d="M 71,84 L 59,53" stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
      </g>

      {/* ========================================================
          5. LETRA "D" ROBUSTECIDA (Espesor exacto de 11 unidades)
          ======================================================== */}
      <g filter="url(#softShadow)">
        <path 
          d="M 74,41 
             L 96,41 
             L 108,53 
             L 108,76 
             L 96,88 
             L 74,88 
             Z 
             M 85,52 
             L 85,77 
             L 93,77 
             L 97,73 
             L 97,56 
             L 93,52 
             Z" 
          fill="url(#lettersWoodGrad)" 
          stroke={BrandColors.ironDark} 
          strokeWidth="1.5" 
          fillRule="evenodd"
        />
        <path d="M 102,57 L 102,72" stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
        <path d="M 79,47 L 91,47" stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
        <path d="M 79,82 L 91,82" stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
      </g>

      {/* ========================================================
          6. PERNOS / ENSAMBLES DE LATÓN
          ======================================================== */}
      <circle cx="55.5" cy="45" r="2.2" fill="url(#brassPernosGrad)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
      <circle cx="43" cy="66.5" r="1.8" fill="url(#brassPernosGrad)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
      <circle cx="67" cy="66.5" r="1.8" fill="url(#brassPernosGrad)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
      <circle cx="38" cy="83" r="2.2" fill="url(#brassPernosGrad)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
      <circle cx="71" cy="83" r="2.2" fill="url(#brassPernosGrad)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
      <circle cx="78.5" cy="46.5" r="1.8" fill="url(#brassPernosGrad)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
      <circle cx="98.5" cy="49" r="1.8" fill="url(#brassPernosGrad)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
      <circle cx="98.5" cy="80" r="1.8" fill="url(#brassPernosGrad)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
      <circle cx="78.5" cy="82.5" r="1.8" fill="url(#brassPernosGrad)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
    </svg>
  </>
);

/**
 * Logo Completo Horizontal con Fondo de Placa Metálica para las Palabras:
 * El texto se ubica dentro de una placa de hierro forjado con remaches de latón,
 * unificando el logo completo en un bloque visual asombroso y simétrico.
 */
export const DecorarteLogo = ({ height = 55, className = "" }) => (
  <div className={`flex items-center gap-5 ${className}`} style={{ height: `${height}px` }}>
    <GameStyles />
    <svg 
      height="100%" 
      viewBox="0 0 385 140" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto game-bounce"
    >
      <defs>
        <linearGradient id="boardWoodGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BrandColors.bgWoodLight} />
          <stop offset="60%" stopColor={BrandColors.bgWoodMedium} />
          <stop offset="100%" stopColor={BrandColors.bgWoodDark} />
        </linearGradient>
        <linearGradient id="lettersWoodGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BrandColors.woodLight} />
          <stop offset="50%" stopColor={BrandColors.woodMedium} />
          <stop offset="100%" stopColor={BrandColors.woodDark} />
        </linearGradient>
        <linearGradient id="ironShieldGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BrandColors.ironLight} />
          <stop offset="50%" stopColor={BrandColors.ironMedium} />
          <stop offset="100%" stopColor={BrandColors.ironDark} />
        </linearGradient>
        <linearGradient id="ironBorderGradLogo" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8E8884" />
          <stop offset="50%" stopColor={BrandColors.ironDark} />
          <stop offset="100%" stopColor="#0A0807" />
        </linearGradient>
        <linearGradient id="brassPernosGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BrandColors.accentGoldLight} />
          <stop offset="100%" stopColor={BrandColors.accentGold} />
        </linearGradient>
        <filter id="softShadowLogo" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="2" dy="4" stdDeviation="2.5" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* ISOTIPO */}
      <g transform="translate(0, 0)">
        <g filter="url(#softShadowLogo)">
          <path d="M 12,22 C 25,18 55,21 85,19 C 112,17 124,20 128,24 C 131,45 129,75 131,105 C 132,118 123,122 118,124 C 95,127 55,125 22,126 C 13,126 9,118 9,105 C 8,85 11,50 12,22 Z" fill="url(#boardWoodGradLogo)" stroke={BrandColors.bgWoodDark} strokeWidth="2.5" />
        </g>
        <g filter="url(#softShadowLogo)">
          <path d="M 32,28 L 108,28 L 108,72 C 108,94 90,108 70,115 C 50,108 32,94 32,72 Z" fill="url(#ironBorderGradLogo)" />
          <path d="M 36,32 L 104,32 L 104,70 C 104,90 88,103 70,109 C 52,103 36,90 36,70 Z" fill="url(#ironShieldGradLogo)" stroke={BrandColors.ironDark} strokeWidth="1.5" />
        </g>
        <g filter="url(#softShadowLogo)">
          <polygon points="34,88 45,88 61,41 50,41" fill="url(#lettersWoodGradLogo)" stroke={BrandColors.ironDark} strokeWidth="1.5" />
          <polygon points="50,41 61,41 77,88 66,88" fill="url(#lettersWoodGradLogo)" stroke={BrandColors.ironDark} strokeWidth="1.5" />
          <polygon points="38,71 72,71 70,62 40,62" fill="url(#lettersWoodGradLogo)" stroke={BrandColors.ironDark} strokeWidth="1.5" />
          <path d="M 74,41 L 96,41 L 108,53 L 108,76 L 96,88 L 74,88 Z M 85,52 L 85,77 L 93,77 L 97,73 L 97,56 L 93,52 Z" fill="url(#lettersWoodGradLogo)" stroke={BrandColors.ironDark} strokeWidth="1.5" fillRule="evenodd" />
        </g>
      </g>

      {/* PLACA METÁLICA DE TEXTO (Expandida verticalmente para hermanar con el Isotipo) */}
      <g filter="url(#softShadowLogo)">
        {/* El borde exterior de hierro ahora baja desde Y=16 hasta Y=126 */}
        <path d="M 152,16 L 368,16 L 374,22 L 374,120 L 368,126 L 152,126 L 146,120 L 146,22 Z" fill="url(#ironBorderGradLogo)" />
        {/* El escudo interior de la placa ahora va desde Y=20 hasta Y=122 */}
        <path d="M 155,20 L 365,20 L 370,25 L 370,117 L 365,122 L 155,122 L 150,117 L 150,25 Z" fill="url(#ironShieldGradLogo)" stroke={BrandColors.ironDark} strokeWidth="1.5" />
        
        {/* Pernos de latón reubicados simétricamente en las nuevas esquinas ampliadas */}
        <circle cx="155" cy="25" r="1.8" fill="url(#brassPernosGradLogo)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
        <circle cx="365" cy="25" r="1.8" fill="url(#brassPernosGradLogo)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
        <circle cx="365" cy="117" r="1.8" fill="url(#brassPernosGradLogo)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
        <circle cx="155" cy="117" r="1.8" fill="url(#brassPernosGradLogo)" stroke={BrandColors.ironDark} strokeWidth="0.8" />
      </g>

      {/* TEXTO (Reposicionado en el centro de la nueva placa de mayor altura) */}
      <g>
        <text x="260" y="62" fill="#F5F2EB" fontFamily="'Playfair Display', serif" fontSize="23" fontWeight="bold" letterSpacing="3.5" textAnchor="middle" filter="url(#softShadowLogo)">ARTESANÍAS</text>
        <text x="260" y="98" fill="url(#lettersWoodGradLogo)" fontFamily="'Playfair Display', serif" fontSize="23" fontWeight="bold" letterSpacing="3.5" textAnchor="middle" filter="url(#softShadowLogo)">DECORARTE</text>
      </g>
    </svg>
  </div>
);

/**
 * ========================================================
 * ICONOS EXCLUSIVOS DE ARTESANÍAS DECORARTE CON DISEÑO DE AUTOR
 * ========================================================
 */

/**
 * Icono de Búsqueda: Un lente de lupa engarzado en una corona de hierro con mango de madera tallada.
 */
export const DecorarteSearchIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`game-bounce ${className}`}
  >
    <defs>
      <linearGradient id="metalRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7E7874" />
        <stop offset="100%" stopColor="#1C1816" />
      </linearGradient>
      <linearGradient id="woodHandle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={BrandColors.woodLight} />
        <stop offset="100%" stopColor={BrandColors.woodDark} />
      </linearGradient>
    </defs>
    {/* Mango de Madera */}
    <path d="M 24,24 L 35,35" stroke="url(#woodHandle)" strokeWidth="5.5" strokeLinecap="round" />
    <path d="M 23,23 L 26,26" stroke={BrandColors.accentGold} strokeWidth="6" strokeLinecap="square" />
    {/* Aro de Hierro Forjado */}
    <circle cx="17" cy="17" r="10" fill="#EAE5DC" stroke="url(#metalRing)" strokeWidth="3" />
    {/* Cristal reflejo */}
    <path d="M 12,12 A 7,7 0 0 1 22,12" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    {/* Remaches de decoración */}
    <circle cx="17" cy="7.5" r="1" fill={BrandColors.accentGold} />
    <circle cx="17" cy="26.5" r="1" fill={BrandColors.accentGold} />
  </svg>
);

/**
 * Icono de Favoritos / Corazón: Un corazón esculpido en roble macizo con pernos y armazón de acero.
 */
export const DecorarteHeartIcon = ({ size = 24, className = "", filled = false }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`game-bounce ${className}`}
  >
    <defs>
      <linearGradient id="heartWood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={filled ? "#C84B31" : BrandColors.woodLight} />
        <stop offset="100%" stopColor={filled ? "#561C11" : BrandColors.woodDark} />
      </linearGradient>
      <linearGradient id="heartMetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8E8884" />
        <stop offset="100%" stopColor="#1E1A17" />
      </linearGradient>
    </defs>
    {/* Placa metálica de fondo */}
    <path 
      d="M 20,35 C 20,35 6,24 6,14 C 6,7.5 12,5 16,9 L 20,13 L 24,9 C 28,5 34,7.5 34,14 C 34,24 20,35 20,35 Z" 
      fill="url(#heartMetal)" 
      stroke="#1E1A17" 
      strokeWidth="2"
    />
    {/* Corazón de Madera interior */}
    <path 
      d="M 20,31 C 20,31 9,21 9,14 C 9,9.5 13.5,7.5 16.5,10.5 L 20,14 L 23.5,10.5 C 26.5,7.5 31,9.5 31,14 C 31,21 20,31 20,31 Z" 
      fill="url(#heartWood)" 
      stroke={BrandColors.ironDark}
      strokeWidth="1"
    />
    {/* Remache central o brillo */}
    <circle cx="20" cy="18" r="1.5" fill={BrandColors.accentGoldLight} />
    <circle cx="20" cy="18" r="1.8" stroke={BrandColors.accentGold} strokeWidth="0.5" />
  </svg>
);

/**
 * Icono de Carrito / Bolsa: Un contenedor de forja pesado con herrajes de acero y pernos de bronce.
 */
export const DecorarteBagIcon = ({ size = 24, className = "", itemCount = 0 }) => (
  <div className="relative inline-block">
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`game-bounce ${className}`}
    >
      <defs>
        <linearGradient id="bagSteel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5E5854" />
          <stop offset="100%" stopColor="#1F1A18" />
        </linearGradient>
        <linearGradient id="bagHandleWood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BrandColors.woodLight} />
          <stop offset="100%" stopColor={BrandColors.woodMedium} />
        </linearGradient>
      </defs>
      {/* Asa semicircular de Hierro */}
      <path 
        d="M 12,18 C 12,10 28,10 28,18" 
        stroke="url(#bagSteel)" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      {/* Cuerpo del canasto (Madera y Acero) */}
      <path 
        d="M 8,16 L 32,16 L 29,35 L 11,35 Z" 
        fill="url(#bagHandleWood)" 
        stroke={BrandColors.ironDark} 
        strokeWidth="1.5" 
      />
      {/* Bandas de refuerzo de metal vertical */}
      <path d="M 14,16 L 15,35" stroke="url(#bagSteel)" strokeWidth="2.5" />
      <path d="M 26,16 L 25,35" stroke="url(#bagSteel)" strokeWidth="2.5" />
      
      {/* Remaches de fijación */}
      <circle cx="14" cy="19" r="1.2" fill={BrandColors.accentGold} />
      <circle cx="26" cy="19" r="1.2" fill={BrandColors.accentGold} />
    </svg>
    {itemCount > 0 && (
      <span className="absolute -top-1.5 -right-1.5 bg-[#C84B31] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-stone-900 shadow animate-pulse">
        {itemCount}
      </span>
    )}
  </div>
);

/**
 * Icono de Perfil de Usuario / Artesano: El torso de un artesano modelado en placa de hierro sobre base circular de madera.
 */
export const DecorarteUserIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`game-bounce ${className}`}
  >
    <defs>
      <linearGradient id="userWood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={BrandColors.bgWoodLight} />
        <stop offset="100%" stopColor={BrandColors.bgWoodDark} />
      </linearGradient>
      <linearGradient id="userIron" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8E8884" />
        <stop offset="100%" stopColor="#1E1A17" />
      </linearGradient>
    </defs>
    {/* Base redonda de madera */}
    <circle cx="20" cy="20" r="17" fill="url(#userWood)" stroke={BrandColors.bgWoodDark} strokeWidth="1.5" />
    <circle cx="20" cy="20" r="15" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
    
    {/* Cabeza metálica */}
    <circle cx="20" cy="14" r="5" fill="url(#userIron)" stroke="#111" strokeWidth="1" />
    
    {/* Cuerpo/Hombros metálicos */}
    <path 
      d="M 10,29 C 10,24 14,21 20,21 C 26,21 30,24 30,29 Z" 
      fill="url(#userIron)" 
      stroke="#111" 
      strokeWidth="1.2" 
    />
    
    {/* Pernos de latón decorativos en la base de madera */}
    <circle cx="9" cy="20" r="1" fill={BrandColors.accentGold} />
    <circle cx="31" cy="20" r="1" fill={BrandColors.accentGold} />
  </svg>
);




export default DecorarteLogo;