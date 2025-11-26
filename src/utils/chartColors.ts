/**
 * Professional, distinct, and contrasting color palette for charts
 * Colors are chosen to be visually distinct and provide high contrast
 */

// Primary contrasting color palette - optimized for line charts
export const DISTINCT_CHART_COLORS = [
  '#0075FF', // Electric Blue - Primary brand color
  '#FF6B6B', // Coral Red - High contrast to blue
  '#4ECDC4', // Turquoise - Distinct from blue
  '#FFA726', // Orange - High contrast
  '#9C27B0', // Purple - Distinct from blue
  '#00C853', // Green - Natural contrast
  '#E91E63', // Pink/Magenta - Distinct
  '#FF5722', // Deep Orange - High contrast
  '#009688', // Teal - Distinct shade
  '#795548', // Brown - Unique
  '#607D8B', // Blue Grey - Subtle distinct
  '#FFC107', // Amber - Bright contrast
  '#3F51B5', // Indigo - Distinct blue shade
  '#F44336', // Red - Strong contrast
  '#8BC34A', // Light Green - Natural contrast
  '#00BCD4', // Cyan - Distinct from turquoise
  '#FF9800', // Orange - Bright
  '#673AB7', // Deep Purple - Distinct
]

// Extended palette for charts with many data series (up to 20 colors)
export const EXTENDED_CHART_COLORS = [
  ...DISTINCT_CHART_COLORS,
  '#CDDC39', // Lime
  '#FFEB3B', // Yellow
  '#FF4081', // Pink
  '#2196F3', // Blue
  '#4CAF50', // Green
]

/**
 * Get distinct colors for a chart based on the number of data series needed
 * Ensures all colors are unique and contrasting
 */
export function getChartColors(count: number): string[] {
  const palette = count > DISTINCT_CHART_COLORS.length 
    ? EXTENDED_CHART_COLORS 
    : DISTINCT_CHART_COLORS
  
  return palette.slice(0, count)
}

/**
 * Get a specific color by index, cycling through the palette if needed
 */
export function getChartColor(index: number): string {
  return DISTINCT_CHART_COLORS[index % DISTINCT_CHART_COLORS.length]
}


