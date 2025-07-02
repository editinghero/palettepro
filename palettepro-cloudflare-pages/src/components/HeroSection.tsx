
import { Sparkles, Palette, Zap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const HeroSection = () => {
  const { themeColors } = useTheme();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-6">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accent})` 
            }}
          >
            <Palette className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent mb-6"
          style={{ 
            backgroundImage: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accent})` 
          }}
        >
          Professional Color
          <br />
          Gradient Generator
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Generate unlimited professional color gradients and palettes for your design projects with our advanced AI-powered tools
        </p>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Sparkles 
              className="w-4 h-4"
              style={{ color: themeColors.primary }}
            />
            <span>Unlimited Gradients</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap 
              className="w-4 h-4"
              style={{ color: themeColors.secondary }}
            />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center space-x-2">
            <Palette 
              className="w-4 h-4"
              style={{ color: themeColors.accent }}
            />
            <span>Professional Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
