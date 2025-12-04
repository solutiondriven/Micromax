import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface FilterSectionProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export function FilterSection({ selectedFilters, onFilterChange }: FilterSectionProps) {
  const filterOptions = [
    { id: "all", label: "All Traders", category: "type" },
    { id: "top-performers", label: "Top Performers", category: "type" },
    { id: "crypto", label: "Crypto", category: "specialty" },
    { id: "forex", label: "Forex", category: "specialty" },
    { id: "stocks", label: "Stocks", category: "specialty" },
    { id: "options", label: "Options", category: "specialty" },
    { id: "day-trading", label: "Day Trading", category: "strategy" },
    { id: "swing-trading", label: "Swing Trading", category: "strategy" },
    { id: "scalping", label: "Scalping", category: "strategy" },
  ];

  const toggleFilter = (filterId: string) => {
    if (filterId === "all") {
      onFilterChange([]);
      return;
    }
    
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(f => f !== filterId)
      : [...selectedFilters, filterId];
    
    onFilterChange(newFilters);
  };

  return (
    <section className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Featured Traders</h2>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const isSelected = option.id === "all" 
              ? selectedFilters.length === 0 
              : selectedFilters.includes(option.id);
            
            return (
              <Badge
                key={option.id}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={() => toggleFilter(option.id)}
              >
                {option.label}
              </Badge>
            );
          })}
        </div>
        
        {selectedFilters.length > 0 && (
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange([])}
              className="text-xs h-6"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}