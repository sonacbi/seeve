
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
const [activeCell, setActiveCell] = useState(null);
const { draftRef, /*setDraft,*/ clearDraft } = useDraft();
const [createMode, setCreateMode] = useState(false);
const [selectedCellId, setSelectedCellId] = useState(null);

console.log(currentNote);
// =========================
// GETTER (READ ONLY)
// =========================
const currentPage =
  setNotePages?.[currentNote.lecturePage] ?? [];

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

// active value
const activeValue = activeCell
  ? getCell(activeCell.row, activeCell.col)?.content ?? ""
  : "";

// =========================
// UPDATE (CELL)
// =========================
const { updateCellValue } = useCellUpdater(setNotePages, currentNote);


const updateCellType = (cellId, type) => {
  setNotePages(prev => {
    const pages = [...(prev[currentNote.lecturePage] ?? [])];

    return {
      ...prev,
      [currentNote.lecturePage]: pages.map(n => {
        if (n.id !== currentNote.id) return n;

        const cells = { ...(n.cells ?? {}) };

        Object.keys(cells).forEach(key => {
          if (cells[key].id === cellId) {
            cells[key] = {
              ...cells[key],
              type
            };
          }
        });

        return { ...n, cells };
      })
    };
  });
};
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
const grid = useMemo(() => {
  const map = note?.cells ?? {};

  const result = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const key = `${r}-${c}`;
      const cell = map[key];

      result.push({
        key,
        row: r,
        col: c,
        cell
      });
    }
  }

  return result;
}, [note?.cells]);

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

useEffect(() => {
  const handleKeyDown = (e) => {
    if (!activeCell) return;
    if (document.activeElement?.tagName === "TEXTAREA") return;

    switch (e.key) {
        case "ArrowRight":
            moveCellWithFocus(0, 1);
            break;
        case "ArrowLeft":
            moveCellWithFocus(0, -1);
            break;
        case "ArrowDown":
            moveCellWithFocus(1, 0);
            break;
        case "ArrowUp":
            moveCellWithFocus(-1, 0);
            break;
            
        case "Tab":
            e.preventDefault();
            moveCell(0, e.shiftKey ? -1 : 1);
            break;

        case "Enter":
            e.preventDefault();
            moveCell(e.shiftKey ? -1 : 1, 0);
            break;
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [activeCell]);


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
    const applyToSelectedCell = useCallback((type, id) => {
        updateCell(id, { type });
    }, [updateCell]);
useEffect(() => {
  const handleKeyDown = (e) => {
    if (!activeCell) return;

    // 이미 editor 열려있으면 ignore
    if (activeCell.mode === "edit") return;

    // Tab / Enter 같은 네비게이션은 제외
    if (e.key === "Tab" || e.key === "Enter") return;

    // 방향키도 제외
    if (e.key.startsWith("Arrow")) return;

    // 수정 가능한 키만 감지
    const isPrintable =
      e.key.length === 1 || e.key === "Backspace";

    if (!isPrintable) return;

    e.preventDefault();

    const initialValue =
      e.key === "Backspace" ? "" : e.key;

    // editor 자동 오픈
    setActiveCell(prev => ({
      ...prev,
      mode: "edit"
    }));

    // draft 세팅
    draftRef.current = initialValue;

    if (inputRef.current) {
      inputRef.current.value = initialValue;
      inputRef.current.focus();
    }
  };

  window.addEventListener("keydown", handleKeyDown, true);
  return () => window.removeEventListener("keydown", handleKeyDown, true);
}, [activeCell]);

useEffect(() => {
  const handleKeyDown = (e) => {
    if (!activeCell) return;

    // 1. Ctrl + Space → 타입 선택 모드 진입
    if (e.ctrlKey && e.code === "Space") {
      e.preventDefault();

      // 현재 셀 기준으로만 동작
      setCreateMode(true);
      return;
    }

    if (!createMode) return;

    const key = e.key.toLowerCase();

    switch (key) {
      case "f":
        applyToSelectedCell("formula", cellMap?.[`${activeCell.row}-${activeCell.col}`]?.id);
        break;

      case "i":
        applyToSelectedCell("image", cellMap?.[`${activeCell.row}-${activeCell.col}`]?.id);
        break;

      case "g":
        applyToSelectedCell("graph", cellMap?.[`${activeCell.row}-${activeCell.col}`]?.id);
        break;

      case "m":
        applyToSelectedCell("mindmap", cellMap?.[`${activeCell.row}-${activeCell.col}`]?.id);
        break;

      case "escape":
        setCreateMode(false);
        return;

      default:
        return;
    }

    setCreateMode(false);
  };

  window.addEventListener("keydown", handleKeyDown, true);
  return () => window.removeEventListener("keydown", handleKeyDown, true);
}, [
  createMode,
  activeCell,
  applyToSelectedCell,
  cellMap
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
const GRID_ROWS = ROWS;
const CELL_WIDTH = `calc(100% / ${GRID_COLS})`;
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
                        isActive={activeCell?.row === row && activeCell?.col === col}
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