import { useState } from "react";
import { useDraft } from "./useDraft";

export function useCellEditor({
    inputRef,
    updateCellValue,
    cellMap,

}) {
// =========================
// SETTER (UI STATE)
// =========================
const { draftRef, /*setDraft,*/ clearDraft } = useDraft();
const [dragging, setDragging] = useState(false);
const [activeCell, setActiveCell] = useState({
  row: 0,
  col: 0,
  mode: "select",
});

// =========================
// GETTER (READ ONLY)
// =========================

const [selection, setSelection] = useState(null);
// { start: {row,col}, end: {row,col} }

const getRange = (a, b) => {
    const r1 = Math.min(a.row, b.row);
    const r2 = Math.max(a.row, b.row);
    const c1 = Math.min(a.col, b.col);
    const c2 = Math.max(a.col, b.col);

    const cells = [];
    for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
            cells.push({ row: r, col: c });
        }
    }
    return cells;
};

const isSelected = (row, col) => {
    if (!selection) return false;

    return (
        row >= Math.min(selection.start.row, selection.end.row) &&
        row <= Math.max(selection.start.row, selection.end.row) &&
        col >= Math.min(selection.start.col, selection.end.col) &&
        col <= Math.max(selection.start.col, selection.end.col)
    );
};

const getSelectionBorder = (row, col) => {
    if (!selection || !isSelected(row, col)) {
        return {
            borderTop: "1px solid #ddd",
            borderRight: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            borderLeft: "1px solid #ddd",
        };
    }

    const minRow = Math.min(
        selection.start.row,
        selection.end.row
    );

    const maxRow = Math.max(
        selection.start.row,
        selection.end.row
    );

    const minCol = Math.min(
        selection.start.col,
        selection.end.col
    );

    const maxCol = Math.max(
        selection.start.col,
        selection.end.col
    );

    return {
        borderTop:
            row === minRow
                ? "2px solid #4f46e5"
                : "1px solid #ddd",

        borderBottom:
            row === maxRow
                ? "2px solid #4f46e5"
                : "1px solid #ddd",

        borderLeft:
            col === minCol
                ? "2px solid #4f46e5"
                : "1px solid #ddd",

        borderRight:
            col === maxCol
                ? "2px solid #4f46e5"
                : "1px solid #ddd",
    };
};
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
        dragging, setDragging,
        selection, setSelection,
        getRange,
        isSelected,
        getSelectionBorder,
   };
}