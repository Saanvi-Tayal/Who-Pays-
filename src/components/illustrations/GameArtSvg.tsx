import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';

interface ArtProps {
  size?: number;
}

/**
 * MoneyBagSvg — Golden sack with dollar sign matching Screen 2 reference
 */
export const MoneyBagSvg: React.FC<ArtProps> = ({ size = 90 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="gold-aura" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFE082" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="#FFA000" stopOpacity="0" />
      </RadialGradient>
      <LinearGradient id="sack-body" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#FFD54F" />
        <Stop offset="40%" stopColor="#FFB300" />
        <Stop offset="100%" stopColor="#FF8F00" />
      </LinearGradient>
      <LinearGradient id="string-gold" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0%" stopColor="#FFF9C4" />
        <Stop offset="100%" stopColor="#FFE082" />
      </LinearGradient>
    </Defs>
    {/* Ambient Glow */}
    <Circle cx="50" cy="55" r="42" fill="url(#gold-aura)" />

    {/* Top Ruffle / Tied Neck */}
    <Path
      d="M36 28 C34 18, 44 14, 50 18 C56 14, 66 18, 64 28 Z"
      fill="url(#sack-body)"
      stroke="#FF6F00"
      strokeWidth="1.5"
    />

    {/* Tie String / Knot */}
    <Rect x="38" y="27" width="24" height="6" rx="3" fill="#B71C1C" />
    <Circle cx="50" cy="30" r="3" fill="#D32F2F" />

    {/* Main Bulbous Sack */}
    <Path
      d="M38 32 C22 34, 18 52, 18 68 C18 84, 30 92, 50 92 C70 92, 82 84, 82 68 C82 52, 78 34, 62 32 Z"
      fill="url(#sack-body)"
      stroke="#FF6F00"
      strokeWidth="2"
    />

    {/* Highlight shine */}
    <Path
      d="M26 50 C26 42, 34 38, 42 38"
      stroke="#FFF9C4"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
      opacity={0.8}
    />

    {/* Bold Black $ Symbol */}
    <G fill="#120B1E">
      <Path
        d="M48 48 C44 48, 41 51, 41 54 C41 58, 45 60, 50 61 C55 62, 59 64, 59 68 C59 72, 55 75, 50 75 C44 75, 41 72, 40 68 L44 67 C44 70, 47 72, 50 72 C53 72, 55 70, 55 68 C55 65, 51 63, 46 62 C41 61, 37 59, 37 54 C37 50, 41 46, 47 46 L47 42 L52 42 L52 46 C56 46, 59 49, 59 52 L55 53 C55 50, 52 48, 48 48 Z"
      />
      <Rect x="48.5" y="42" width="3" height="36" rx="1.5" />
    </G>
  </Svg>
);

/**
 * BombSvg — Glossy purple round bomb with burning fuse matching Screen 3 & 4
 */
export const BombSvg: React.FC<ArtProps> = ({ size = 80 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="bomb-body" cx="35%" cy="35%" r="65%">
        <Stop offset="0%" stopColor="#9C27B0" />
        <Stop offset="45%" stopColor="#6A1B9A" />
        <Stop offset="100%" stopColor="#2A0845" />
      </RadialGradient>
      <RadialGradient id="fuse-spark" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFF" />
        <Stop offset="30%" stopColor="#FFEA00" />
        <Stop offset="70%" stopColor="#FF3D00" />
        <Stop offset="100%" stopColor="transparent" />
      </RadialGradient>
    </Defs>

    {/* Spark Particle Aura */}
    <Circle cx="76" cy="18" r="16" fill="url(#fuse-spark)" />

    {/* Burning Wick Spurt */}
    <Path
      d="M76 10 L78 18 L86 16 L80 22 L84 28 L76 24 L70 28 L72 20 Z"
      fill="#FFD600"
    />
    <Circle cx="76" cy="19" r="3" fill="#FFF" />

    {/* Fuse Wick */}
    <Path
      d="M52 28 Q64 16 74 19"
      stroke="#D7CCC8"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Bomb Cap Collar */}
    <Rect x="44" y="24" width="16" height="8" rx="2" fill="#3E2723" />
    <Rect x="46" y="22" width="12" height="3" rx="1" fill="#8D6E63" />

    {/* Glossy Purple Spherical Bomb */}
    <Circle cx="50" cy="58" r="34" fill="url(#bomb-body)" />

    {/* Specular curved shine */}
    <Path
      d="M32 42 C38 34, 52 34, 58 40"
      stroke="#E1BEE7"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      opacity={0.8}
    />
    <Circle cx="32" cy="46" r="3" fill="#FFF" opacity={0.9} />
  </Svg>
);

/**
 * RouletteWheelSvg — Multi-colored prize wheel matching Screen 3
 */
export const RouletteWheelSvg: React.FC<ArtProps> = ({ size = 80 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="wheel-glow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#E040FB" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="transparent" />
      </RadialGradient>
    </Defs>
    <Circle cx="50" cy="50" r="48" fill="url(#wheel-glow)" />

    {/* Outer Wheel Rim */}
    <Circle cx="50" cy="50" r="42" fill="#1A0C2E" stroke="#FF4081" strokeWidth="3" />

    {/* 8 Colored Wheel Segments */}
    {/* Segment 1: Coral */}
    <Path d="M50 50 L50 10 A40 40 0 0 1 78 22 Z" fill="#FF5252" />
    {/* Segment 2: Orange */}
    <Path d="M50 50 L78 22 A40 40 0 0 1 90 50 Z" fill="#FF9800" />
    {/* Segment 3: Gold */}
    <Path d="M50 50 L90 50 A40 40 0 0 1 78 78 Z" fill="#FFD600" />
    {/* Segment 4: Teal */}
    <Path d="M50 50 L78 78 A40 40 0 0 1 50 90 Z" fill="#00E676" />
    {/* Segment 5: Cyan */}
    <Path d="M50 50 L50 90 A40 40 0 0 1 22 78 Z" fill="#00E5FF" />
    {/* Segment 6: Blue */}
    <Path d="M50 50 L22 78 A40 40 0 0 1 10 50 Z" fill="#2979FF" />
    {/* Segment 7: Purple */}
    <Path d="M50 50 L10 50 A40 40 0 0 1 22 22 Z" fill="#7C4DFF" />
    {/* Segment 8: Magenta */}
    <Path d="M50 50 L22 22 A40 40 0 0 1 50 10 Z" fill="#E040FB" />

    {/* Outer Pegs */}
    <Circle cx="50" cy="12" r="2" fill="#FFF" />
    <Circle cx="88" cy="50" r="2" fill="#FFF" />
    <Circle cx="50" cy="88" r="2" fill="#FFF" />
    <Circle cx="12" cy="50" r="2" fill="#FFF" />

    {/* Center Golden Hub */}
    <Circle cx="50" cy="50" r="14" fill="#FFD54F" stroke="#FFA000" strokeWidth="2" />
    <Circle cx="50" cy="50" r="6" fill="#D50000" />

    {/* Needle Pointer at Top */}
    <Path d="M50 18 L44 4 L56 4 Z" fill="#FF1744" stroke="#FFF" strokeWidth="1.5" />
  </Svg>
);

/**
 * LightningSvg — Electric yellow jagged lightning bolt with neon aura
 */
export const LightningSvg: React.FC<ArtProps> = ({ size = 80 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="lightning-aura" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFEA00" stopOpacity="0.45" />
        <Stop offset="100%" stopColor="transparent" />
      </RadialGradient>
      <LinearGradient id="lightning-bolt" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#FFFDE7" />
        <Stop offset="40%" stopColor="#FFEE58" />
        <Stop offset="100%" stopColor="#FFB300" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="46" fill="url(#lightning-aura)" />

    {/* Electric Spark Rays */}
    <G stroke="#FFE57F" strokeWidth="2" opacity={0.6}>
      <Path d="M22 26 L30 32" />
      <Path d="M78 26 L70 32" />
      <Path d="M18 64 L26 62" />
      <Path d="M82 64 L74 62" />
    </G>

    {/* Main Jagged Lightning */}
    <Path
      d="M58 8 L28 50 L48 50 L38 92 L76 44 L54 44 Z"
      fill="url(#lightning-bolt)"
      stroke="#FF8F00"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Inner White Core */}
    <Path
      d="M56 16 L34 50 L50 50 L42 82 L70 46 L52 46 Z"
      fill="#FFFFFF"
      opacity={0.6}
    />
  </Svg>
);

/**
 * ReactionHandSvg — Hand with pointing finger & radar rings matching Screen 3
 */
export const ReactionHandSvg: React.FC<ArtProps> = ({ size = 80 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="reaction-glow" cx="50%" cy="30%" r="50%">
        <Stop offset="0%" stopColor="#00E5FF" stopOpacity="0.5" />
        <Stop offset="100%" stopColor="transparent" />
      </RadialGradient>
    </Defs>
    <Circle cx="50" cy="30" r="40" fill="url(#reaction-glow)" />

    {/* Target Radar Rings */}
    <Circle cx="50" cy="24" r="14" stroke="#00E5FF" strokeWidth="2" strokeDasharray="4 4" fill="none" />
    <Circle cx="50" cy="24" r="24" stroke="#00E5FF" strokeWidth="1.5" opacity={0.5} strokeDasharray="6 4" fill="none" />
    <Circle cx="50" cy="24" r="4" fill="#00E5FF" />

    {/* Stylized Pointing Hand */}
    <G transform="translate(10, 8)">
      {/* Palm */}
      <Path
        d="M30 68 C28 52, 34 46, 42 46 C48 46, 54 50, 54 68 Z"
        fill="#FFD54F"
        stroke="#FFB300"
        strokeWidth="1.5"
      />
      {/* Pointing Index Finger directly upwards */}
      <Path
        d="M36 46 L36 18 C36 14, 44 14, 44 18 L44 46 Z"
        fill="#FFE082"
        stroke="#FFB300"
        strokeWidth="1.5"
      />
      {/* Curled Fingers */}
      <Path d="M44 46 C44 40, 52 40, 52 46 C52 52, 44 52, 44 46 Z" fill="#FFCA28" />
      <Path d="M48 50 C48 44, 56 44, 56 50 C56 56, 48 56, 48 50 Z" fill="#FFCA28" />
      <Path d="M52 54 C52 48, 60 48, 60 54 C60 60, 52 60, 52 54 Z" fill="#FFCA28" />
      {/* Folded Thumb */}
      <Path d="M30 52 C24 46, 32 40, 36 46 Z" fill="#FFD54F" />
      {/* Finger Tip Sparkle */}
      <Circle cx="40" cy="18" r="3" fill="#FFF" />
    </G>
  </Svg>
);

/**
 * ScalesJusticeSvg — For Ledger Vengeance
 */
export const ScalesJusticeSvg: React.FC<ArtProps> = ({ size = 90 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="scales-glow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#7C4DFF" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="transparent" />
      </RadialGradient>
    </Defs>
    <Circle cx="50" cy="50" r="44" fill="url(#scales-glow)" />
    {/* Base & Post */}
    <Rect x="47" y="18" width="6" height="66" rx="3" fill="#FFD54F" />
    <Path d="M30 84 C30 80, 70 80, 70 84 Z" fill="#FFB300" />
    {/* Crossbar */}
    <Path d="M18 28 L82 28" stroke="#FFE082" strokeWidth="5" strokeLinecap="round" />
    <Circle cx="50" cy="22" r="5" fill="#FFD54F" />
    {/* Left Scale Pan */}
    <Path d="M22 28 L14 56 L30 56 Z" stroke="#FFCA28" strokeWidth="1.5" fill="none" />
    <Path d="M10 56 C10 64, 34 64, 34 56 Z" fill="#FFD54F" />
    {/* Right Scale Pan (tilted slightly) */}
    <Path d="M78 28 L70 52 L86 52 Z" stroke="#FFCA28" strokeWidth="1.5" fill="none" />
    <Path d="M66 52 C66 60, 90 60, 90 52 Z" fill="#FFD54F" />
  </Svg>
);

/**
 * AuxHeadphonesSvg — For AUX Cord Dictator
 */
export const AuxHeadphonesSvg: React.FC<ArtProps> = ({ size = 90 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="aux-glow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="transparent" />
      </RadialGradient>
    </Defs>
    <Circle cx="50" cy="50" r="44" fill="url(#aux-glow)" />
    {/* Headphone Band */}
    <Path
      d="M22 56 C20 30, 80 30, 78 56"
      stroke="#00E5FF"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    {/* Earcups */}
    <Rect x="14" y="48" width="16" height="26" rx="8" fill="#18FFFF" />
    <Rect x="70" y="48" width="16" height="26" rx="8" fill="#18FFFF" />
    {/* Soundwave bars */}
    <G fill="#FF4081">
      <Rect x="40" y="58" width="3" height="12" rx="1.5" />
      <Rect x="46" y="52" width="3" height="24" rx="1.5" />
      <Rect x="52" y="48" width="3" height="32" rx="1.5" />
      <Rect x="58" y="56" width="3" height="16" rx="1.5" />
    </G>
  </Svg>
);

/**
 * ScreenTimeSvg — For Screen Time Penalty
 */
export const ScreenTimeSvg: React.FC<ArtProps> = ({ size = 90 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="screen-glow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FF5252" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="transparent" />
      </RadialGradient>
    </Defs>
    <Circle cx="50" cy="50" r="44" fill="url(#screen-glow)" />
    {/* Phone Facing Down */}
    <Rect x="30" y="20" width="40" height="60" rx="8" fill="#212121" stroke="#FF5252" strokeWidth="2.5" />
    {/* Camera Bump on back */}
    <Rect x="36" y="26" width="12" height="14" rx="3" fill="#37474F" />
    <Circle cx="42" cy="31" r="2.5" fill="#102027" />
    <Circle cx="42" cy="36" r="1.5" fill="#102027" />
    {/* Red Do Not Touch Slash */}
    <Circle cx="50" cy="56" r="12" stroke="#FF1744" strokeWidth="3" fill="none" />
    <Path d="M42 48 L58 64" stroke="#FF1744" strokeWidth="3" />
  </Svg>
);

/**
 * AwkwardDutySvg — For Awkward Duty
 */
export const AwkwardDutySvg: React.FC<ArtProps> = ({ size = 90 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="duty-glow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FF9800" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="transparent" />
      </RadialGradient>
    </Defs>
    <Circle cx="50" cy="50" r="44" fill="url(#duty-glow)" />
    {/* Waiter Tray with Cloche / Cup */}
    <Path d="M22 66 L78 66" stroke="#FFB300" strokeWidth="4" strokeLinecap="round" />
    <Path d="M30 66 C30 42, 70 42, 70 66 Z" fill="#FFE082" stroke="#FF9800" strokeWidth="2" />
    <Circle cx="50" cy="40" r="4" fill="#FFB300" />
    {/* Sweat drop of awkwardness */}
    <Path d="M72 32 C72 26, 76 22, 76 22 C76 22, 80 26, 80 32 C80 35, 76 38, 72 32 Z" fill="#00E5FF" />
  </Svg>
);
