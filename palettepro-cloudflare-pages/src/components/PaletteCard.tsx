
import { useState } from 'react';
import { Copy, Download, View } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PaletteViewPopup from './PaletteViewPopup';

interface PaletteCardProps {
  colors: string[];
  id: string;
  name?: string;
}

const PaletteCard = ({ colors, id, name }: PaletteCardProps) => {
  const { toast } = useToast();
  const [isViewOpen, setIsViewOpen] = useState(false);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Copied!",
      description: `Color ${color} copied to clipboard`,
    });
  };

  const copyAllColors = () => {
    navigator.clipboard.writeText(colors.join(', '));
    toast({
      title: "Copied!",
      description: "All colors copied to clipboard",
    });
  };

  const downloadPalette = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 200;
    
    if (ctx) {
      const colorWidth = canvas.width / colors.length;
      colors.forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.fillRect(index * colorWidth, 0, colorWidth, canvas.height);
      });
      
      const link = document.createElement('a');
      link.download = `color-palette-${id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
    
    toast({
      title: "Downloaded!",
      description: "Palette saved as PNG",
    });
  };

  return (
    <>
      <div className="group bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700 animate-fade-in">
        <div className="flex h-48 relative overflow-hidden">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 cursor-pointer transition-all duration-300 hover:scale-105 relative group/color"
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color)}
            >
              <div className="absolute inset-0 bg-black/0 group-hover/color:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover/color:opacity-100 transition-opacity duration-300">
                  <Copy className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="text-xs font-mono text-gray-400 hover:text-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => copyToClipboard(color)}
                >
                  {color.toUpperCase()}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAllColors}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadPalette}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsViewOpen(true)}
                className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-gray-700"
              >
                <View className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {name && (
            <div className="text-sm text-gray-300 font-medium">
              {name}
            </div>
          )}
        </div>
      </div>

      <PaletteViewPopup
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        colors={colors}
        paletteName={name}
      />
    </>
  );
};

export default PaletteCard;
