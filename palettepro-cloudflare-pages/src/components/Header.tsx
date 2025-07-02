
import { Search, Palette, Shuffle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ThemeSelector from './ThemeSelector';

interface HeaderProps {
  onGenerate: () => void;
  onSearch: (searchTerm: string) => void;
}

const Header = ({ onGenerate, onSearch }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, var(--theme-primary, #8B5CF6), var(--theme-accent, #EC4899))` 
              }}
            >
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h1 
              className="text-2xl font-bold bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, var(--theme-primary, #8B5CF6), var(--theme-accent, #EC4899))` 
              }}
            >
              Palette Pro
            </h1>
          </div>

          <div className="hidden md:flex relative max-w-md flex-1 mx-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search colors (e.g., 'red' or '#FF0000')..." 
              className="pl-10 bg-gray-800 border-gray-700 focus:bg-gray-700 text-white placeholder-gray-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            <ThemeSelector />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={onGenerate}
            >
              <Shuffle className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Generate</span>
            </Button>
          </nav>
        </div>

        <div className="md:hidden mt-4 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search colors (e.g., 'red' or '#FF0000')..." 
            className="pl-10 bg-gray-800 border-gray-700 focus:bg-gray-700 text-white placeholder-gray-400 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
