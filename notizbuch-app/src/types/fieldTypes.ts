import { z } from "zod";

export type Err = { message: string };

export type FieldErrors = {
  title: Err | null;
  content: Err | null;
  category: Err | null;
};

export function formatZodErrors(error: z.ZodError): FieldErrors {
  const formattedErrors: FieldErrors = {
    title: null,
    content: null,
    category: null,
  };

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === "title" && !formattedErrors.title)
      formattedErrors.title = { message: issue.message };
    if (field === "content" && !formattedErrors.content)
      formattedErrors.content = { message: issue.message };
    if (field === "category" && !formattedErrors.category)
      formattedErrors.category = { message: issue.message };
  }

  return formattedErrors;
}
