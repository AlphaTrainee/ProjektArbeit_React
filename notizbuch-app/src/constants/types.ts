export const NOTE_CATEGORIES = ["Arbeit", "Studium", "Privat", "Idee"] as const;

// Optional: Erstellt einen TypeScript-Typ ("Arbeit" | "Studium" | "Privat" | "Idee")
export type NoteCategory = (typeof NOTE_CATEGORIES)[number];
