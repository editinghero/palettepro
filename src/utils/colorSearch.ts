
// Color search utility functions
export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const isValidHex = (hex: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
};

// Calculate color distance for better matching
const colorDistance = (color1: { h: number; s: number; l: number }, color2: { h: number; s: number; l: number }): number => {
  const hueDiff = Math.min(Math.abs(color1.h - color2.h), 360 - Math.abs(color1.h - color2.h));
  const satDiff = Math.abs(color1.s - color2.s);
  const lightDiff = Math.abs(color1.l - color2.l);
  
  // Weighted distance calculation
  return (hueDiff * 0.5) + (satDiff * 0.3) + (lightDiff * 0.2);
};

export const colorContainsSearch = (colors: string[], searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase().trim();
  
  // Check if it's a hex color
  if (isValidHex(term)) {
    return colors.some(color => {
      const searchHsl = hexToHsl(term);
      const colorHsl = hexToHsl(color);
      
      // Use distance-based matching for better results
      const distance = colorDistance(searchHsl, colorHsl);
      return distance < 60; // Adjusted threshold for better matching
    });
  }
  
  // Enhanced color names mapping with more variations and common misspellings
  const colorNames: { [key: string]: string[] } = {
    red: ['#FF0000', '#DC143C', '#B22222', '#8B0000', '#FF6347', '#FF4500', '#CD5C5C', '#F08080'],
    green: ['#00FF00', '#008000', '#228B22', '#32CD32', '#90EE90', '#00FF7F', '#7CFC00', '#ADFF2F'],
    blue: ['#0000FF', '#000080', '#4169E1', '#6495ED', '#87CEEB', '#4682B4', '#1E90FF', '#00BFFF'],
    yellow: ['#FFFF00', '#FFD700', '#FFFF99', '#F0E68C', '#BDB76B', '#DAA520', '#FAFAD2', '#FFFACD'],
    orange: ['#FFA500', '#FF8C00', '#FF7F50', '#FF6347', '#FF4500', '#CD853F', '#D2691E', '#FF8C69'],
    purple: ['#800080', '#9932CC', '#9400D3', '#8A2BE2', '#BA55D3', '#DA70D6', '#DDA0DD', '#E6E6FA'],
    pink: ['#FFC0CB', '#FF69B4', '#FF1493', '#C71585', '#DB7093', '#FFB6C1', '#FF91A4', '#FFA0C9'],
    black: ['#000000', '#2F2F2F', '#1C1C1C', '#0D0D0D', '#191970', '#2F4F4F', '#36454F', '#28282B'],
    white: ['#FFFFFF', '#F8F8FF', '#F5F5F5', '#DCDCDC', '#D3D3D3', '#C0C0C0', '#E5E4E2', '#F0F0F0'],
    gray: ['#808080', '#696969', '#778899', '#708090', '#2F4F4F', '#A9A9A9', '#BEBEBE', '#D3D3D3'],
    grey: ['#808080', '#696969', '#778899', '#708090', '#2F4F4F', '#A9A9A9', '#BEBEBE', '#D3D3D3'],
    brown: ['#A52A2A', '#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460', '#D2B48C', '#BC8F8F'],
    cyan: ['#00FFFF', '#E0FFFF', '#00CED1', '#48D1CC', '#40E0D0', '#7FFFD4', '#B0E0E6', '#AFEEEE'],
    magenta: ['#FF00FF', '#DA70D6', '#BA55D3', '#C71585', '#FF1493', '#FF69B4', '#EE82EE', '#DDA0DD'],
    lime: ['#00FF00', '#32CD32', '#7CFC00', '#ADFF2F', '#9AFF9A', '#98FB98', '#00FA9A', '#90EE90'],
    navy: ['#000080', '#191970', '#25025C', '#0F0F50', '#1E1E3F', '#2F2F4F', '#36454F', '#483D8B'],
    teal: ['#008080', '#20B2AA', '#48D1CC', '#00CED1', '#5F9EA0', '#708090', '#2F4F4F', '#4682B4'],
    silver: ['#C0C0C0', '#D3D3D3', '#DCDCDC', '#E5E4E2', '#BCC6CC', '#A8A8A8', '#B8B8B8', '#BEBEBE'],
    gold: ['#FFD700', '#DAA520', '#B8860B', '#CD853F', '#DEB887', '#F0E68C', '#EEE8AA', '#FFDF00'],
    violet: ['#8A2BE2', '#9400D3', '#9932CC', '#BA55D3', '#DA70D6', '#DDA0DD', '#EE82EE', '#E6E6FA'],
    indigo: ['#4B0082', '#483D8B', '#6A5ACD', '#7B68EE', '#9370DB', '#8470FF', '#9966CC', '#663399'],
    turquoise: ['#40E0D0', '#48D1CC', '#00CED1', '#5F9EA0', '#20B2AA', '#7FFFD4', '#AFEEEE', '#B0E0E6'],
    coral: ['#FF7F50', '#F08080', '#FA8072', '#E9967A', '#FFA07A', '#FF6347', '#FF5722', '#FF4500'],
    salmon: ['#FA8072', '#FFA07A', '#E9967A', '#F08080', '#CD5C5C', '#BC8F8F', '#FFB07A', '#FF8C69'],
    // Add common misspellings and variations
    sean: ['#7CFC00', '#32CD32', '#00FF7F', '#ADFF2F', '#9AFF9A'], // Green variations for "sean" (green)
    emerald: ['#50C878', '#00C957', '#4CBB17', '#228B22', '#006A4E'],
    aqua: ['#00FFFF', '#7FFFD4', '#40E0D0', '#48D1CC', '#00CED1'],
    crimson: ['#DC143C', '#B22222', '#8B0000', '#A0522D', '#CD5C5C'],
    azure: ['#F0FFFF', '#E0FFFF', '#B0E0E6', '#87CEEB', '#4682B4']
  };
  
  // Direct color name match
  if (colorNames[term]) {
    return colorNames[term].some(namedColor => 
      colors.some(color => {
        const namedHsl = hexToHsl(namedColor);
        const colorHsl = hexToHsl(color);
        const distance = colorDistance(namedHsl, colorHsl);
        return distance < 80;
      })
    );
  }
  
  // Check partial matches and similar spellings
  const partialMatches = Object.keys(colorNames).filter(colorName => 
    colorName.includes(term) || term.includes(colorName) || 
    // Check for common misspellings/variations
    (term.length > 2 && colorName.toLowerCase().startsWith(term.substring(0, 3)))
  );
  
  if (partialMatches.length > 0) {
    return partialMatches.some(colorName => 
      colorNames[colorName].some(namedColor => 
        colors.some(color => {
          const namedHsl = hexToHsl(namedColor);
          const colorHsl = hexToHsl(color);
          const distance = colorDistance(namedHsl, colorHsl);
          return distance < 80;
        })
      )
    );
  }
  
  return false;
};

// Extract the dominant color from search term for generation
export const getSearchColor = (searchTerm: string): string | null => {
  const term = searchTerm.toLowerCase().trim();
  
  // If it's a valid hex color, return it
  if (isValidHex(term)) {
    return term;
  }
  
  // Color names mapping - return the most representative color
  const colorRepresentatives: { [key: string]: string } = {
    red: '#FF0000',
    green: '#00FF00', 
    blue: '#0000FF',
    yellow: '#FFFF00',
    orange: '#FFA500',
    purple: '#800080',
    pink: '#FFC0CB',
    black: '#000000',
    white: '#FFFFFF',
    gray: '#808080',
    grey: '#808080',
    brown: '#A52A2A',
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    lime: '#00FF00',
    navy: '#000080',
    teal: '#008080',
    silver: '#C0C0C0',
    gold: '#FFD700',
    violet: '#8A2BE2',
    indigo: '#4B0082',
    turquoise: '#40E0D0',
    coral: '#FF7F50',
    salmon: '#FA8072',
    sean: '#32CD32', // Green for "sean"
    emerald: '#50C878',
    aqua: '#00FFFF',
    crimson: '#DC143C',
    azure: '#F0FFFF'
  };
  
  // Direct match
  if (colorRepresentatives[term]) {
    return colorRepresentatives[term];
  }
  
  // Partial match
  const partialMatch = Object.keys(colorRepresentatives).find(colorName => 
    colorName.includes(term) || term.includes(colorName)
  );
  
  return partialMatch ? colorRepresentatives[partialMatch] : null;
};
