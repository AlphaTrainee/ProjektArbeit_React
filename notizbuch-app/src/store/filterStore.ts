import { create } from "zustand";

// Definition, welche Daten und Funktionen im Store liegen
interface FilterState {
  currentCategory: string; // Die aktuell gewählte Kategorie ("Alle", "Arbeit", etc.)
  setCategory: (category: string) => void; // Funktion zum Ändern der Kategorie
}

export const useFilterStore = create<FilterState>((set) => ({
  currentCategory: "Alle", // Startwert: Es werden alle Notizen angezeigt
  setCategory: (category) => set({ currentCategory: category }),
}));
