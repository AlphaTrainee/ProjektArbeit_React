import { z } from "zod";

export const noteSchema = z.object({
  id: z.string().optional(), // Ermöglicht die Übergabe der ID beim Editieren
  title: z
    .string()
    .min(1, {
      message: "Bitte gib einen Titel an.",
    })
    .max(100, {
      message: "Der Titel darf maximal 100 Zeichen lang sein.",
    }),
  content: z.string().min(1, {
    message: "Der Inhalt darf nicht leer sein.",
  }),
  category: z.string().min(1, {
    message: "Bitte wähle eine Kategorie aus.",
  }),
});
