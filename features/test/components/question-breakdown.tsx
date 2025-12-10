"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Pencil, Plus } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useFormContext } from "react-hook-form";
import { usePathname } from "next/navigation";
import Editor from "react-simple-code-editor";
import { getVariantFromPath } from "./question-header";
import { useVocabularyModalStore } from "@/store/vocab-store";
import { CreateVocabularyType } from "@/validators/vocabulary";
import { useCreateVocabulary } from "@/features/vocabulary/api/use-create-vocabulary";
import { toast } from "sonner";

// Types
type Range = { start: number; end: number };
type HighlightData = { start_char_index: number; end_char_index: number };

// Core Utils
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const escapeHTML = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m]!,
  );
const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) =>
  aStart < bEnd && bStart < aEnd;

// Range Utils
const sortRanges = (ranges: Range[]) =>
  [...ranges].sort((a, b) => a.start - b.start);

const mergeRanges = (ranges: Range[]): Range[] => {
  if (!ranges.length) return [];
  const sorted = sortRanges(ranges);
  const result = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = result[result.length - 1];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      result.push(current);
    }
  }
  return result;
};

const addRange = (ranges: Range[], start: number, end: number): Range[] =>
  mergeRanges([...ranges, { start, end }]);

const removeRange = (
  ranges: Range[],
  selStart: number,
  selEnd: number,
): Range[] => {
  const result: Range[] = [];

  for (const r of ranges) {
    if (!overlaps(r.start, r.end, selStart, selEnd)) {
      result.push(r);
    } else {
      if (r.start < selStart) result.push({ start: r.start, end: selStart });
      if (selEnd < r.end) result.push({ start: selEnd, end: r.end });
    }
  }
  return result;
};

// Highlight Conversions
const toRanges = (highlights: HighlightData[]): Range[] =>
  highlights.map((h) => ({
    start: h.start_char_index,
    end: h.end_char_index + 1,
  }));

const toHighlights = (ranges: Range[]): HighlightData[] =>
  ranges.map((r) => ({ start_char_index: r.start, end_char_index: r.end - 1 }));

// Smart Highlight Adjustment
const adjustHighlights = (
  oldText: string,
  newText: string,
  highlights: Range[],
): Range[] => {
  if (oldText === newText || !highlights.length || !newText)
    return !newText ? [] : highlights;

  const adjusted: Range[] = [];

  for (const h of highlights) {
    const originalText = oldText.slice(h.start, h.end);
    let newStart = -1,
      newEnd = -1;

    // Try same position first
    if (
      h.end <= newText.length &&
      newText.slice(h.start, h.end) === originalText
    ) {
      newStart = h.start;
      newEnd = h.end;
    } else {
      // Search nearby with radius
      const radius = Math.max(10, originalText.length);
      const searchStart = Math.max(0, h.start - radius);
      const searchEnd = Math.min(newText.length, h.end + radius);
      const searchArea = newText.slice(searchStart, searchEnd);

      const foundIdx = searchArea.indexOf(originalText);
      if (foundIdx !== -1) {
        newStart = searchStart + foundIdx;
        newEnd = newStart + originalText.length;
      } else {
        // Try progressively shorter substrings
        const minLen = Math.min(2, Math.floor(originalText.length / 2));
        for (let len = originalText.length - 1; len >= minLen; len--) {
          const substr = originalText.slice(0, len);
          const idx = newText.indexOf(substr);
          if (
            idx !== -1 &&
            Math.abs(idx - h.start) <= Math.max(20, originalText.length)
          ) {
            newStart = idx;
            newEnd = idx + len;
            break;
          }
        }
      }
    }

    if (
      newStart !== -1 &&
      newEnd !== -1 &&
      newStart < newEnd &&
      newEnd <= newText.length
    ) {
      adjusted.push({ start: newStart, end: newEnd });
    }
  }

  return mergeRanges(adjusted);
};

const QuestionBreakdown = ({ breakdownPath }: { breakdownPath: string }) => {
  const { openCreateModal, closeModal } = useVocabularyModalStore();
  const pathname = usePathname();
  const { control, watch, setValue } = useFormContext();
  const [selection, setSelection] = useState({ text: "", start: 0, end: 0 });
  const prevTextRef = useRef("");

  // Memoized values
  const variant = useMemo(() => getVariantFromPath(pathname), [pathname]);
  const text = watch(`${breakdownPath}.explanation`) || "";
  const watchedHighlights = watch(`${breakdownPath}.highlights`);
  const formHighlights = useMemo(
    () => watchedHighlights || [],
    [watchedHighlights],
  );
  const highlights = useMemo(() => toRanges(formHighlights), [formHighlights]);

  // Update highlights in form
  const updateHighlights = useCallback(
    (ranges: Range[]) => {
      const newHighlights = toHighlights(ranges);
      setValue(`${breakdownPath}.highlights`, newHighlights, {
        shouldDirty: true,
      });
      setValue(`${breakdownPath}.has_highlight`, newHighlights.length > 0, {
        shouldDirty: true,
      });
    },
    [setValue, breakdownPath],
  );

  // Auto-adjust highlights on text change
  useEffect(() => {
    const prevText = prevTextRef.current;
    prevTextRef.current = text;

    if (prevText === text || !highlights.length) return;

    const adjusted = adjustHighlights(prevText, text, highlights);
    if (JSON.stringify(adjusted) !== JSON.stringify(highlights)) {
      updateHighlights(adjusted);
    }
  }, [text, highlights, updateHighlights]);

  // Handle text selection
  const handleSelection = useCallback(
    (el: HTMLTextAreaElement) => {
      const start = clamp(el.selectionStart ?? 0, 0, text.length);
      const end = clamp(el.selectionEnd ?? 0, 0, text.length);
      const [s, e] = start > end ? [end, start] : [start, end];
      const selectedText = text.slice(s, e);

      setSelection(
        selectedText && s !== e
          ? { text: selectedText, start: s, end: e }
          : { text: "", start: 0, end: 0 },
      );
    },
    [text],
  );

  // Toggle highlight
  const toggleHighlight = useCallback(() => {
    if (!selection.text || selection.start === selection.end) return;

    const hasOverlap = highlights.some((h) =>
      overlaps(h.start, h.end, selection.start, selection.end),
    );
    const newRanges = hasOverlap
      ? removeRange(highlights, selection.start, selection.end)
      : addRange(highlights, selection.start, selection.end);

    updateHighlights(newRanges);
    setSelection({ text: "", start: 0, end: 0 });
  }, [selection, highlights, updateHighlights]);

  // Button label
  const buttonLabel = useMemo(() => {
    if (!selection.text) return "Highlight Passage";
    const hasOverlap = highlights.some((h) =>
      overlaps(h.start, h.end, selection.start, selection.end),
    );
    return hasOverlap ? "Unhighlight Selection" : "Highlight Selection";
  }, [selection, highlights]);

  // HTML highlight renderer
  const highlightToHTML = useCallback(
    (code: string) => {
      if (!highlights.length) return escapeHTML(code);

      const segments: string[] = [];
      let lastIndex = 0;

      for (const { start, end } of sortRanges(highlights)) {
        const clampedStart = clamp(start, 0, code.length);
        const clampedEnd = clamp(end, 0, code.length);

        if (lastIndex < clampedStart) {
          segments.push(escapeHTML(code.slice(lastIndex, clampedStart)));
        }
        if (clampedStart < clampedEnd) {
          const highlightedText = escapeHTML(
            code.slice(clampedStart, clampedEnd),
          );
          segments.push(
            `<span style="background:#fef08a;border-radius:2px;box-shadow:0 0 0 1px #fef08a;">${highlightedText}</span>`,
          );
        }
        lastIndex = clampedEnd;
      }
      if (lastIndex < code.length) {
        segments.push(escapeHTML(code.slice(lastIndex)));
      }

      return segments.join("");
    },
    [highlights],
  );

  // Event handlers
  const selectionEvents = useMemo(
    () => ({
      onSelect: (e: React.SyntheticEvent) => {
        const el = e.target;
        if (el instanceof HTMLTextAreaElement) handleSelection(el);
      },
      onMouseUp: (e: React.MouseEvent) => {
        const el = e.target;
        if (el instanceof HTMLTextAreaElement) handleSelection(el);
      },
      onKeyUp: (e: React.KeyboardEvent) => {
        const el = e.target;
        if (el instanceof HTMLTextAreaElement) handleSelection(el);
      },
    }),
    [handleSelection],
  );

  const { mutate: createVocabulary } = useCreateVocabulary({
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
    onSuccess: () => {
      toast.success("Vocabulary created successfully");
      closeModal();
    },
  });

  const handleAddVocabulary = (data: CreateVocabularyType) =>
    createVocabulary({ payload: data, accessToken: undefined });

  return (
    <div className="space-y-4 rounded-3xl bg-[#e4ecd7] p-3 md:p-4 lg:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-primary text-lg font-medium">
          Question Breakdown with Answer Explanation
        </h2>

        {variant === "reading" && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="xsm"
              className="w-full rounded-full lg:w-fit"
              onClick={toggleHighlight}
            >
              {buttonLabel}
              <Pencil className="mr-2 h-4 w-4" />
            </Button>

            <Button
              type="button"
              size="xsm"
              variant="outline"
              onClick={() => {
                openCreateModal(
                  {
                    word: selection.text || "",
                    category: "",
                    category_id: "",
                    spelling: "",
                    translation: "",
                    wordExplanation: "",
                  },
                  handleAddVocabulary,
                );
                setSelection({ text: "", start: 0, end: 0 });
              }}
              className="border-primary hover:bg-primary w-full rounded-full text-[#333333] hover:text-white lg:w-fit"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Vocabulary
            </Button>
          </div>
        )}
      </div>

      <Separator className="bg-[#787878]" />

      <FormField
        control={control}
        name={`${breakdownPath}.explanation`}
        render={({ field }) => (
          <FormControl>
            <div className="relative">
              {!field.value && (
                <span className="pointer-events-none absolute top-2.5 left-2 text-sm text-gray-400">
                  Type the answer explanation here...
                </span>
              )}

              <Editor
                value={field.value || ""}
                onValueChange={(code: string) => {
                  field.onChange(code);
                  setValue(`${breakdownPath}.explanation`, code, {
                    shouldDirty: true,
                  });
                }}
                highlight={highlightToHTML}
                padding={8}
                className="text-gray-600"
                style={{ minHeight: variant === "reading" ? "70px" : "40px" }}
                {...selectionEvents}
              />
            </div>
          </FormControl>
        )}
      />

      {variant === "reading" && (
        <div className="text-xs text-gray-500">
          💡 <strong>Tips:</strong> Select text and click the button. If the
          selected text overlaps with an existing highlight, the button will
          automatically <em>unhighlight</em> that part.
        </div>
      )}
    </div>
  );
};

export default QuestionBreakdown;
