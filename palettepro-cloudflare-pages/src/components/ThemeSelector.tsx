
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ThemeSelector = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
          <Palette className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700">
        {Object.entries(availableThemes).map(([themeName, colors]) => (
          <DropdownMenuItem
            key={themeName}
            onClick={() => setTheme(themeName)}
            className={`flex items-center space-x-2 text-gray-300 hover:bg-gray-700 cursor-pointer ${
              currentTheme === themeName ? 'bg-gray-700' : ''
            }`}
          >
            <div
              className="w-4 h-4 rounded-full border border-gray-600"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="capitalize">{themeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
