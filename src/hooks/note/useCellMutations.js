import { useCallback } from "react";           

export function useCellMutations({
updateCellValue,
setNotePages,
currentNote,
note,
setActiveCell,
activeCell,
cellMap,
ROWS, COLS,
}) {
// =========================
// GETTER (READ ONLY)
// =========================


// cell getter
// const getCell = (row, col) => cellMap[`${row}-${col}`] ?? null;
// //   note?.cells?.[`${row}-${col}`] ?? null;

// =========================
// UPDATE (CELL)
// =========================

  const updateCell = useCallback((cellId, patch) => {
    setNotePages(prev => {
      const updated = { ...prev };

      updated[currentNote.lecturePage] =
        updated[currentNote.lecturePage].map(note => {
          if (note.id !== currentNote.id) return note;

          const newCells = { ...(note.cells ?? {}) };

          for (const key in newCells) {
            if (newCells[key].id === cellId) {
              newCells[key] = {
                ...newCells[key],
                ...patch
              };
            }
          }

          return {
            ...note,
            cells: newCells
          };
        });

      return updated;
    });
  }, [setNotePages, currentNote.lecturePage, currentNote.id]);


// // setter update 혼합
// const createCell = (type) => {
//     if (!activeCell) return;
//     updateCellValue(activeCell.row, activeCell.col, "");
//     setNotePages(prev => {
//         const pages = [...(prev[currentNote.lecturePage] ?? [])];

//         return {
//         ...prev,
//         [currentNote.lecturePage]: pages.map(n => {
//             if (n.id !== currentNote.id) return n;

//             const cells = { ...(n.cells ?? {}) };
//             const key = `${activeCell.row}-${activeCell.col}`;

//             cells[key] = {
//             id: crypto.randomUUID(),
//             type,
//             row: activeCell.row,
//             col: activeCell.col,
//             content: ""
//             };

//             return { ...n, cells };
//         })
//         };
//     });

// };
const applyToSelectedCell = useCallback((type) => {
    const row = activeCell.row;
    const key = `${row}-0`;

    const targetCell = cellMap[key];

    if (targetCell) {
        updateCell(targetCell.id, {
            type,
            colSpan: COLS
        });
    } else {
        setNotePages(prev => {
            const updated = { ...prev };

            updated[currentNote.lecturePage] =
                updated[currentNote.lecturePage].map(note => {
                    if (note.id !== currentNote.id) return note;

                    const cells = {
                        ...(note.cells ?? {})
                    };

                    cells[key] = {
                        id: crypto.randomUUID(),
                        row,
                        col: 0,
                        type,
                        colSpan: COLS,
                        content: ""
                    };

                    return {
                        ...note,
                        cells
                    };
                });

            return updated;
        });
    }

    setActiveCell(prev => ({
        ...prev,
        col: 0,
        mode: "select"
    }));
}, [
    setActiveCell,
    activeCell,
    cellMap,
    COLS,
    currentNote,
    setNotePages,
    updateCell
]);


  return { 
    // updateCell,
    // createCell,
    applyToSelectedCell,
    
   };
}