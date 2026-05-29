// Das ist eine Server Component. Wir holen die Daten oben und rendern unten.
export async function WeatherWidget() {
  let temperature: number | undefined = undefined;
  let hasError = false;

  try {
    // Open-Meteo API-Aufruf für Hamburg
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=53.55&longitude=9.99&current_weather=true",
      {
        cache: "no-store", // Verhindert dauerhaftes Cachen
      },
    );

    if (!res.ok) {
      throw new Error("API-Fehler");
    }

    const data = await res.json();
    temperature = data.current_weather?.temperature;
  } catch (error) {
    // Falls das Internet weg ist oder die API spinnt, merken wir uns den Fehler
    hasError = true;
  }

  // --- HIER FOLGT DAS RENDERN (Außerhalb von try/catch) ---

  // Fall 1: Ein Fehler ist aufgetreten
  if (hasError) {
    return (
      <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
        Wetterdaten konnten nicht von der externen API geladen werden.
      </div>
    );
  }

  // Fall 2: Alles lief glatt
  return (
    <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex justify-between items-center">
      <div>
        <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider">
          Aktuelles Wetter (Hamburg)
        </h3>
        <p className="text-xs text-blue-600 mt-0.5">
          Geladen via externer Open-Meteo API
        </p>
      </div>
      <div className="text-2xl font-bold text-blue-900">
        {temperature !== undefined ? `${temperature}°C` : "-- °C"}
      </div>
    </div>
  );
}
