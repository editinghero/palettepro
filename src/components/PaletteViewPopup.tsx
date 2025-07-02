
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { View, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { hexToHsl } from '@/utils/colorSearch';

interface PaletteViewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
  paletteName?: string;
}

const PaletteViewPopup = ({ isOpen, onClose, colors, paletteName }: PaletteViewPopupProps) => {
  const [relatedPalettes, setRelatedPalettes] = useState<Array<{ colors: string[]; name: string }>>([]);
  const [colorShades, setColorShades] = useState<Array<{ baseColor: string; shades: string[] }>>([]);
  const { toast } = useToast();

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

  const generateShades = (baseColor: string) => {
    const hsl = hexToHsl(baseColor);
    const shades = [];
    
    for (let i = 10; i <= 90; i += 10) {
      if (i !== Math.round(hsl.l / 10) * 10) {
        shades.push(hslToHex(hsl.h, hsl.s, i));
      }
    }
    
    return shades.sort((a, b) => {
      const aHsl = hexToHsl(a);
      const bHsl = hexToHsl(b);
      return aHsl.l - bHsl.l;
    });
  };

  const generateRelatedPalettes = (baseColors: string[]) => {
    const related = [];
    
    baseColors.forEach((baseColor, index) => {
      const hsl = hexToHsl(baseColor);
      
      const complementaryColors = [
        baseColor,
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 90) % 360, Math.max(30, hsl.s - 20), Math.min(80, hsl.l + 10)),
        hslToHex((hsl.h + 270) % 360, Math.max(30, hsl.s - 20), Math.min(80, hsl.l + 10))
      ];
      
      const analogousColors = [
        baseColor,
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
      ];
      
      const monochromaticColors = [
        hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 30)),
        hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 15)),
        baseColor,
        hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 15))
      ];
      
      related.push(
        { colors: complementaryColors, name: `Complementary ${index + 1}` },
        { colors: analogousColors, name: `Analogous ${index + 1}` },
        { colors: monochromaticColors, name: `Monochromatic ${index + 1}` }
      );
    });
    
    return related.slice(0, 6);
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Copied!",
      description: `Color ${color} copied to clipboard`,
    });
  };

  const copyPalette = (colors: string[]) => {
    navigator.clipboard.writeText(colors.join(', '));
    toast({
      title: "Copied!",
      description: "Palette colors copied to clipboard",
    });
  };

  useEffect(() => {
    if (isOpen && colors.length > 0) {
      setRelatedPalettes(generateRelatedPalettes(colors));
      setColorShades(colors.map(color => ({
        baseColor: color,
        shades: generateShades(color)
      })));
    }
  }, [isOpen, colors]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {paletteName || 'Palette Details'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Original Palette</h3>
            <div className="flex h-16 rounded-lg overflow-hidden">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center group relative"
                  style={{ backgroundColor: color }}
                  onClick={() => copyColor(color)}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="w-4 h-4 text-white drop-shadow-lg" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex space-x-4 text-xs font-mono text-gray-400">
                {colors.map((color, index) => (
                  <span key={index} className="cursor-pointer hover:text-gray-200" onClick={() => copyColor(color)}>
                    {color.toUpperCase()}
                  </span>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyPalette(colors)}
                className="text-gray-400 hover:text-white"
              >
                Copy All
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Color Shades</h3>
            <div className="space-y-4">
              {colorShades.map((colorData, index) => (
                <div key={index}>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Shades of {colorData.baseColor.toUpperCase()}
                  </h4>
                  <div className="flex h-12 rounded-lg overflow-hidden">
                    {colorData.shades.map((shade, shadeIndex) => (
                      <div
                        key={shadeIndex}
                        className="flex-1 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center group relative"
                        style={{ backgroundColor: shade }}
                        onClick={() => copyColor(shade)}
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-3 h-3 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Related Palettes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPalettes.map((palette, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">{palette.name}</h4>
                  <div className="flex h-12 rounded overflow-hidden">
                    {palette.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="flex-1 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center group relative"
                        style={{ backgroundColor: color }}
                        onClick={() => copyColor(color)}
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-3 h-3 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex space-x-2 text-xs font-mono text-gray-500 overflow-x-auto">
                      {palette.colors.map((color, colorIndex) => (
                        <span key={colorIndex} className="cursor-pointer hover:text-gray-300 whitespace-nowrap" onClick={() => copyColor(color)}>
                          {color.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPalette(palette.colors)}
                      className="text-gray-500 hover:text-gray-300 text-xs"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaletteViewPopup;
