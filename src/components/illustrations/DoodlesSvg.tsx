import React from 'react';
import Svg, {
  Path,
  Circle,
  Defs,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';

/**
 * Hand-drawn crown doodle matching the reference logo
 */
export const CrownDoodle: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = '#FFEA00',
}) => (
  <Svg width={size} height={size * 0.75} viewBox="0 0 40 30">
    <Path
      d="M4 24 L8 8 L18 16 L28 6 L34 24 Z"
      fill={color}
      stroke="#FFF59D"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="8" cy="7" r="2.2" fill="#FFFFFF" />
    <Circle cx="18" cy="15" r="2.2" fill="#FFFFFF" />
    <Circle cx="28" cy="5" r="2.2" fill="#FFFFFF" />
  </Svg>
);

/**
 * Sparkle doodle matching the reference title decorators
 */
export const SparkleDoodle: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = '#FFF59D',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z"
      fill={color}
    />
  </Svg>
);

/**
 * Radiant central starburst starlight matching Screen 1 (Drop In)
 */
export const CentralStarburst: React.FC<{ size?: number }> = ({ size = 260 }) => (
  <Svg width={size} height={size} viewBox="0 0 200 200">
    <Defs>
      <RadialGradient id="star-glow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFF" stopOpacity="1" />
        <Stop offset="20%" stopColor="#FF4081" stopOpacity="0.9" />
        <Stop offset="55%" stopColor="#7C4DFF" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="#0B0416" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    {/* Large ambient aura */}
    <Circle cx="100" cy="100" r="95" fill="url(#star-glow)" />

    {/* Radiant laser spikes / star rays */}
    <G stroke="#FF4081" strokeWidth="1.5" opacity="0.75">
      <Path d="M100 10 L100 190" />
      <Path d="M10 100 L190 100" />
      <Path d="M36 36 L164 164" />
      <Path d="M36 164 L164 36" />
      <Path d="M100 30 L100 170" stroke="#FFD54F" strokeWidth="2.5" />
      <Path d="M30 100 L170 100" stroke="#FFD54F" strokeWidth="2.5" />
      <Path d="M50 50 L150 150" stroke="#FFD54F" strokeWidth="2" />
      <Path d="M50 150 L150 50" stroke="#FFD54F" strokeWidth="2" />
    </G>

    {/* Center 8-point bright spark */}
    <Path
      d="M100 70 Q100 100 130 100 Q100 100 100 130 Q100 100 70 100 Q100 100 100 70 Z"
      fill="#FFFFFF"
    />
    <Circle cx="100" cy="100" r="7" fill="#FFF59D" />
  </Svg>
);

/**
 * Stylized cartoon hand pointing into the center (Screen 1 reference design)
 */
export const PointingHandSvg: React.FC<{
  color?: string;
  rotation?: number; // degrees
  scale?: number;
}> = ({ color = '#FF4081', rotation = 0, scale = 1 }) => (
  <Svg
    width={90 * scale}
    height={100 * scale}
    viewBox="0 0 90 100"
    style={{ transform: [{ rotate: `${rotation}deg` }] }}
  >
    <Defs>
      <RadialGradient id={`hand-glow-${color}`} cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <Stop offset="100%" stopColor={color} stopOpacity="0" />
      </RadialGradient>
    </Defs>
    {/* Shadow / Glow */}
    <Circle cx="45" cy="50" r="38" fill={`url(#hand-glow-${color})`} />

    {/* Arm / Wrist entering from outside */}
    <Path d="M30 100 C30 80, 60 80, 60 100 Z" fill={color} opacity="0.9" />

    {/* Palm */}
    <Path
      d="M26 80 C24 60, 32 50, 45 50 C58 50, 66 60, 64 80 Z"
      fill={color}
    />

    {/* Extended Index Finger pointing towards (45, 12) */}
    <Path
      d="M40 50 L40 18 C40 12, 50 12, 50 18 L50 50 Z"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth="1.5"
    />

    {/* Curled Middle, Ring, Pinky Fingers */}
    <Path d="M50 50 C50 42, 60 42, 60 50 C60 56, 50 56, 50 50 Z" fill={color} />
    <Path d="M56 54 C56 46, 65 46, 65 54 C65 60, 56 60, 56 54 Z" fill={color} />
    <Path d="M60 60 C60 54, 68 54, 68 60 C68 66, 60 66, 60 60 Z" fill={color} />

    {/* Folded Thumb */}
    <Path
      d="M26 62 C20 54, 30 46, 36 54 Z"
      fill={color}
    />

    {/* Finger Tip Highlight Spark */}
    <Circle cx="45" cy="16" r="3" fill="#FFFFFF" />
  </Svg>
);
