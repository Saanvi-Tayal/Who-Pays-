import React from 'react';
import Svg, {
  Circle,
  Path,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

export interface AvatarSvgProps {
  size?: number;
  showCrown?: boolean;
}

export const AVATAR_METADATA = [
  { key: 'AV-01', name: 'Gravit', title: 'The ATM', style: 'Pixel Boss' },
  { key: 'AV-02', name: 'Saanvi', title: 'The Lucky One', style: 'Purple Star' },
  { key: 'AV-03', name: 'Aman', title: 'The Chooser', style: 'Chill Aviator' },
  { key: 'AV-04', name: 'Priya', title: 'The Foodie', style: 'Sweet Rebel' },
  { key: 'AV-05', name: 'Zayd', title: 'The Gamer', style: 'Headset Pro' },
  { key: 'AV-06', name: 'Maya', title: 'The Trickster', style: 'Cat Ears' },
  { key: 'AV-07', name: 'Leo', title: 'The Skater', style: 'Cap Backwards' },
  { key: 'AV-08', name: 'Tara', title: 'The Astro', style: 'Star Shades' },
  { key: 'AV-09', name: 'Kabir', title: 'The Maverick', style: 'Bandana Edge' },
  { key: 'AV-10', name: 'Ananya', title: 'The Artist', style: 'Floral Bob' },
  { key: 'AV-11', name: 'Rohan', title: 'The Brains', style: 'Gold Specs' },
  { key: 'AV-12', name: 'Simran', title: 'The Cyber', style: 'Neon Visor' },
];

/**
 * AV-01: Gravit (Pixel Sunglasses + Gold Crown, matching reference art)
 */
export const AvatarGravit: React.FC<AvatarSvgProps> = ({ size = 64, showCrown = true }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="g-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#FFA07A" />
        <Stop offset="100%" stopColor="#FF4500" />
      </LinearGradient>
      <LinearGradient id="crown-gold" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#FFE066" />
        <Stop offset="100%" stopColor="#FFB800" />
      </LinearGradient>
    </Defs>
    {/* Background Circle */}
    <Circle cx="50" cy="50" r="48" fill="url(#g-bg)" />
    {/* Body / Shirt */}
    <Path d="M22 92 C26 70, 74 70, 78 92 Z" fill="#2D2140" />
    <Path d="M42 76 L58 76 L50 88 Z" fill="#FF5E62" />
    {/* Head */}
    <Circle cx="50" cy="52" r="24" fill="#F8C39A" />
    {/* Spiky Anime Hair */}
    <Path
      d="M26 48 C24 30, 36 22, 50 22 C64 22, 76 30, 74 48 C72 38, 66 32, 58 32 C54 28, 46 28, 42 32 C34 32, 28 38, 26 48 Z"
      fill="#1A1224"
    />
    <Path d="M28 44 L34 36 L36 42 L44 32 L46 40 L54 32 L56 42 L64 36 L70 46 Z" fill="#1A1224" />
    {/* 8-Bit Pixel Sunglasses */}
    <G fill="#110B18">
      {/* Left lens */}
      <Rect x="32" y="46" width="14" height="9" rx="1" />
      {/* Bridge */}
      <Rect x="46" y="48" width="8" height="4" />
      {/* Right lens */}
      <Rect x="54" y="46" width="14" height="9" rx="1" />
      {/* White pixel glares */}
      <Rect x="34" y="48" width="3" height="3" fill="#FFFFFF" />
      <Rect x="56" y="48" width="3" height="3" fill="#FFFFFF" />
    </G>
    {/* Confident Grin */}
    <Path d="M44 64 Q50 70 56 64" stroke="#773A16" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Gold Crown (as in reference) */}
    {showCrown && (
      <G transform="translate(32, 4)">
        <Path d="M2 18 L8 8 L18 14 L28 8 L34 18 Z" fill="url(#crown-gold)" stroke="#B8860B" strokeWidth="1" />
        <Circle cx="8" cy="7" r="1.5" fill="#FFF" />
        <Circle cx="18" cy="13" r="1.5" fill="#FFF" />
        <Circle cx="28" cy="7" r="1.5" fill="#FFF" />
      </G>
    )}
  </Svg>
);

/**
 * AV-02: Saanvi (Purple / Long Hair, cute smile)
 */
export const AvatarSaanvi: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="s-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#B388FF" />
        <Stop offset="100%" stopColor="#7C4DFF" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#s-bg)" />
    {/* Long Dark Brown Hair Behind */}
    <Path d="M24 45 C20 70, 24 92, 32 94 L68 94 C76 92, 80 70, 76 45 Z" fill="#24161F" />
    {/* Body */}
    <Path d="M26 94 C30 75, 70 75, 74 94 Z" fill="#4A148C" />
    {/* Face */}
    <Circle cx="50" cy="52" r="23" fill="#FAD4B5" />
    {/* Front Hair & Bangs */}
    <Path
      d="M26 46 C26 28, 74 28, 74 46 C70 34, 60 30, 50 30 C40 30, 30 34, 26 46 Z"
      fill="#3A212E"
    />
    <Path d="M30 40 Q40 48 50 42 Q60 48 70 40 Q62 32 50 32 Q38 32 30 40 Z" fill="#3A212E" />
    {/* Big Anime Eyes */}
    <Circle cx="41" cy="50" r="4" fill="#24161F" />
    <Circle cx="59" cy="50" r="4" fill="#24161F" />
    <Circle cx="42.5" cy="48.5" r="1.5" fill="#FFFFFF" />
    <Circle cx="60.5" cy="48.5" r="1.5" fill="#FFFFFF" />
    {/* Cute Smile */}
    <Path d="M45 61 Q50 66 55 61" stroke="#C2185B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Blushes */}
    <Circle cx="35" cy="55" r="3.5" fill="rgba(255, 64, 129, 0.4)" />
    <Circle cx="65" cy="55" r="3.5" fill="rgba(255, 64, 129, 0.4)" />
  </Svg>
);

/**
 * AV-03: Aman (Sporty Dark Hair + Aviator Shades)
 */
export const AvatarAman: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="a-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#00E5FF" />
        <Stop offset="100%" stopColor="#0091EA" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#a-bg)" />
    <Path d="M22 92 C26 72, 74 72, 78 92 Z" fill="#004D40" />
    <Circle cx="50" cy="52" r="24" fill="#E8B288" />
    {/* Fade / Spiked Hair */}
    <Path d="M26 44 C24 26, 76 26, 74 44 C66 32, 58 30, 50 30 C42 30, 34 32, 26 44 Z" fill="#1C181D" />
    <Path d="M32 32 L40 22 L46 26 L54 20 L60 26 L68 24 L66 34 Z" fill="#1C181D" />
    {/* Dark Aviator Glasses */}
    <Path d="M31 46 C31 44, 45 44, 45 46 L44 54 C44 58, 32 58, 31 54 Z" fill="#101820" />
    <Path d="M55 46 C55 44, 69 44, 69 46 L68 54 C68 58, 56 58, 55 54 Z" fill="#101820" />
    <Rect x="44" y="47" width="12" height="3" fill="#D4AF37" />
    {/* Smirk */}
    <Path d="M46 64 Q52 68 58 63" stroke="#5D3A1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </Svg>
);

/**
 * AV-04: Priya (Wavy Chestnut Hair, Pink aura)
 */
export const AvatarPriya: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="p-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#FF4081" />
        <Stop offset="100%" stopColor="#C51162" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#p-bg)" />
    {/* Wavy hair behind */}
    <Path d="M22 50 C18 78, 26 94, 34 94 L66 94 C74 94, 82 78, 78 50 Z" fill="#4E2714" />
    <Path d="M26 94 C30 76, 70 76, 74 94 Z" fill="#880E4F" />
    <Circle cx="50" cy="52" r="23" fill="#FCE4D6" />
    {/* Wavy Bangs */}
    <Path d="M26 46 C32 30, 68 30, 74 46 C68 36, 56 34, 50 34 C44 34, 32 36, 26 46 Z" fill="#4E2714" />
    {/* Sparkly Big Eyes */}
    <Circle cx="41" cy="50" r="4.2" fill="#2E1B10" />
    <Circle cx="59" cy="50" r="4.2" fill="#2E1B10" />
    <Circle cx="42" cy="48" r="1.8" fill="#FFF" />
    <Circle cx="60" cy="48" r="1.8" fill="#FFF" />
    <Circle cx="43.5" cy="52" r="0.8" fill="#FFF" />
    <Circle cx="61.5" cy="52" r="0.8" fill="#FFF" />
    {/* Happy Smile */}
    <Path d="M44 62 Q50 68 56 62" stroke="#B71C1C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Cheeks */}
    <Circle cx="35" cy="56" r="3.5" fill="rgba(255, 82, 82, 0.45)" />
    <Circle cx="65" cy="56" r="3.5" fill="rgba(255, 82, 82, 0.45)" />
  </Svg>
);

/**
 * AV-05: Zayd (Gamer Headset + Teal Spikes)
 */
export const AvatarZayd: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="z-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#00BFA5" />
        <Stop offset="100%" stopColor="#004D40" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#z-bg)" />
    <Path d="M24 92 C28 72, 72 72, 76 92 Z" fill="#263238" />
    <Circle cx="50" cy="52" r="23" fill="#F8C39A" />
    {/* Teal Anime Spikes */}
    <Path d="M28 42 L34 26 L42 34 L50 20 L58 32 L66 24 L72 42 Z" fill="#00E676" />
    {/* Headset Band */}
    <Path d="M24 50 C24 30, 76 30, 76 50" stroke="#FF1744" strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Headset Earcups */}
    <Rect x="20" y="44" width="8" height="18" rx="4" fill="#212121" stroke="#FF1744" strokeWidth="1.5" />
    <Rect x="72" y="44" width="8" height="18" rx="4" fill="#212121" stroke="#FF1744" strokeWidth="1.5" />
    {/* Microphone Boom */}
    <Path d="M24 56 Q28 66 38 66" stroke="#424242" strokeWidth="2.5" fill="none" />
    <Circle cx="39" cy="66" r="2" fill="#FF1744" />
    {/* Eyes & Smirk */}
    <Circle cx="42" cy="51" r="3.5" fill="#212121" />
    <Circle cx="58" cy="51" r="3.5" fill="#212121" />
    <Path d="M45 62 Q50 67 55 62" stroke="#773A16" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </Svg>
);

/**
 * AV-06: Maya (Cat Ears Headband + Violet Pigtails)
 */
export const AvatarMaya: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="m-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#EA80FC" />
        <Stop offset="100%" stopColor="#AA00FF" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#m-bg)" />
    <Circle cx="24" cy="46" r="12" fill="#4A148C" />
    <Circle cx="76" cy="46" r="12" fill="#4A148C" />
    <Path d="M26 94 C30 76, 70 76, 74 94 Z" fill="#311B92" />
    <Circle cx="50" cy="52" r="23" fill="#FFE0B2" />
    {/* Cat Ears */}
    <Path d="M30 32 L36 18 L46 28 Z" fill="#FF4081" stroke="#C51162" strokeWidth="1.5" />
    <Path d="M70 32 L64 18 L54 28 Z" fill="#FF4081" stroke="#C51162" strokeWidth="1.5" />
    <Path d="M34 29 L38 22 L43 27 Z" fill="#FFF" />
    <Path d="M66 29 L62 22 L57 27 Z" fill="#FFF" />
    {/* Violet Bangs */}
    <Path d="M28 44 C34 32, 66 32, 72 44 Q50 36 28 44 Z" fill="#4A148C" />
    {/* Wink & Eye */}
    <Circle cx="41" cy="50" r="3.8" fill="#311B92" />
    <Circle cx="42" cy="48.5" r="1.5" fill="#FFF" />
    {/* Winking right eye */}
    <Path d="M56 50 Q60 46 64 50" stroke="#311B92" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <Path d="M44 62 Q50 67 56 62" stroke="#AD1457" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </Svg>
);

/**
 * AV-07: Leo (Backward Skater Cap + Orange Hair)
 */
export const AvatarLeo: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="l-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#FF6D00" />
        <Stop offset="100%" stopColor="#DD2C00" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#l-bg)" />
    <Path d="M24 92 C28 72, 72 72, 76 92 Z" fill="#212121" />
    <Circle cx="50" cy="52" r="23" fill="#F8C39A" />
    {/* Backward Snapback Cap */}
    <Path d="M26 38 C26 26, 74 26, 74 38 Z" fill="#2979FF" />
    <Rect x="24" y="36" width="52" height="6" rx="2" fill="#1565C0" />
    {/* Cap backwards brim curve */}
    <Path d="M38 26 Q50 18 62 26" stroke="#1565C0" strokeWidth="4" fill="none" />
    {/* Hair strands peaking */}
    <Path d="M26 44 L30 52 L34 44 Z" fill="#E65100" />
    <Path d="M74 44 L70 52 L66 44 Z" fill="#E65100" />
    {/* Cool Eyes */}
    <Circle cx="42" cy="50" r="3.5" fill="#212121" />
    <Circle cx="58" cy="50" r="3.5" fill="#212121" />
    <Path d="M44 63 Q50 68 56 63" stroke="#5D3A1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </Svg>
);

/**
 * AV-08: Tara (Star Glasses + Blonde High Bun)
 */
export const AvatarTara: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="t-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#FFD600" />
        <Stop offset="100%" stopColor="#FF9100" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#t-bg)" />
    {/* Top Bun */}
    <Circle cx="50" cy="22" r="14" fill="#FFC107" stroke="#FFA000" strokeWidth="2" />
    <Path d="M26 94 C30 76, 70 76, 74 94 Z" fill="#3E2723" />
    <Circle cx="50" cy="52" r="23" fill="#FCE4D6" />
    {/* Blonde Bangs */}
    <Path d="M26 46 C32 32, 68 32, 74 46 Q50 36 26 46 Z" fill="#FFCA28" />
    {/* Star Shaped Neon Glasses */}
    <Path d="M38 43 L40 48 L46 48 L41 52 L43 58 L38 54 L33 58 L35 52 L30 48 L36 48 Z" fill="#D500F9" />
    <Path d="M62 43 L64 48 L70 48 L65 52 L67 58 L62 54 L57 58 L59 52 L54 48 L60 48 Z" fill="#D500F9" />
    <Rect x="44" y="49" width="12" height="2" fill="#D500F9" />
    <Path d="M45 64 Q50 68 55 64" stroke="#B71C1C" strokeWidth="2" strokeLinecap="round" fill="none" />
  </Svg>
);

/**
 * AV-09: Kabir (Bandana + Crimson Edge)
 */
export const AvatarKabir: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="k-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#D50000" />
        <Stop offset="100%" stopColor="#880E4F" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#k-bg)" />
    <Path d="M24 92 C28 72, 72 72, 76 92 Z" fill="#212121" />
    <Circle cx="50" cy="52" r="23" fill="#E0A97E" />
    {/* Spiky Dark Hair above bandana */}
    <Path d="M30 32 L36 20 L44 28 L52 18 L60 28 L68 22 L70 34 Z" fill="#263238" />
    {/* Red Samurai Bandana */}
    <Rect x="25" y="34" width="50" height="10" rx="3" fill="#B71C1C" />
    <Circle cx="50" cy="39" r="2" fill="#FFFFFF" />
    {/* Focused Eyes */}
    <Path d="M36 49 L46 51" stroke="#212121" strokeWidth="3" strokeLinecap="round" />
    <Path d="M64 49 L54 51" stroke="#212121" strokeWidth="3" strokeLinecap="round" />
    <Circle cx="41" cy="53" r="2.5" fill="#212121" />
    <Circle cx="59" cy="53" r="2.5" fill="#212121" />
    <Path d="M46 64 L54 64" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

/**
 * AV-10: Ananya (Floral Bob + Mint Glow)
 */
export const AvatarAnanya: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="an-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#69F0AE" />
        <Stop offset="100%" stopColor="#00B0FF" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#an-bg)" />
    {/* Mint Green Bob Hair */}
    <Path d="M24 50 C22 74, 26 84, 30 84 L70 84 C74 84, 78 74, 76 50 Z" fill="#004D40" />
    <Path d="M26 94 C30 76, 70 76, 74 94 Z" fill="#006064" />
    <Circle cx="50" cy="52" r="23" fill="#FCE4D6" />
    <Path d="M26 46 C32 30, 68 30, 74 46 Q50 36 26 46 Z" fill="#00796B" />
    {/* Flower Pin */}
    <Circle cx="32" cy="40" r="4" fill="#FFEB3B" />
    <Circle cx="32" cy="40" r="1.5" fill="#E91E63" />
    {/* Soft Eyes & Smile */}
    <Circle cx="41" cy="50" r="3.8" fill="#1B5E20" />
    <Circle cx="59" cy="50" r="3.8" fill="#1B5E20" />
    <Circle cx="42" cy="48" r="1.5" fill="#FFF" />
    <Circle cx="60" cy="48" r="1.5" fill="#FFF" />
    <Path d="M45 62 Q50 66 55 62" stroke="#B71C1C" strokeWidth="2" strokeLinecap="round" fill="none" />
  </Svg>
);

/**
 * AV-11: Rohan (Gold Spectacles + Navy Sweater)
 */
export const AvatarRohan: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="r-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#7986CB" />
        <Stop offset="100%" stopColor="#303F9F" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#r-bg)" />
    <Path d="M24 92 C28 72, 72 72, 76 92 Z" fill="#1A237E" />
    <Circle cx="50" cy="52" r="23" fill="#F8C39A" />
    {/* Side Parted Dark Hair */}
    <Path d="M26 44 C26 26, 74 28, 74 44 Q56 30 26 44 Z" fill="#212121" />
    {/* Round Golden Glasses */}
    <Circle cx="39" cy="51" r="7.5" stroke="#FFD700" strokeWidth="2" fill="none" />
    <Circle cx="61" cy="51" r="7.5" stroke="#FFD700" strokeWidth="2" fill="none" />
    <Rect x="46" y="50" width="8" height="2" fill="#FFD700" />
    <Circle cx="39" cy="51" r="2.8" fill="#212121" />
    <Circle cx="61" cy="51" r="2.8" fill="#212121" />
    <Path d="M46 64 Q50 67 54 64" stroke="#5D3A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
  </Svg>
);

/**
 * AV-12: Simran (Cyber Neon Visor + Neon Pink Ponytail)
 */
export const AvatarSimran: React.FC<AvatarSvgProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="sim-bg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#FF007F" />
        <Stop offset="100%" stopColor="#7928CA" />
      </LinearGradient>
      <LinearGradient id="visor-g" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0%" stopColor="#00F0FF" />
        <Stop offset="100%" stopColor="#FF007F" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#sim-bg)" />
    {/* High Ponytail side */}
    <Path d="M70 26 C86 20, 92 46, 82 56 Z" fill="#FF1493" />
    <Path d="M24 92 C28 72, 72 72, 76 92 Z" fill="#120E24" />
    <Circle cx="50" cy="52" r="23" fill="#FCE4D6" />
    <Path d="M26 44 C30 28, 70 28, 74 44 Q50 34 26 44 Z" fill="#C51162" />
    {/* Cyber Visor */}
    <Rect x="26" y="45" width="48" height="11" rx="4" fill="url(#visor-g)" opacity={0.9} />
    <Path d="M30 47 L44 47" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M46 64 Q50 68 54 64" stroke="#880E4F" strokeWidth="2" strokeLinecap="round" fill="none" />
  </Svg>
);

/**
 * Master renderer for any avatar key
 */
export const RenderAvatarByKey: React.FC<{
  avatarKey?: string;
  size?: number;
  showCrown?: boolean;
}> = ({ avatarKey = 'AV-01', size = 64, showCrown = false }) => {
  switch (avatarKey) {
    case 'AV-01':
      return <AvatarGravit size={size} showCrown={showCrown} />;
    case 'AV-02':
      return <AvatarSaanvi size={size} />;
    case 'AV-03':
      return <AvatarAman size={size} />;
    case 'AV-04':
      return <AvatarPriya size={size} />;
    case 'AV-05':
      return <AvatarZayd size={size} />;
    case 'AV-06':
      return <AvatarMaya size={size} />;
    case 'AV-07':
      return <AvatarLeo size={size} />;
    case 'AV-08':
      return <AvatarTara size={size} />;
    case 'AV-09':
      return <AvatarKabir size={size} />;
    case 'AV-10':
      return <AvatarAnanya size={size} />;
    case 'AV-11':
      return <AvatarRohan size={size} />;
    case 'AV-12':
      return <AvatarSimran size={size} />;
    default:
      return <AvatarGravit size={size} showCrown={showCrown} />;
  }
};
