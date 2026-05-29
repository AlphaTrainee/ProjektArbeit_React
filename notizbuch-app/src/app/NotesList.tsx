"use client";

import { useFilterStore } from "@/store/filterStore";

interface Note {
  id: any;
  title: any;
  content: any;
  category: any;
}

interface NotesListProps {
  initialNotes: Note[];
}

export function NotesList({ initialNotes }: NotesListProps) {
  // Wir holen uns den aktuellen Filter aus dem globalen Zustand
  const currentCategory = useFilterStore((state) => state.currentCategory);

  // Notizen basierend auf der Auswahl filtern
  const filteredNotes = initialNotes.filter((note) => {
    if (currentCategory === "Alle") return true;
    return String(note.category) === currentCategory;
  });

  return (
    <div className="space-y-4">
      {filteredNotes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Keine Notizen in dieser Kategorie gefunden.
        </p>
      ) : (
        filteredNotes.map((note) => (
          <div
            key={String(note.id)}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{String(note.title)}</h2>
              <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600">
                {String(note.category)}
              </span>
            </div>
            <p className="text-gray-600 mt-2">{String(note.content)}</p>
          </div>
        ))
      )}
    </div>
  );
}
