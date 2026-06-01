import { z } from "zod";

export const NoteSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Der Titel darf nicht leer sein"),
  content: z.string().min(1, "Der Inhalt darf nicht leer sein"),
  category: z.string().min(1, "Die Kategorie darf nicht leer sein"),
});

export type Note = z.infer<typeof NoteSchema>;

export const NoteFormSchema = NoteSchema.omit({ id: true });
