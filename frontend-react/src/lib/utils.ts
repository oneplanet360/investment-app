/**
 * Calculates the perceived brightness of a hex color and returns
 * a suitable high-contrast foreground color (dark or light).
 */
export function getContrastColor(hexColor: string): string {
  // If no color or invalid color, default to black text
  if (!hexColor || !/^#[0-9A-F]{6}$/i.test(hexColor)) {
    return "#111827"; // Dark gray (Tailwind gray-900)
  }

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // YIQ formula for perceived luminance
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Threshold can be adjusted (128 is middle).
  // If YIQ is high, background is light, return dark text.
  // If YIQ is low, background is dark, return light text.
  return yiq >= 128 ? "#111827" : "#ffffff";
}

/**
 * Same as getContrastColor but returns a softer muted version for secondary text.
 */
export function getMutedContrastColor(hexColor: string): string {
  if (!hexColor || !/^#[0-9A-F]{6}$/i.test(hexColor)) {
    return "#6b7280"; // Tailwind gray-500
  }

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? "#6b7280" : "#9ca3af"; // gray-500 for light bg, gray-400 for dark bg
}
