"use client";

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
        filteredNotes.map((note) => <NoteCard key={note.id} note={note} />)
      )}
    </div>
  );
}
