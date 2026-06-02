// import { db } from "@/db/database";
import { db } from "@/lib/db";
import { NoteForm } from "@/components/NoteForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

interface EditNotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params;
  const noteId = parseInt(id, 10);

  if (isNaN(noteId)) {
    notFound();
  }

  const headersList = await headers();
  const referer = headersList.get("referer");

  // Wir extrahieren nur den Pfad (z.B. /root oder /root/notizen)
  let fromUrl = "/";
  if (referer) {
    try {
      const url = new URL(referer);
      fromUrl = url.pathname + url.search;
    } catch (_) {
      fromUrl = "/";
    }
  }
  console.log(`FROM: ${fromUrl}`);

  const result = await db.execute({
    sql: "SELECT * FROM notes WHERE id = ?",
    args: [noteId],
  });

  const row = result.rows[0];

  if (!row) {
    notFound();
  }

  const note = {
    id: Number(row.id),
    title: String(row.title),
    content: String(row.content),
    category: String(row.category),
  };

  // Bestimme das Ziel für den Abbrechen-Button (entweder 'from' oder Standard '/')
  const backUrl = fromUrl || "/";

  return (
    <main className="w-full max-w-5xl mx-auto p-4 md:p-6 transition-all">
      <h1 className="text-3xl font-bold mb-4">Notiz bearbeiten</h1>

      <div className="flex gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Link
          href={backUrl}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium text-sm transition-colors shadow-sm inline-block"
        >
          ← Abbrechen & Zurück
        </Link>
      </div>

      {/* Wir übergeben die 'backUrl' an das Formular */}
      <NoteForm note={note} redirectTo={backUrl} />
    </main>
  );
}
