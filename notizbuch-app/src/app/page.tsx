import { db } from "@/db/database";
import { WeatherWidget } from "./WeatherWidget";
import Link from "next/link"; // Für die Navigation ohne Seiten-Reload

export default async function Home() {
  // Wir holen uns nur die letzten 3 Einträge, sortiert nach der ID (neueste zuerst)
  const result = await db.execute(
    "SELECT * FROM notes ORDER BY id DESC LIMIT 3",
  );

  const latestNotes = result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
  }));

  return (
    <main className="w-full max-w-5xl mx-auto p-4 md:p-6 transition-all">
      <h1 className="text-3xl font-bold mb-2">Mein Digitales Notizbuch</h1>
      <p className="text-gray-500 mb-6">Willkommen auf deinem Dashboard</p>

      {/* Wetter Widget */}
      <WeatherWidget />

      {/* Navigation zu den anderen Seiten */}
      <div className="flex gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Link
          href="/notizen"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
        >
          📋 Alle Notizen ansehen
        </Link>
        <Link
          href="/notizen/neu"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm transition-colors"
        >
          ➕ Neue Notiz schreiben
        </Link>
      </div>

      {/* Die 3 neuesten Einträge */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Die 3 neuesten Einträge:
        </h2>
        {latestNotes.length === 0 ? (
          <p className="text-gray-500 italic">Noch keine Notizen vorhanden.</p>
        ) : (
          <div className="space-y-4">
            {latestNotes.map((note) => (
              <div
                key={String(note.id)}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">
                    {String(note.title)}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600">
                    {String(note.category)}
                  </span>
                </div>
                <p className="text-gray-600 mt-2 text-sm">
                  {String(note.content)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
