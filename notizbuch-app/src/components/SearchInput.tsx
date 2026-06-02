"use client";

import { useRouter } from "next/navigation";

interface SearchInputProps {
  targetRoute?: string;
}

export function SearchInput({ targetRoute = "/notizen" }: SearchInputProps) {
  const router = useRouter();

  // Reine Logikfunktion, die direkt vom form-Element aufgerufen wird
  const handleSearchAction = (formData: FormData) => {
    const query = formData.get("searchQuery")?.toString().trim();

    if (query) {
      router.push(`${targetRoute}?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    // Nutzt die native React 19 / Next.js Form Action anstelle von onSubmit
    <form
      action={handleSearchAction}
      className="flex gap-2 flex-1 max-w-md ml-auto"
    >
      <input
        type="text"
        name="searchQuery" // Wichtig: Über diesen Namen holen wir den Wert
        placeholder="Notizen durchsuchen..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        Suchen
      </button>
    </form>
  );
}
