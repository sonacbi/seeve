
import { useEffect, useRef } from "react";           

import { useCellNavigation } from "../../hooks/note/useCellNavigation";

import Cell from "./Cell";
import { useCellUpdater } from "../../hooks/note/useCellUpdater";
import {useNoteGrid} from "../../hooks/note/useNoteGrid";
import {useCellMutations} from "../../hooks/note/useCellMutations";
import {useCellEditor} from "../../hooks/note/useCellEditor";
import {useCellKeyboard} from "../../hooks/note/useCellKeyboard";

function NoteEditor({
    setNotePages,
    notePages,
    currentNote,
    setIsEdit,
    isEdit,
}) {
const inputRef = useRef(null);
const ROWS = 40;
const COLS = 6;

// =========================
// SETTER (UI STATE)
// =========================
// const [activeCell, setActiveCell] = useState(null);

// const [mode, setMode] = useState("select");

// 이미지 영역 추가용
// const [imageEditor, setImageEditor] = useState(null);
// { row, col }

console.log(currentNote);

const {
    note,
    cellMap,
    // getCell,
    grid,
} = useNoteGrid({
    notePages,
    currentNote,
    ROWS,
    COLS,
});

// =========================
// GETTER (READ ONLY)
// =========================
// const currentPage =
//   setNotePages?.[currentNote.lecturePage] ?? [];

// const note =
//   currentPage.find(n => n.id === currentNote.id);


// =========================
// UPDATE (CELL)
// =========================
const { updateCellValue } = useCellUpdater(setNotePages, currentNote);

const {
    commitDraft,
    enterEditMode,
    draftRef, /*setDraft, clearDraft, */
    activeCell, setActiveCell,
} =useCellEditor({
    inputRef,
    updateCellValue,
});

const {
    // updateCell,
    // createCell,
    applyToSelectedCell,
} = useCellMutations({
    updateCellValue,
    setNotePages,
    currentNote,
    note,
    setActiveCell,
    activeCell,
    cellMap,
    ROWS, COLS,
});


useEffect(() => {
  if (!activeCell) return;

  const cell = cellMap[`${activeCell.row}-${activeCell.col}`];
  const value = cell?.content ?? "";
  draftRef.current = value;

  if (inputRef.current) {
    inputRef.current.value = value; // DOM 직접 세팅
  }
}, [activeCell, cellMap, draftRef]);

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

const { moveCellWithFocus,
    autoEdit
 } =useCellKeyboard({
    moveCell,
    inputRef,
    activeCell,
    setActiveCell,
    applyToSelectedCell,
    cellMap,
    draftRef,
    setIsEdit,
    isEdit,
});

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
                {grid.map(({ key, row, col, cell, pos_width, gridrows }) => (
                    <Cell
                        key={key}
                        cell={cell}
                        isActive={ cell?.col === 0 && cell?.colSpan > 1 ?
                            activeCell?.row === row : ( activeCell?.row === row && activeCell?.col === col )
                        }
                        onClick={() => {setActiveCell({ row, col, mode: "select" }); autoEdit(isEdit);}}
                        onDoubleClick={() => enterEditMode(row, col)}
                    />
                ))}
            {activeCell && activeCell.mode === "edit" && pos && (
                <textarea
                    className="floating-editor"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            e.preventDefault();

                            requestAnimationFrame(() => {
                                setActiveCell(prev => {
                                console.log("ESC prev:", prev);
                                return {
                                    ...prev,
                                    mode: "select",
                                };
                                });
                            });

                            inputRef.current?.blur?.();
                            return;
                        }
                        if (e.key === "Tab") {
                        e.preventDefault();
                        e.stopPropagation();
                        moveCellWithFocus(0, e.shiftKey ? -1 : 1);
                        autoEdit(isEdit);
                        return;
                        }

                        if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        moveCellWithFocus(e.shiftKey ? -1 : 1, 0);
                        autoEdit(isEdit);
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
                    onBlur={() => {commitDraft(); }}
                    />
                )}
            </div>
    </div>
        </>
    );
}

export default NoteEditor;