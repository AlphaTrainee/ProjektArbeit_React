// import { db } from "@/db/database";
import { db } from "@/lib/db";
import { CategoryFilter } from "@/components/CategoryFilter";
import { NotesList } from "@/components/NotesList";
import Link from "next/link";
import { SearchInput } from "@/components/SearchInput";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function NotizenPage({ searchParams }: PageProps) {
  // In Next.js 15 wird das Promise korrekt per await aufgelöst
  const resolvedParams = await searchParams;
  const searchQuery =
    typeof resolvedParams.q === "string" ? resolvedParams.q : "";

  let result;

  // 2. SQL-Query dynamisch anpassen, falls ein Suchbegriff übergeben wurde
  if (searchQuery) {
    const sqlLike = `%${searchQuery}%`;
    result = await db.execute({
      sql: "SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY id DESC",
      args: [sqlLike, sqlLike],
    });
  } else {
    // Standard: Alle Notizen laden
    result = await db.execute("SELECT * FROM notes ORDER BY id DESC");
  }

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
        {searchQuery ? (
          <Link
            href="/notizen"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium text-sm transition-colors shadow-sm ml-auto"
          >
            &times; Suche aufheben
          </Link>
        ) : (
          <SearchInput targetRoute="/notizen" />
        )}
      </div>
      <CategoryFilter />
      <NotesList initialNotes={allNotes} searchQuery={searchQuery} />
    </main>
  );
}
