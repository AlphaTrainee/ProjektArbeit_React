"use client";

import { useActionState } from "react";
import { deleteNoteAction } from "@/actions/actions";
import Link from "next/link";
import { Note } from "@/data/schema";

interface NoteCardProps {
  note: Note;
  title?: React.ReactNode; // Optionales Argument für formatierten/hervorgehobenen Titel
  content?: React.ReactNode; // Optionales Argument für formatierten/hervorgehobenen Inhalt
}

export function NoteCard({ note, title, content }: NoteCardProps) {
  const [state, formAction, isPending] = useActionState(deleteNoteAction, {
    error: null,
    success: false,
    fieldErrors: null,
  });

  // Funktion zur Überprüfung vor dem Absenden
  const handleDeleteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const confirmed = window.confirm(
      `Möchtest du die Notiz "${note.title}" wirklich unwiderruflich löschen?`,
    );

    // Wenn der Nutzer auf "Abbrechen" klickt, wird das Absenden verhindert
    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white flex flex-col justify-between">
      <div>
        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 rounded mb-2">
          {note.category}
        </span>
        {/* Nutzt das übergebene JSX-Element oder fällt auf den Standard-String zurück */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {title ?? note.title}
        </h3>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">
          {content ?? note.content}
        </p>
      </div>

      {state.error && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2">
          ⚠️ {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t">
        <Link
          href={`/notizen/${note.id}/bearbeiten`}
          className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
        >
          ✏️ Bearbeiten
        </Link>

        {/* onSubmit fängt den Klick ab, bevor die formAction feuert */}
        <form action={formAction} onSubmit={handleDeleteSubmit}>
          <input type="hidden" name="id" value={note.id} />

          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {isPending ? "⏳..." : "🗑️ Löschen"}
          </button>
        </form>
      </div>
    </div>
  );
}
