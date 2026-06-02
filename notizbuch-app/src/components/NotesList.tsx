"use client";

import { useCallback, useEffect } from "react";
import { useFilterStore } from "@/store/filterStore";
import { NoteCard } from "@/components/NoteCard";
import { HighlightedText } from "@/components/HighlightedText";
import { useRouter, useSearchParams } from "next/navigation";
import { Note } from "@/data/schema";

interface NotesListProps {
  initialNotes: Note[];
  searchQuery: string;
}

export function NotesList({ initialNotes, searchQuery }: NotesListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = useFilterStore((state) => state.currentCategory);
  const itemsPerPage = 3;

  // 1. Seitenzahl direkt aus der URL lesen. Standard ist 1.
  const urlPage = searchParams.get("page");
  const currentPage = urlPage ? parseInt(urlPage, 10) || 1 : 1;

  // Notizen basierend auf der Kategorie filtern
  const filteredNotes = initialNotes.filter((note) => {
    if (currentCategory === "Alle") return true;
    return String(note.category) === currentCategory;
  });

  // Mathematische Berechnung der Seitenstruktur
  const totalItems = filteredNotes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 2. Hilfsfunktion zur URL-Aktualisierung (mit useCallback stabilisiert)
  const changePage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 1) {
        params.delete("page");
      } else {
        params.set("page", newPage.toString());
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  // 3. Synchronisations- & Reset-Effekt mit intelligenter Deckelung auf das Maximum
  useEffect(() => {
    if (searchParams.get("page")) {
      const urlPageInt = parseInt(searchParams.get("page") || "1", 10);

      // Wenn die URL-Seite größer als die maximale Seitenzahl ist, auf das Maximum deckeln
      if (urlPageInt > totalPages && totalPages > 0) {
        changePage(totalPages);
      }
    }
  }, [currentCategory, totalPages, searchParams, changePage]);

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
          {currentNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              title={
                <HighlightedText text={note.title} highlight={searchQuery} />
              }
              content={
                <HighlightedText text={note.content} highlight={searchQuery} />
              }
            />
          ))}
        </div>
      )}

      {/* Seitennavigation unten anzeigen */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
          <button
            onClick={() => changePage(Math.max(currentPage - 1, 1))}
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
            onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
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
