"use client";

import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";
import { NoteCard } from "@/components/NoteCard";
import { HighlightedText } from "@/components/HighlightedText";

export type Note = {
  id: string | number;
  title: string;
  content: string;
  category: string;
};

interface NotesListProps {
  initialNotes: Note[];
  searchQuery: string; // Neues Prop empfangen
}

export function NotesList({ initialNotes, searchQuery }: NotesListProps) {
  const currentCategory = useFilterStore((state) => state.currentCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Notizen basierend auf der Kategorie filtern
  const filteredNotes = initialNotes.filter((note) => {
    if (currentCategory === "Alle") return true;
    return String(note.category) === currentCategory;
  });

  // Wenn sich die Kategorie ändert, zurück auf Seite 1
  const [lastCategory, setLastCategory] = useState(currentCategory);
  if (currentCategory !== lastCategory) {
    setLastCategory(currentCategory);
    setCurrentPage(1);
  }

  // Mathematische Berechnung der Seitenstruktur
  const totalItems = filteredNotes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentNotes = filteredNotes.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      {filteredNotes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Keine Notizen in dieser Kategorie gefunden.
        </p>
      ) : (
        <div className="space-y-4">
          {currentNotes.map((note) => {
            // Wir bereiten die modifizierte Notiz mit den Markierungen vor
            const highlightedNote = {
              ...note,
              title: (
                <HighlightedText text={note.title} highlight={searchQuery} />
              ) as unknown as string, // Cast nötig, falls NoteCard strikt String verlangt
              content: (
                <HighlightedText text={note.content} highlight={searchQuery} />
              ) as unknown as string,
            };

            return <NoteCard key={note.id} note={highlightedNote} />;
          })}
        </div>
      )}

      {/* Seitennavigation unten anzeigen */}
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
