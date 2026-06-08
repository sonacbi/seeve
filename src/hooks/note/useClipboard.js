import { useEffect } from "react";

export function useClipboard({
selection,
getRange,
cellMap,
activeCell,
updateCellValue,
ROWS, COLS,
createImageCell,
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
    const handleCut = (e) => {
        if (!selection) return;

        console.log("CUT");

        const range = getRange(
            selection.start,
            selection.end
        );

        const map = new Map();

        range.forEach(({ row, col }) => {
            const cell = cellMap[`${row}-${col}`];
            map.set(
                `${row}-${col}`,
                cell?.content ?? ""
            );
        });

        const rows = [];

        for (
            let r = selection.start.row;
            r <= selection.end.row;
            r++
        ) {
            const cols = [];

            for (
                let c = selection.start.col;
                c <= selection.end.col;
                c++
            ) {
                cols.push(
                    map.get(`${r}-${c}`) ?? ""
                );
            }

            rows.push(cols.join("\t"));
        }

        e.preventDefault();

        e.clipboardData.setData(
            "text/plain",
            rows.join("\n")
        );

        // 잘라내기 → 내용 삭제
        range.forEach(({ row, col }) => {
            updateCellValue(row, col, "");
        });
    };

    window.addEventListener("cut", handleCut);

    return () =>
        window.removeEventListener(
            "cut",
            handleCut
        );
}, [
    selection,
    cellMap,
    getRange,
    updateCellValue
]);
useEffect(() => {
    const handlePaste = (e) => {
            if (!activeCell) return;

        const items = [...e.clipboardData.items];

        const imageItem = items.find(item =>
            item.type.startsWith("image/")
        );

        if (imageItem) {

            e.preventDefault();

            const file = imageItem.getAsFile();

            const reader = new FileReader();

            reader.onload = () => {

                const img = new Image();

                img.onload = () => {

                    createImageCell({
                        row: activeCell.row,
                        imageData: reader.result,
                        width: img.width,
                        height: img.height,
                    });

                };

                img.src = reader.result;
            };

            reader.readAsDataURL(file);

            return;
        }

        // 텍스트 붙여넣기
        if (!activeCell) return;
        console.log(e.clipboardData.items);
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

// const handleImagePaste = (e) => {
// console.log(e.clipboardData.items);
//     const items = e.clipboardData?.items;

//     if (!items) return;

//     for (const item of items) {

//         if (!item.type.startsWith("image/"))
//             continue;

//         e.preventDefault();

//         const file = item.getAsFile();

//         if (!file) return;

//         const reader = new FileReader();

//         reader.onload = () => {

//             const img = new Image();

//             img.onload = () => {

//                 createImageCell({
//                     row: activeCell.row,
//                     col: 0,
//                     imageData: reader.result,
//                     width: img.width,
//                     height: img.height,
//                     colSpan: COLS,
//                 });
//             };

//             img.src = reader.result;
//         };

//         reader.readAsDataURL(file);

//         return;
//     }
// };
  return { 
    // handleImagePaste,

   };
}