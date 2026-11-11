export const colors = {
  // Backgrounds & Surfaces (deep vibrant midnight purple, high contrast)
  background: '#0D0618',
  backgroundElevated: '#170B2C',
  surface: '#221040',
  surfaceSubtle: '#2D1554',
  card: '#1D0E38',
  cardBorder: '#4E2682',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#BDB0D0',
  textMuted: '#7D6D99',
  textInverse: '#0D0618',
  
  // Bright, cheerful, energetic brand accents (never dull/depressing)
  accentPink: '#FF2E93',
  accentPinkGlow: 'rgba(255, 46, 147, 0.45)',
  accentGold: '#FFEA00', // Bright sunny yellow
  accentGoldGlow: 'rgba(255, 234, 0, 0.45)',
  accentOrange: '#FF7043',
  accentPurple: '#A855F7',
  accentCyan: '#00F0FF',
  accentMint: '#00F5A0',
  
  // Status
  danger: '#FF1744',
  success: '#00E676',
  warning: '#FFC400',
  
  // Skeleton
  skeletonBase: '#261245',
  skeletonHighlight: '#3B1F69',
};

// Radiant gradients for cards, badges, and buttons
export const gradients = {
  sunset: ['#FF2E93', '#FF7043'],
  neonPurple: ['#8B5CF6', '#EC4899'],
  cyberCyan: ['#00F0FF', '#3B82F6'],
  sunburst: ['#FFEA00', '#FF9100'],
  mintGlow: ['#00F5A0', '#00E5FF'],
  partyAura: ['#FF007F', '#7928CA'],
};

// 8 stable distinguishable high-vibrancy player colours for party matches
export const playerColors: Array<{
  id: string;
  name: string;
  main: string;
  glow: string;
  contrastText: string;
}> = [
  { id: 'red', name: 'Red', main: '#FF3366', glow: 'rgba(255, 51, 102, 0.55)', contrastText: '#FFFFFF' },
  { id: 'cyan', name: 'Cyan', main: '#00F0FF', glow: 'rgba(0, 240, 255, 0.55)', contrastText: '#0D0618' },
  { id: 'gold', name: 'Gold', main: '#FFEA00', glow: 'rgba(255, 234, 0, 0.55)', contrastText: '#0D0618' },
  { id: 'purple', name: 'Purple', main: '#B388FF', glow: 'rgba(179, 136, 255, 0.55)', contrastText: '#FFFFFF' },
  { id: 'mint', name: 'Mint', main: '#00F5A0', glow: 'rgba(0, 245, 160, 0.55)', contrastText: '#0D0618' },
  { id: 'orange', name: 'Orange', main: '#FF9100', glow: 'rgba(255, 145, 0, 0.55)', contrastText: '#FFFFFF' },
  { id: 'magenta', name: 'Magenta', main: '#FF4081', glow: 'rgba(255, 64, 129, 0.55)', contrastText: '#FFFFFF' },
  { id: 'lime', name: 'Lime', main: '#76FF03', glow: 'rgba(118, 255, 3, 0.55)', contrastText: '#0D0618' },
];
