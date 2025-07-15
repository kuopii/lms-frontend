import z from "zod";

const vocabularySchema = z.object({
  word: z.string().min(1, { message: "word is required" }),
  spelling: z.string().min(1, { message: "spelling is required" }),
  category_id: z.string().min(1, { message: "category_id is required" }),
  translation: z.string().min(1, { message: "translation is required" }),
  wordExplanation: z
    .string()
    .min(1, { message: "wordExplanation is required" }),
});

export const createVocabulary = vocabularySchema;
export const editVocabulary = vocabularySchema
  .partial()
  .extend({ vocab_id: z.string().min(1) });

export type CreateVocabularyType = z.infer<typeof createVocabulary>;
export type EditVocabularyType = z.infer<typeof editVocabulary>;
