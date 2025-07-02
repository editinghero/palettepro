import { useState, useEffect, useMemo } from 'react';
import PaletteCard from './PaletteCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { colorContainsSearch, getSearchColor, hexToHsl } from '@/utils/colorSearch';

interface PaletteGridProps {
  activeFilter: string;
  shouldGenerate: boolean;
  onGenerateComplete: () => void;
  searchTerm: string;
}

const PaletteGrid = ({ activeFilter, shouldGenerate, onGenerateComplete, searchTerm }: PaletteGridProps) => {
  const [palettes, setPalettes] = useState<Array<{ id: string; colors: string[]; name?: string; category?: string }>>([]);
  const [loading, setLoading] = useState(false);

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Generate random number within range
  const randomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate related colors based on a base color
  const generateRelatedColors = (baseColor: string, count: number = 4) => {
    const baseHsl = hexToHsl(baseColor);
    const colors = [baseColor]; // Include the base color
    
    // Generate complementary and analogous colors
    for (let i = 1; i < count; i++) {
      let newHue, newSat, newLight;
      
      if (i === 1) {
        // Complementary color
        newHue = (baseHsl.h + 180) % 360;
        newSat = Math.max(30, baseHsl.s + randomInRange(-20, 20));
        newLight = Math.max(20, Math.min(80, baseHsl.l + randomInRange(-15, 15)));
      } else if (i === 2) {
        // Analogous color 1
        newHue = (baseHsl.h + randomInRange(30, 60)) % 360;
        newSat = Math.max(30, baseHsl.s + randomInRange(-15, 15));
        newLight = Math.max(20, Math.min(80, baseHsl.l + randomInRange(-10, 10)));
      } else {
        // Analogous color 2
        newHue = (baseHsl.h - randomInRange(30, 60) + 360) % 360;
        newSat = Math.max(30, baseHsl.s + randomInRange(-15, 15));
        newLight = Math.max(20, Math.min(80, baseHsl.l + randomInRange(-10, 10)));
      }
      
      colors.push(hslToHex(newHue, newSat, newLight));
    }
    
    return colors;
  };

  // Generate category-specific color palettes with more vibrant colors
  const generateCategoryPalette = (category: string) => {
    switch (category) {
      case 'Bright':
        return Array.from({ length: 4 }, () => {
          const hue = randomInRange(0, 360);
          const saturation = randomInRange(85, 100);
          const lightness = randomInRange(55, 75);
          return hslToHex(hue, saturation, lightness);
        });

      case 'Dark':
        return Array.from({ length: 4 }, () => {
          const hue = randomInRange(0, 360);
          const saturation = randomInRange(40, 90);
          const lightness = randomInRange(15, 35);
          return hslToHex(hue, saturation, lightness);
        });

      case 'Neon':
        {
          const neonHues = [300, 120, 180, 60, 0, 240, 330, 270, 90, 210];
          return Array.from({ length: 4 }, () => {
            const hue = neonHues[Math.floor(Math.random() * neonHues.length)];
            const saturation = randomInRange(95, 100);
            const lightness = randomInRange(65, 85);
            return hslToHex(hue, saturation, lightness);
          });
        }

      case 'Pastel':
        return Array.from({ length: 4 }, () => {
          const hue = randomInRange(0, 360);
          const saturation = randomInRange(35, 65);
          const lightness = randomInRange(70, 85);
          return hslToHex(hue, saturation, lightness);
        });

      case 'Warm':
        {
          const warmHues = [0, 15, 30, 45, 60, 350, 25, 40];
          return Array.from({ length: 4 }, () => {
            const hue = warmHues[Math.floor(Math.random() * warmHues.length)] + randomInRange(-8, 8);
            const saturation = randomInRange(65, 95);
            const lightness = randomInRange(45, 70);
            return hslToHex(hue, saturation, lightness);
          });
        }

      case 'Cool':
        {
          const coolHues = [180, 200, 220, 240, 260, 280, 190, 210, 230, 250];
          return Array.from({ length: 4 }, () => {
            const hue = coolHues[Math.floor(Math.random() * coolHues.length)] + randomInRange(-12, 12);
            const saturation = randomInRange(55, 85);
            const lightness = randomInRange(45, 70);
            return hslToHex(hue, saturation, lightness);
          });
        }

      case 'Monochrome':
        {
          const monochromeHue = randomInRange(0, 360);
          return Array.from({ length: 4 }, (_, index) => {
            const saturation = index === 0 ? randomInRange(0, 15) : randomInRange(15, 40);
            const lightness = 25 + (index * 18);
            return hslToHex(monochromeHue, saturation, lightness);
          });
        }

      case 'Sunset':
        {
          const sunsetVariations = [
            [{ h: 15, s: 85, l: 65 }, { h: 0, s: 80, l: 60 }, { h: 330, s: 75, l: 70 }, { h: 280, s: 65, l: 55 }],
            [{ h: 25, s: 90, l: 70 }, { h: 10, s: 85, l: 65 }, { h: 340, s: 80, l: 75 }, { h: 290, s: 70, l: 60 }],
            [{ h: 35, s: 88, l: 68 }, { h: 20, s: 83, l: 63 }, { h: 350, s: 78, l: 73 }, { h: 300, s: 68, l: 58 }]
          ];
          const variation = sunsetVariations[Math.floor(Math.random() * sunsetVariations.length)];
          return variation.map(color => 
            hslToHex(
              color.h + randomInRange(-8, 8),
              color.s + randomInRange(-5, 5),
              color.l + randomInRange(-5, 5)
            )
          );
        }

      case 'Ocean':
        {
          const oceanHues = [180, 190, 200, 210, 220, 170, 185, 195, 205, 215];
          return Array.from({ length: 4 }, () => {
            const hue = oceanHues[Math.floor(Math.random() * oceanHues.length)] + randomInRange(-8, 8);
            const saturation = randomInRange(70, 95);
            const lightness = randomInRange(40, 70);
            return hslToHex(hue, saturation, lightness);
          });
        }

      case 'Popular':
        {
          const popularCombos = [
            ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
            ['#FFEAA7', '#DDA0DD', '#98D8C8', '#FDCB6F'],
            ['#FF7675', '#74B9FF', '#00B894', '#FDCB6E'],
            ['#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7'],
            ['#E17055', '#00B894', '#0984E3', '#6C5CE7'],
            ['#FD79A8', '#FDCB6E', '#00CEC9', '#74B9FF'],
            ['#E84393', '#00B894', '#0984E3', '#FDCB6E'],
            ['#FF7675', '#A29BFE', '#55A3FF', '#26DE81']
          ];
          return popularCombos[Math.floor(Math.random() * popularCombos.length)];
        }

      default: // 'All'
        {
          const allCategories = ['Bright', 'Dark', 'Neon', 'Pastel', 'Warm', 'Cool', 'Monochrome', 'Sunset', 'Ocean', 'Popular'];
          const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
          return generateCategoryPalette(randomCategory);
        }
    }
  };

  const generatePalettes = async () => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if we have a search term and should generate related colors
    const searchColor = searchTerm ? getSearchColor(searchTerm) : null;
    
    if (searchColor && searchTerm) {
      // Generate palettes based on the search color for the active category
      const newPalettes = [];
      
      if (activeFilter === 'All') {
        // Generate multiple variations based on the search color from all categories
        for (let i = 0; i < 12; i++) {
          const relatedColors = generateRelatedColors(searchColor, 4);
          newPalettes.push({
            id: `search-${Date.now()}-${i}`,
            colors: relatedColors,
            name: `${searchTerm} Related ${i + 1}`,
            category: 'Search Results'
          });
        }
        
        // Also generate some category-based palettes that might contain the search color
        const allCategories = ['Bright', 'Dark', 'Neon', 'Pastel', 'Warm', 'Cool', 'Popular'];
        for (const category of allCategories) {
          for (let i = 0; i < 2; i++) {
            newPalettes.push({
              id: `search-category-${Date.now()}-${category}-${i}`,
              colors: generateCategoryPalette(category),
              name: `${category} Palette`,
              category: category
            });
          }
        }
      } else {
        // Generate palettes for the specific category that contain the search color
        for (let i = 0; i < 16; i++) {
          const categoryColors = generateCategoryPalette(activeFilter);
          // Replace one color with the search color or a related color
          const searchRelated = generateRelatedColors(searchColor, 1)[0];
          categoryColors[Math.floor(Math.random() * categoryColors.length)] = Math.random() > 0.5 ? searchColor : searchRelated;
          
          newPalettes.push({
            id: `search-${activeFilter}-${Date.now()}-${i}`,
            colors: categoryColors,
            name: `${activeFilter} with ${searchTerm} ${i + 1}`,
            category: activeFilter
          });
        }
        
        // Also add some pure search-related palettes
        for (let i = 0; i < 8; i++) {
          const relatedColors = generateRelatedColors(searchColor, 4);
          newPalettes.push({
            id: `search-pure-${Date.now()}-${i}`,
            colors: relatedColors,
            name: `${searchTerm} Related ${i + 1}`,
            category: 'Search Results'
          });
        }
      }
      
      // Shuffle the array
      for (let i = newPalettes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPalettes[i], newPalettes[j]] = [newPalettes[j], newPalettes[i]];
      }
      
      setPalettes(newPalettes);
    } else if (activeFilter === 'All' || searchTerm) {
      // Generate palettes from all categories when filter is 'All' or when searching
      const allCategories = ['Bright', 'Dark', 'Neon', 'Pastel', 'Warm', 'Cool', 'Monochrome', 'Sunset', 'Ocean', 'Popular'];
      const newPalettes = [];
      
      // Generate 3-4 palettes from each category for comprehensive coverage
      for (const category of allCategories) {
        const palettesPerCategory = category === 'Popular' ? 4 : 3;
        for (let i = 0; i < palettesPerCategory; i++) {
          newPalettes.push({
            id: `${Date.now()}-${category}-${i}`,
            colors: generateCategoryPalette(category),
            name: `${category} Palette ${i + 1}`,
            category: category
          });
        }
      }
      
      // Shuffle the array to mix categories
      for (let i = newPalettes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPalettes[i], newPalettes[j]] = [newPalettes[j], newPalettes[i]];
      }
      
      setPalettes(newPalettes);
    } else {
      // Generate palettes for specific category
      const newPalettes = Array.from({ length: 24 }, (_, index) => ({
        id: `${Date.now()}-${index}`,
        colors: generateCategoryPalette(activeFilter),
        name: `${activeFilter} Palette ${index + 1}`,
        category: activeFilter
      }));
      
      setPalettes(newPalettes);
    }
    
    setLoading(false);
  };

  // Filter palettes based on search term and active category
  const filteredPalettes = useMemo(() => {
    if (!searchTerm.trim()) {
      return palettes;
    }
    
    // If we have an active filter (not 'All'), show palettes that match both the search and category
    const searchFiltered = palettes.filter(palette => 
      colorContainsSearch(palette.colors, searchTerm) || 
      palette.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      palette.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // If activeFilter is not 'All', further filter by category
    if (activeFilter !== 'All') {
      return searchFiltered.filter(palette => 
        palette.category === activeFilter || 
        palette.category === 'Search Results' ||
        palette.name?.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }
    
    return searchFiltered;
  }, [palettes, searchTerm, activeFilter]);

  useEffect(() => {
    generatePalettes();
  }, [activeFilter]);

  useEffect(() => {
    if (shouldGenerate) {
      generatePalettes();
      onGenerateComplete();
    }
  }, [shouldGenerate]);

  // Regenerate when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      generatePalettes();
    }
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {searchTerm ? 
            (activeFilter === 'All' ? 
              `Search Results for "${searchTerm}"` : 
              `${activeFilter} palettes with "${searchTerm}"`
            ) : 
            (activeFilter === 'All' ? 'All Gradients' : `${activeFilter} Gradients`)
          }
        </h2>
        <Button
          variant="outline"
          onClick={generatePalettes}
          disabled={loading}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generating...' : searchTerm ? 'Generate Related' : 'Refresh'}
        </Button>
      </div>
      
      {searchTerm && filteredPalettes.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} palettes found for "{searchTerm}"
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Try a different color name or hex code{activeFilter !== 'All' ? ` in ${activeFilter} category` : ''}
          </p>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl h-64 animate-pulse border border-gray-700" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredPalettes.map((palette) => (
            <PaletteCard
              key={palette.id}
              colors={palette.colors}
              id={palette.id}
              name={palette.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PaletteGrid;
