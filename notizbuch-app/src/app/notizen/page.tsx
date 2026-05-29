import { db } from "@/db/database";
import { CategoryFilter } from "../CategoryFilter";
import { NotesList } from "../NotesList";
import Link from "next/link";

export default async function NotizenPage() {
  const result = await db.execute("SELECT * FROM notes ORDER BY id DESC");

  const allNotes = result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
  }));

  return (
    <main className="w-full max-w-5xl mx-auto p-4 md:p-6 transition-all">
      <h1 className="text-3xl font-bold mb-4">Alle Notizen</h1>

      {/* Button-Reihe direkt unter der Überschrift */}
      <div className="flex gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Link
          href="/"
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium text-sm transition-colors shadow-sm"
        >
          ← Dashboard
        </Link>
        <Link
          href="/notizen/neu"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm transition-colors shadow-sm"
        >
          ➕ Neue Notiz erstellen
        </Link>
      </div>
      <CategoryFilter />
      <NotesList initialNotes={allNotes} />
    </main>
  );
}
