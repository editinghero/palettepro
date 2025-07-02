
import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FilterSection from '@/components/FilterSection';
import PaletteGrid from '@/components/PaletteGrid';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [shouldGenerate, setShouldGenerate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleGenerate = () => {
    setShouldGenerate(true);
  };

  const handleGenerateComplete = () => {
    setShouldGenerate(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-900 font-inter">
        <Header onGenerate={handleGenerate} onSearch={handleSearch} />
        <HeroSection />
        <FilterSection 
          onFilterChange={setActiveFilter} 
          activeFilter={activeFilter}
        />
        <PaletteGrid 
          activeFilter={activeFilter}
          shouldGenerate={shouldGenerate}
          onGenerateComplete={handleGenerateComplete}
          searchTerm={searchTerm}
        />
      </div>
    </ThemeProvider>
  );
};

export default Index;
