import { DragEndEvent } from "@dnd-kit/core";

interface DragItem {
  id: string;
  sectionIndex: number;
  questionIndex: number;
}

interface createHandleDragEndParams {
  move: (
    fromSection: number,
    fromIndex: number,
    toSection: number,
    toIndex: number,
  ) => void;
}

export function createHandleDragEnd({ move }: createHandleDragEndParams) {
  return function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || !active) return;

    const activeData = active.data.current as DragItem;
    const overData = over.data.current as DragItem;

    if (!activeData || !overData) return;

    const { sectionIndex: fromSection, questionIndex: fromIndex } = activeData;
    const { sectionIndex: toSection, questionIndex: toIndex } = overData;

    const isSamePosition = fromSection === toSection && fromIndex === toIndex;

    if (!isSamePosition) {
      move(fromSection, toSection, fromIndex, toIndex);
    }
  };
}
