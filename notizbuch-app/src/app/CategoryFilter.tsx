"use client";

import { useFilterStore } from "@/store/filterStore";

export function CategoryFilter() {
  // Wir holen uns die aktuelle Kategorie und die Änderungs-Funktion aus dem globalen Zustand
  const { currentCategory, setCategory } = useFilterStore();

  const categories = ["Alle", "Arbeit", "Privat", "Idee"];

  return (
    <div className="flex gap-2 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
            currentCategory === cat
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
