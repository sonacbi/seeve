import { useMemo } from "react";           

export function useNoteGrid({
notePages,
currentNote,
ROWS,
COLS,
}) {
// =========================
// GETTER (READ ONLY)
// =========================
const note = useMemo(() => {
  return notePages?.[currentNote.lecturePage]
    ?.find(n => n.id === currentNote.id);
}, [notePages, currentNote]);

const cellMap = useMemo(() => { return note?.cells ?? {}; }, [note?.cells]);

// cell getter
// const getCell = (row, col) => cellMap[`${row}-${col}`] ?? null;
// //   note?.cells?.[`${row}-${col}`] ?? null;

// =========================
// UPDATE (CELL)
// =========================
const grid = useMemo(() => {
    // grid 생성 렌더
    const hiddenCells = new Set();
    const result = [];

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {

            if (hiddenCells.has(`${r}-${c}`))
                continue;

            const key = `${r}-${c}`;
            const cell = cellMap[key];

            if (cell?.colSpan > 1) {
                for (let i = 1; i < cell.colSpan; i++) {
                    hiddenCells.add(`${r}-${c+i}`);
                }
            }

            result.push({
                key,
                row: r,
                col: c,
                cell
            });
        }
    }

    return result;
}, [cellMap, ROWS, COLS]);

  return { 
    note,
    cellMap,
    // getCell,
    grid,
   };
}