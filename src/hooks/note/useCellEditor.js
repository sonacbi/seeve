import { useState } from "react";
import { useDraft } from "./useDraft";

export function useCellEditor({
    inputRef,
    updateCellValue,
}) {
// =========================
// SETTER (UI STATE)
// =========================
const { draftRef, /*setDraft,*/ clearDraft } = useDraft();

const [activeCell, setActiveCell] = useState({
  row: 0,
  col: 0,
  mode: "select",
});

// =========================
// GETTER (READ ONLY)
// =========================




// =========================
// UPDATE (CELL)
// =========================
const commitDraft = () => {
  if (!activeCell) return;

  const value = draftRef.current;

  updateCellValue(activeCell.row, activeCell.col, value);
  clearDraft();
};
const enterEditMode = (row, col) => {
  setActiveCell({ row, col, mode: "edit" });

  requestAnimationFrame(() => {
    inputRef.current?.focus();
  });
};

  return { 
        commitDraft,
        enterEditMode,
        draftRef, /*setDraft,*/ clearDraft,
        activeCell, setActiveCell,
   };
}