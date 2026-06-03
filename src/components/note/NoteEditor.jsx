
import { useState, useEffect, useRef, useMemo, useCallback } from "react";           
import { useCellUpdater } from "../../hooks/useCellUpdater";
import { useDraft } from "../../hooks/useDraft";
import { useCellNavigation } from "../../hooks/useCellNavigation";
import Cell from "./Cell";
function NoteEditor({
    setNotePages,
    notePages,
    currentNote,
}) {
const inputRef = useRef(null);
const ROWS = 40;
const COLS = 6;

// =========================
// SETTER (UI STATE)
// =========================
// const [activeCell, setActiveCell] = useState(null);
const { draftRef, /*setDraft,*/ clearDraft } = useDraft();
const [mode, setMode] = useState("select");

const [activeCell, setActiveCell] = useState({
  row: 0,
  col: 0,
  mode: "select",
});
const [imageEditor, setImageEditor] = useState(null);
// { row, col }

console.log(currentNote);
// =========================
// GETTER (READ ONLY)
// =========================
// const currentPage =
//   setNotePages?.[currentNote.lecturePage] ?? [];

// const note =
//   currentPage.find(n => n.id === currentNote.id);
const note = useMemo(() => {
  return notePages?.[currentNote.lecturePage]
    ?.find(n => n.id === currentNote.id);
}, [notePages, currentNote]);


const cellMap = useMemo(() => {
  return note?.cells ?? {};
}, [note?.cells]);

// cell getter
const getCell = (row, col) =>
//   note?.cells?.[`${row}-${col}`] ?? null;
  cellMap[`${row}-${col}`] ?? null;


// =========================
// UPDATE (CELL)
// =========================
const { updateCellValue } = useCellUpdater(setNotePages, currentNote);

const updateCell = (cellId, patch) => {
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
};

const commitDraft = () => {
  if (!activeCell) return;

  const value = draftRef.current;

  updateCellValue(activeCell.row, activeCell.col, value);
  clearDraft();
};

// grid 생성 렌더
const hiddenCells = new Set();

const grid = useMemo(() => {
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
}, [cellMap]);

// setter update 혼합
const createCell = (type) => {
    if (!activeCell) return;
    updateCellValue(activeCell.row, activeCell.col, "");
    setNotePages(prev => {
        const pages = [...(prev[currentNote.lecturePage] ?? [])];

        return {
        ...prev,
        [currentNote.lecturePage]: pages.map(n => {
            if (n.id !== currentNote.id) return n;

            const cells = { ...(n.cells ?? {}) };
            const key = `${activeCell.row}-${activeCell.col}`;

            cells[key] = {
            id: crypto.randomUUID(),
            type,
            row: activeCell.row,
            col: activeCell.col,
            content: ""
            };

            return { ...n, cells };
        })
        };
    });

};

useEffect(() => {
  if (!activeCell) return;

  const cell = cellMap[`${activeCell.row}-${activeCell.col}`];
  const value = cell?.content ?? "";
  draftRef.current = value;

  if (inputRef.current) {
    inputRef.current.value = value; // DOM 직접 세팅
  }
}, [activeCell, cellMap]);

// useEffect(() => {
//   if (!activeCell || !inputRef.current) return;

//   const cell = cellMap[`${activeCell.row}-${activeCell.col}`];
//   const value = cell?.content ?? "";

//   draftRef.current = value;
//   inputRef.current.value = value;
//   inputRef.current.focus();
// }, [activeCell]);

// useEffect(() => {
//   if (activeCell && inputRef.current) {
//     inputRef.current.focus();
//   }
// }, [activeCell]);

const { moveCell } = useCellNavigation({
  activeCell,
  setActiveCell,
//   draftRef,
//   clearDraft,
//   updateCellValue,
  commitDraft,
  ROWS,
  COLS
});
const moveCellWithFocus = (dr, dc) => {
  moveCell(dr, dc);

  requestAnimationFrame(() => {
    inputRef.current?.focus();
  });
};

const enterEditMode = (row, col) => {
  setActiveCell({ row, col, mode: "edit" });

  requestAnimationFrame(() => {
    inputRef.current?.focus();
  });
};


    // const updateSelectedCellType = (type) => {
    //     if (!selectedCellId) return;

    //     updateCell(selectedCellId, { type });
    // };
    // const applyToSelectedCell = (type) => {
    //     if (!selectedCellId) return;

    //     updateCell(selectedCellId, {
    //         type,
    //     });
    // };
    // const applyToSelectedCell = useCallback((type, id) => {
    //     updateCell(id, { type });
    // }, [updateCell]);
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
    activeCell,
    cellMap,
    COLS,
    currentNote,
    setNotePages,
    updateCell
]);

    // 셀 이동 전용
    useEffect(() => {
    const handleMoveKeyDown = (e) => {
        if (!activeCell) return;

        // textarea 편집 중이면 무시
        if (document.activeElement?.tagName === "TEXTAREA") {
        return;
        }

        switch (e.key) {
        case "ArrowRight":
            e.preventDefault();
            moveCellWithFocus(0, 1);
            return;

        case "ArrowLeft":
            e.preventDefault();
            moveCellWithFocus(0, -1);
            return;

        case "ArrowDown":
            e.preventDefault();
            moveCellWithFocus(1, 0);
            return;

        case "ArrowUp":
            e.preventDefault();
            moveCellWithFocus(-1, 0);
            return;

        case "Tab":
            e.preventDefault();
            moveCell(0, e.shiftKey ? -1 : 1);
            return;

        case "Enter":
            e.preventDefault();
            moveCell(e.shiftKey ? -1 : 1, 0);
            return;

        default:
            return;
        }
    };

    window.addEventListener("keydown", handleMoveKeyDown);

    return () => {
        window.removeEventListener(
        "keydown",
        handleMoveKeyDown
        );
    };
    }, [
    activeCell,
    moveCell,
    moveCellWithFocus
    ]);
useEffect(() => {
    console.log("mode:", activeCell?.mode);
}, [activeCell?.mode]);
    useEffect(() => {
        const handleCommandKeyDown = (e) => {
            if (!activeCell) return;

            // Ctrl + Space
            if (
            activeCell.mode === "select" &&
            e.ctrlKey &&
            e.code === "Space"
            ) {
            e.preventDefault();

            setActiveCell(prev => ({
                ...prev,
                mode: "command"
            }));

            return;
            }

            if (activeCell.mode !== "command") return;

            const key = e.key.toLowerCase();

            switch (key) {
            case "f": {
                applyToSelectedCell("formula");
                break;
            }

            case "i": {
                applyToSelectedCell("image");
                
                break;
            }

            case "g": {
                applyToSelectedCell("graph");
                
                break;
            }

            case "m": {
                applyToSelectedCell("mindmap");
                break;
            }

            case "escape":
                break;

            default:
                return;
            }

            setActiveCell(prev => ({
            ...prev,
            mode: "select"
            }));
        };

        window.addEventListener(
            "keydown",
            handleCommandKeyDown
        );

        return () =>
            window.removeEventListener(
            "keydown",
            handleCommandKeyDown
            );
        }, [
    activeCell,
    applyToSelectedCell
    ]);

    useEffect(() => {
    const handleEditStart = (e) => {
        if (!activeCell) return;

        if (activeCell.mode !== "select") return;

        if ( document.activeElement?.tagName === "TEXTAREA" ) { return; }
        
        const rowSpecialCell = cellMap[`${activeCell?.row}-0`];

        const isSpecialRow =
            rowSpecialCell &&
            rowSpecialCell.type !== "text";

        if (isSpecialRow) { return;}

        const isPrintable =
        e.key.length === 1 ||
        e.key === "Backspace";

        if (!isPrintable) return;

        e.preventDefault();

        setActiveCell(prev => ({
        ...prev,
        mode: "edit"
        }));

        draftRef.current =
        e.key === "Backspace"
            ? ""
            : e.key;

        requestAnimationFrame(() => {
        inputRef.current?.focus();
        });
    };

    window.addEventListener(
        "keydown",
        handleEditStart
    );

    return () =>
        window.removeEventListener(
        "keydown",
        handleEditStart
        );
    }, [
    activeCell,
    draftRef
    ]);

    // const createFormulaCell = () =>
    //     createCell("formula");

    // const createImageCell = () =>
    //     createCell("image");

    // const createGraphCell = () =>
    //     createCell("graph");

    // const createMindMapCell = () =>
    //     createCell("mindmap");

    // const renderCell = (cell) => {
    // switch (cell.type) {
    //     case "text":
    //         return (
    //             <div
    //             onClick={() => {
    //                 setActiveCell({
    //                 row: cell.row,
    //                 col: cell.col
    //                 });

    //                 // setDraftValue(cell.content ?? "");
    //             }}
    //             style={{ width: "100%", height: "100%" }}
    //             >
    //             {cell.content}
    //             </div>
    //         );

    //             case "formula":
    //                 return (
    //                     <FormulaCell
    //                         cell={cell}
    //                     />
    //                 );

    //             case "image":
    //                 return (
    //                     <ImageCell
    //                         cell={cell}
    //                     />
    //                 );

    //             // case "graph":
    //             //     return (
    //             //         <GraphCell
    //             //             cell={cell}
    //             //         />
    //             //     );

    //             // case "mindmap":
    //             //     return (
    //             //         <MindMapCell
    //             //             cell={cell}
    //             //         />
    //             //     );

    //             default:
    //                 return null;
    //         }
    //     };
// function FormulaCell({ cell }) {
//     return (
//         <input
//             style={{
//                 border: "none",
//                 outline: "none",
//                 width: "100%",
//                 height: "100%",
//                 background: "transparent",
//             }}
//             placeholder="LaTeX"
//             value={cell.latex}
//             onChange={(e) =>
//                 updateCell(cell.id, {
//                     latex: e.target.value,
//                 })
//             }
//         />
//     );
// }
//     function ImageCell({ cell }) {
//         return (
//             <div className="image-cell">

//                 {cell.imageData ? (
//                     <img
//                         src={cell.imageData}
//                         alt=""
//                     />
//                 ) : (
//                     "이미지 없음"
//                 )}

//             </div>
//         );
//     }




const editorRef = useRef(null);

const CELL_HEIGHT = 40;
const GRID_COLS = COLS;
// const GRID_ROWS = ROWS;
// const CELL_WIDTH = `calc(100% / ${GRID_COLS})`;
const CELL_WIDTH_PERCENT = 100 / COLS;
const pos = activeCell
  ? {
      top: activeCell.row * CELL_HEIGHT,
      left: `${activeCell.col * CELL_WIDTH_PERCENT}%`,
      width: `${CELL_WIDTH_PERCENT}%`,
      height: `${CELL_HEIGHT}px`
    }
  : null;

    return (
        <>
            <div id="note-window">

            <div
                className="note-editor"
                ref={editorRef}
                style={{
                    display: "grid",
                    "--grid-cols" : `repeat(${GRID_COLS}, 1fr)`,
                    "--grid-rows": `${CELL_HEIGHT}px`,
                    width: "100%",
                    height: "100%",
                }}
                >
                {grid.map(({ key, row, col, cell }) => (
                    <Cell
                        key={key}
                        cell={cell}
                        isActive={ cell?.col === 0 && cell?.colSpan > 1 ?
                            activeCell?.row === row : ( activeCell?.row === row && activeCell?.col === col )
                        }
                        onClick={() => setActiveCell({ row, col, mode: "select" })}
                        onDoubleClick={() => enterEditMode(row, col)}
                    />
                ))}
            {activeCell && activeCell.mode === "edit" && pos && (
                <textarea
                    className="floating-editor"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Tab") {
                        e.preventDefault();
                        e.stopPropagation();
                        moveCellWithFocus(0, e.shiftKey ? -1 : 1);
                        return;
                        }

                        if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        moveCellWithFocus(e.shiftKey ? -1 : 1, 0);
                        return;
                        }
                    }}
                    ref={inputRef}
                    // value={draftRef}
                    style={{
                        position: "absolute",
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height,
                        margin: 0,
                        transform: "translate(0,0)"
                    }}
                    onChange={(e) => {draftRef.current = e.target.value;}}
                    onBlur={() => {commitDraft(); setActiveCell(null);}}
                    />
                )}
            </div>
    </div>
        </>
    );
}

export default NoteEditor;