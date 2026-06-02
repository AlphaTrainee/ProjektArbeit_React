"use client";

import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";
import { NoteCard } from "@/components/NoteCard";

export type Note = {
  id: string | number;
  title: string;
  content: string;
  category: string;
};

interface NotesListProps {
  initialNotes: Note[];
}

export function NotesList({ initialNotes }: NotesListProps) {
  const currentCategory = useFilterStore((state) => state.currentCategory);

  // 1. Zustand für die aktuelle Seitennummer (startet bei Seite 1)
  const [currentPage, setCurrentPage] = useState(1);

  // Feste Vorgabe: Maximal 3 Einträge pro Seite
  const itemsPerPage = 3;

  // 2. Notizen basierend auf der Kategorie filtern
  const filteredNotes = initialNotes.filter((note) => {
    if (currentCategory === "Alle") return true;
    return String(note.category) === currentCategory;
  });

  // Wenn sich die Kategorie ändert, springen wir sofort zurück auf Seite 1
  const [lastCategory, setLastCategory] = useState(currentCategory);
  if (currentCategory !== lastCategory) {
    setLastCategory(currentCategory);
    setCurrentPage(1);
  }

  // 3. Mathematische Berechnung der Seitenstruktur
  const totalItems = filteredNotes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Indexgrenzen für den aktuellen Ausschnitt (Slice) berechnen
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Genau die 3 Einträge für die aktuelle Seite herausschneiden
  const currentNotes = filteredNotes.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      {/* Liste der Notizen (max. 3) */}
      {filteredNotes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Keine Notizen in dieser Kategorie gefunden.
        </p>
      ) : (
        <div className="space-y-4">
          {currentNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {/* 4. Seitennavigation unten anzeigen (nur wenn es mehr als 1 Seite gibt) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            &larr; Zurück
          </button>

          <span className="text-sm text-gray-600">
            Seite <strong>{currentPage}</strong> von {totalPages} ({totalItems}{" "}
            Einträge)
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            Weiter &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
