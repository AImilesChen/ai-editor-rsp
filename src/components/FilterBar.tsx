"use client";

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterBar({ categories, activeCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-8 items-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all border ${
            activeCategory === cat
              ? "bg-brand-100 text-brand-500 border-brand-500"
              : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500"
          }`}
        >
          {cat}
        </button>
      ))}
      {activeCategory !== "All" && (
        <button
          onClick={() => onCategoryChange("All")}
          className="text-neutral-500 text-sm cursor-pointer bg-transparent border-none hover:text-error ml-auto"
        >
          Clear
        </button>
      )}
    </div>
  );
}
