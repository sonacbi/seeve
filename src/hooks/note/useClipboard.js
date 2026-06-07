import { useEffect } from "react";

export function useClipboard({
selection,
getRange,
cellMap,
activeCell,
updateCellValue,
ROWS, COLS
}) {


useEffect(() => {
    const handleCopy = (e) => {
        if (!selection) return;
console.log("COPY");
        const range = getRange(selection.start, selection.end);

        const map = new Map();
        range.forEach(({ row, col }) => {
            const cell = cellMap[`${row}-${col}`];
            map.set(`${row}-${col}`, cell?.content ?? "");
        });

        const rows = [];
        for (let r = selection.start.row; r <= selection.end.row; r++) {
            const cols = [];
            for (let c = selection.start.col; c <= selection.end.col; c++) {
                cols.push(map.get(`${r}-${c}`) ?? "");
            }
            rows.push(cols.join("\t"));
        }

        e.preventDefault();
        e.clipboardData.setData("text/plain", rows.join("\n"));
    };

    window.addEventListener("copy", handleCopy);
    return () => window.removeEventListener("copy", handleCopy);
}, [selection, cellMap, getRange]);

useEffect(() => {
    const handlePaste = (e) => {
        if (!activeCell) return;
console.log("PASTE");
        const text = e.clipboardData.getData("text/plain");
        if (!text) return;

        const rows = text.split("\n").map(r => r.split("\t"));

        const startRow = activeCell.row;
        const startCol = activeCell.col;

        rows.forEach((rowData, rIdx) => {
            rowData.forEach((value, cIdx) => {
                const r = startRow + rIdx;
                const c = startCol + cIdx;

                if (r >= ROWS || c >= COLS) return;

                updateCellValue(r, c, value);
            });
        });

        e.preventDefault();
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
}, [activeCell, updateCellValue, COLS, ROWS]);

  return { 
   };
}