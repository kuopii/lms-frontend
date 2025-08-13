import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import React from "react";

export function SortableQuestion({
  id,
  children,
  sectionIndex,
  questionIndex,
}: {
  id: string;
  children: React.ReactNode;
  sectionIndex: number;
  questionIndex: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      sectionIndex,
      questionIndex,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "manipulation",
    opacity: isDragging ? 0.5 : 1, //  contoh efek
    zIndex: isDragging ? 50 : "auto", // tampil di atas saat drag
  };

  return (
    <div
      className={cn(
        "relative transition-shadow",
        isDragging && "z-50 rounded-[30px]",
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      {/* Drag handle only */}
      <div
        {...listeners}
        className="absolute top-0 right-2 z-10 flex w-full cursor-grab items-center justify-center"
      >
        <GripHorizontal />
      </div>
      <div>{children}</div>
    </div>
  );
}
