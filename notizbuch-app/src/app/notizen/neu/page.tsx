import { NoteForm } from "../../../components/NoteForm";
import Link from "next/link";

export default function NeueNotizPage() {
  return (
    <main className="w-full max-w-5xl mx-auto p-4 md:p-6 transition-all">
      <h1 className="text-3xl font-bold mb-4">Neue Notiz erstellen</h1>

      {/* Button direkt unter der Überschrift */}
      <div className="flex gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Link
          href="/"
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium text-sm transition-colors shadow-sm inline-block"
        >
          ← Abbrechen & Zurück
        </Link>
      </div>
      <NoteForm />
    </main>
  );
}
