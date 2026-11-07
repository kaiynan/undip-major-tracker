// =============================================================================
// UNDIP Major Matcher — Utility Functions
// =============================================================================

/**
 * Concatenates class names, filtering out falsy values.
 *
 * @example
 * cn('btn', isActive && 'btn-active', undefined, 'btn-lg')
 * // => 'btn btn-active btn-lg'
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Clamps a number between a minimum and maximum value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to a specified number of decimal places.
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
