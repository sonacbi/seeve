
import { useState, useEffect, useRef, memo, useMemo } from "react";           

function NoteEditor({
    setNotePages,
    notePages,
    currentNote,
}) {
// =========================
// SETTER (UI STATE)
// =========================
const [activeCell, setActiveCell] = useState(null);
const [draft, setDraft] = useState("");
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

// const note =
//   setNotePages?.[currentNote.lecturePage]
//     ?.find(n => n.id === currentNote.id);
  
// const page = setNotePages[currentNote.lecturePage];
// const note = useMemo(() => {
//   return setNotePages[currentNote.lecturePage]
//     ?.find(n => n.id === currentNote.id);
// }, [setNotePages, currentNote]);

// cell getter
const getCell = (row, col) =>
  note?.cells?.[`${row}-${col}`] ?? null;

// active value
const activeValue = activeCell
  ? getCell(activeCell.row, activeCell.col)?.content ?? ""
  : "";

// =========================
// UPDATE (CELL)
// =========================
const updateCellValue = (row, col, value) => {
  setNotePages(prev => {
    const pages = [...(prev[currentNote.lecturePage] ?? [])];

    return {
      ...prev,
      [currentNote.lecturePage]: pages.map(n => {
        if (n.id !== currentNote.id) return n;

        const cells = { ...(n.cells ?? {}) };
        const key = `${row}-${col}`;

        if (!value) {
          delete cells[key];
        } else {
          cells[key] = {
            ...(cells[key] ?? {}),
            id: cells[key]?.id ?? crypto.randomUUID(),
            type: cells[key]?.type ?? "text",
            row,
            col,
            content: value,
          };
        }

        return { ...n, cells };
      })
    };
  });
};

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

  updateCellValue(
    activeCell.row,
    activeCell.col,
    draft
  );
  setDraft("");
};

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
    // setNotePages(prev => {
    //     const updated = { ...prev };

    //     updated[currentNote.lecturePage] =
    //         updated[currentNote.lecturePage].map(note => {
    //             if (note.id !== currentNote.id) return note;

    //             const newCells = {
    //                 ...(note.cells ?? {}),
    //             };

    //             const key = activeKey;
    //             if (!key) return;

    //             newCells[key] = {
    //                 id: crypto.randomUUID(),
    //                 type,
    //                 row: activeCell.row,
    //                 col: activeCell.col,
    //                 rowSpan: 1,
    //                 colSpan: 1,
    //                 content: "",
    //                 latex: "",
    //                 imageData: null,
    //             };

    //             return {
    //                 ...note,
    //                 cells: newCells,
    //             };
    //         });

    //     return updated;
    // });
};

useEffect(() => {
    if (!activeCell) return;
    const cell = getCell(activeCell.row, activeCell.col);
    setDraft(cell?.content ?? "");
  
}, [activeCell, notePages]);

// useEffect(() => {
//   if (!activeCell) return;

//   setDraft(
//     note?.cells?.[`${activeCell.row}-${activeCell.col}`]?.content ?? ""
//   );
// }, [activeCell]);


useEffect(() => {
  if (activeCell && inputRef.current) {
    inputRef.current.focus();
  }
}, [activeCell]);

const inputRef = useRef(null);
// const cells = currentNote.cells ?? {};
const ROWS = 40;
const COLS = 12;
// const [cursor, setCursor] = useState({
//     row: 0,
//     col: 0,
// });
const moveCell = (dr, dc) => {
    commitDraft();

    setActiveCell(prev => {
        if (!prev) return prev;

        return {
        row: Math.max(0, Math.min(ROWS - 1, prev.row + dr)),
        col: Math.max(0, Math.min(COLS - 1, prev.col + dc)),
        };
    });
};

const moveCursor = (dr, dc) => {
  setActiveCell(prev => {
    if (!prev) return prev;

    return {
      row: Math.max(0, Math.min(ROWS - 1, prev.row + dr)),
      col: Math.max(0, Math.min(COLS - 1, prev.col + dc)),
    };
  });
};
const activeKey = activeCell
  ? `${activeCell.row}-${activeCell.col}`
  : null;

    useEffect(() => {
  const handleKeyDown = (e) => {
    if (!activeCell) return;
    if (document.activeElement?.tagName === "TEXTAREA") return;

    switch (e.key) {
      case "ArrowRight":
        moveCell(0, 1);
        break;
      case "ArrowLeft":
        moveCell(0, -1);
        break;
      case "ArrowDown":
        moveCell(1, 0);
        break;
      case "ArrowUp":
        moveCell(-1, 0);
        break;
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [activeCell]);


    const updateSelectedCellType = (type) => {
        if (!selectedCellId) return;

        updateCell(selectedCellId, { type });
    };
    const applyToSelectedCell = (type) => {
        if (!selectedCellId) return;

        updateCell(selectedCellId, {
            type,
        });
    };

    useEffect(() => {
  const handleKeyDown = (e) => {
    // 1. Ctrl + Space
    if (e.ctrlKey && e.code === "Space") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      setCreateMode(true);

      // 안전한 최신 값 기준으로 처리
      setSelectedCellId(prev => {
        if (!prev) {
          const isEmpty = Object.keys(currentNote?.cells ?? {}).length === 0;
          if (isEmpty) {
            createCell("text");
          }
        }
        return prev;
      });

      return;
    }

    // 2. createMode 아니면 무시
    if (!createMode) return;

    switch (e.key.toLowerCase()) {
      case "f":
        applyToSelectedCell("formula");
        break;

      case "i":
        applyToSelectedCell("image");
        break;

      case "g":
        applyToSelectedCell("graph");
        break;

      case "m":
        applyToSelectedCell("mindmap");
        break;

      case "escape":
        setSelectedCellId(null);
        break;

      default:
        return;
    }

    setCreateMode(false);
  };

  window.addEventListener("keydown", handleKeyDown, true);

  return () => {
    window.removeEventListener("keydown", handleKeyDown, true);
  };
}, [
  createMode,
  applyToSelectedCell,
  createCell,
  currentNote?.cells
]);


    const createFormulaCell = () =>
        createCell("formula");

    const createImageCell = () =>
        createCell("image");

    const createGraphCell = () =>
        createCell("graph");

    const createMindMapCell = () =>
        createCell("mindmap");

    const renderCell = (cell) => {
    switch (cell.type) {
        case "text":
            return (
                <div
                onClick={() => {
                    setActiveCell({
                    row: cell.row,
                    col: cell.col
                    });

                    // setDraftValue(cell.content ?? "");
                }}
                style={{ width: "100%", height: "100%" }}
                >
                {cell.content}
                </div>
            );

                case "formula":
                    return (
                        <FormulaCell
                            cell={cell}
                        />
                    );

                case "image":
                    return (
                        <ImageCell
                            cell={cell}
                        />
                    );

                // case "graph":
                //     return (
                //         <GraphCell
                //             cell={cell}
                //         />
                //     );

                // case "mindmap":
                //     return (
                //         <MindMapCell
                //             cell={cell}
                //         />
                //     );

                default:
                    return null;
            }
        };
function FormulaCell({ cell }) {
    return (
        <input
            style={{
                border: "none",
                outline: "none",
                width: "100%",
                height: "100%",
                background: "transparent",
            }}
            placeholder="LaTeX"
            value={cell.latex}
            onChange={(e) =>
                updateCell(cell.id, {
                    latex: e.target.value,
                })
            }
        />
    );
}
    function ImageCell({ cell }) {
        return (
            <div className="image-cell">

                {cell.imageData ? (
                    <img
                        src={cell.imageData}
                        alt=""
                    />
                ) : (
                    "이미지 없음"
                )}

            </div>
        );
    }
const editorRef = useRef(null);

const pos = activeCell
  ? {
      top: activeCell.row * 120,
      left: activeCell.col * (100 / 12) + "%",
      width: "calc(100% / 12)",
      height: "120px"
    }
  : null;
    // -----------------------
    // 텍스트 수정
    // -----------------------
    const updateContent = (text) => {
        setNotePages((prev) => {
        const updated = { ...prev };

        updated[currentNote.lecturePage] =
            updated[
            currentNote.lecturePage
            ].map((page) =>
            page.id === currentNote.id
                ? {
                    ...page,
                    content: text,
                }
                : page
            );

        return updated;
        });
    };
// const Cell = memo(({ cell, cellKey, activeKey, onClick }) => {
//   const isActive = cellKey === activeKey;

//   return (
//     <div
//       onClick={onClick}
//       style={{
//         border: isActive
//           ? "2px solid #4f46e5"
//           : "1px solid #ddd",
//         width: "100%",
//         height: "100%"
//       }}
//     >
//       {cell ? cell.content : <div />}
//     </div>
//   );
// });
const Cell = memo(({ cell, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        border: isActive ? "2px solid #4f46e5" : "1px solid #ddd",
        width: "100%",
        height: "100%"
      }}
    >
      {cell?.content ?? ""}
    </div>
  );
});
const currentValue =
  activeCell
    ? getCell(activeCell.row, activeCell.col)?.content ?? ""
    : "";
    return (
        <>
            <div id="note-window">

            <div
                className="note-editor"
                ref={editorRef}
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(12, 1fr)",
                    gridAutoRows: "120px",
                    width: "100%",
                    height: "100%",
                }}
                >
                {Array.from({ length: ROWS }).map((_, row) =>
                Array.from({ length: COLS }).map((_, col) => {
                    const cell = getCell(row, col);
                    const key = `${row}-${col}-${cell?.content ?? ""}`;

                    return (
                    <Cell
                        key={key}
                        cell={cell}
                        isActive={activeCell?.row === row && activeCell?.col === col}
                        onClick={() => setActiveCell({ row, col })}
                    />
                    );
                })
                )}
            {activeCell && pos && (
                <textarea
                    className="floating-editor"
                    autoFocus
onKeyDown={(e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      commitDraft();
      moveCell(0, e.shiftKey ? -1 : 1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      commitDraft();
      moveCell(e.shiftKey ? -1 : 1, 0);
      return;
    }
  }}
                    ref={inputRef}
                    value={draft}
                    style={{
                        position: "absolute",
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height,
                        margin: 0,
                        transform: "translate(0,0)"
                    }}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => {commitDraft(); setActiveCell(null);}}
                    />
                )}
            </div>
    </div>
        </>
    );
}

export default NoteEditor;