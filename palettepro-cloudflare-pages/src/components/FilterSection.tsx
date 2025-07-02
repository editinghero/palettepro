
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface FilterSectionProps {
  onFilterChange: (category: string) => void;
  activeFilter: string;
}

const FilterSection = ({ onFilterChange, activeFilter }: FilterSectionProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const categories = [
    'All',
    'Popular',
    'Bright',
    'Dark',
    'Neon',
    'Pastel',
    'Warm',
    'Cool',
    'Monochrome',
    'Sunset',
    'Ocean'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (window.innerWidth <= 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`sticky top-20 z-40 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 py-4 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(category)}
              className="whitespace-nowrap transition-all duration-300"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
