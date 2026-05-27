/**
 * Elegant Eco Luxe Color Palette
 * 🎨 Official color scheme for the Tombola application
 */

export const ElegantEcoLuxeColors = {
  // 🌿 Primary Colors
  deepGreen: '#1B4332',        // Primary - Deep Green
  softGreen: '#74C69D',        // Secondary - Soft Green

  // 🧴 Background Colors
  beigeBackground: '#F5F3EF',  // Main background - Beige
  cream: '#FAF9F6',            // Secondary background - Cream

  // ✨ Accent Colors
  goldAccent: '#C6A969',       // Gold accent for highlights

  // ⚫ Text & Neutral
  text: '#2D2D2D',             // Primary text color

  // 🎨 Extended Palette (derived)
  darkGreen: '#1B4332',        // Alias for deepGreen
  lightGreen: '#E8F3EA',       // Light green tint
  paleBeige: '#F6F6EF',        // Pale beige
  softGold: '#C6A969',         // Soft gold
  darkText: '#2D2D2D',         // Dark text
  mediumGray: '#6B7B6A',       // Medium gray for secondary text
  lightBorder: '#E8E3D8',      // Light border color
} as const;

export type ColorName = keyof typeof ElegantEcoLuxeColors;

/**
 * Get a color value from the palette
 */
export const getColor = (colorName: ColorName): string => {
  return ElegantEcoLuxeColors[colorName];
};

/**
 * CSS Variables - Add to your global CSS root
 */
export const cssVariables = `
:root {
  --color-primary: ${ElegantEcoLuxeColors.deepGreen};
  --color-primary-light: ${ElegantEcoLuxeColors.softGreen};
  --color-accent: ${ElegantEcoLuxeColors.goldAccent};
  --color-bg-beige: ${ElegantEcoLuxeColors.beigeBackground};
  --color-bg-cream: ${ElegantEcoLuxeColors.cream};
  --color-text: ${ElegantEcoLuxeColors.text};
  --color-medium-gray: ${ElegantEcoLuxeColors.mediumGray};
  --color-light-border: ${ElegantEcoLuxeColors.lightBorder};
}
`;

// CSS variable strings for use in inline styles or JS-driven styles
export const cssVarStrings: Record<string, string> = {
  deepGreen: 'var(--color-primary)',
  softGreen: 'var(--color-primary-light)',
  goldAccent: 'var(--color-accent)',
  beigeBackground: 'var(--color-bg-beige)',
  cream: 'var(--color-bg-cream)',
  text: 'var(--color-text)',
  mediumGray: 'var(--color-medium-gray)',
  lightBorder: 'var(--color-light-border)'
};

export const cssVar = (name: keyof typeof cssVarStrings) => cssVarStrings[name];
