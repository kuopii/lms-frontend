import { useCallback, useState } from "react";

export const useTextSelection = (watchedQuestionText: string) => {
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [selectionEnd, setSelectionEnd] = useState<number>(0);

  const handleTextSelection = useCallback(
    (textareaRef: React.RefObject<HTMLTextAreaElement | null>) => {
      if (!textareaRef.current) return;

      const questionText = watchedQuestionText || "";
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selected = questionText.substring(start, end);

      if (selected.trim()) {
        setSelectedText(selected);
        setSelectionStart(start);
        setSelectionEnd(end);
      } else {
        setSelectedText("");
      }
    },
    [watchedQuestionText],
  );

  const clearSelection = useCallback(() => {
    setSelectedText("");
    setSelectionStart(0);
    setSelectionEnd(0);
  }, []);

  return {
    selectedText,
    selectionStart,
    selectionEnd,
    handleTextSelection,
    clearSelection,
  };
};
