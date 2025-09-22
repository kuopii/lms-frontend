import { VocabularyPage } from "@/features/vocabulary/pages/vocabulary-page";
import { Suspense } from "react";

const Vocabulary = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VocabularyPage />;
    </Suspense>
  );
};

export default Vocabulary;
