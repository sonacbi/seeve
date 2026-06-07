import { useCallback, useEffect } from "react";

export function useCellKeyboard({
    moveCell,
    inputRef,
    activeCell,
    setActiveCell,
    applyToSelectedCell,
    cellMap,
    draftRef,
    setIsEdit,
    isEdit,
    setSelection,
    selection,
    commitDraft,
    updateCellValue,
}) {

// =========================
// GETTER (READ ONLY)
// =========================
const autoEdit = useCallback((isEdit) => {
    if (!isEdit) return;

    requestAnimationFrame(() => {
        setActiveCell(prev => ({
            ...prev,
            mode: "edit",
        }));
    });
}, [setActiveCell]);

const isMultiSelection = useCallback(() => {
    if (!selection) return false;

    return (
        selection.start.row !== selection.end.row ||
        selection.start.col !== selection.end.col
    );
}, [selection]);

const getSelectionBounds = useCallback(() => {
    if (!selection) return null;

    return {
        minRow: Math.min(selection.start.row, selection.end.row),
        maxRow: Math.max(selection.start.row, selection.end.row),
        minCol: Math.min(selection.start.col, selection.end.col),
        maxCol: Math.max(selection.start.col, selection.end.col),
    };
}, [selection]);
// =========================
// UPDATE (CELL)
// =========================

const moveCellWithFocus = useCallback((dr, dc) => {
    moveCell(dr, dc);
    setSelection(prev => {
        if (!prev) return prev;

        const isSingle =
            prev.start.row === prev.end.row &&
            prev.start.col === prev.end.col;

        if (!isSingle) {
            return prev;
        }

        return {
            start: {
                row: prev.start.row + dr,
                col: prev.start.col + dc,
            },
            end: {
                row: prev.end.row + dr,
                col: prev.end.col + dc,
            },
        };
    });
    requestAnimationFrame(() => {
        inputRef.current?.focus();
    });
}, [moveCell, inputRef, setSelection]);
const moveInsideSelection = useCallback((dr, dc) => {
    if (!selection) return;

    commitDraft();

    const bounds = getSelectionBounds();

    setActiveCell(prev => ({
        ...prev,
        row: Math.max(
            bounds.minRow,
            Math.min(bounds.maxRow, prev.row + dr)
        ),
        col: Math.max(
            bounds.minCol,
            Math.min(bounds.maxCol, prev.col + dc)
        ),
        mode: "select",
    }));

    requestAnimationFrame(() => {
        inputRef.current?.focus();
    });
}, [
    selection,
    getSelectionBounds,
    setActiveCell,
    commitDraft,
    inputRef,
]);

// 지우기 전용
useEffect(() => {
    const handleDelete = (e) => {
        if (!activeCell) return;

        if (e.key !== "Delete") return;

        if (document.activeElement?.tagName === "TEXTAREA") {
            return;
        }

        e.preventDefault();

        // 다중선택
        if (selection && isMultiSelection()) {
            const bounds = getSelectionBounds();

            for (
                let row = bounds.minRow;
                row <= bounds.maxRow;
                row++
            ) {
                for (
                    let col = bounds.minCol;
                    col <= bounds.maxCol;
                    col++
                ) {
                    updateCellValue(row, col, "");
                }
            }

            return;
        }

        // 단일선택
        updateCellValue(
            activeCell.row,
            activeCell.col,
            ""
        );
    };

    window.addEventListener(
        "keydown",
        handleDelete
    );

    return () =>
        window.removeEventListener(
            "keydown",
            handleDelete
        );
}, [
    activeCell,
    selection,
    isMultiSelection,
    getSelectionBounds,
    updateCellValue,
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
            if (isMultiSelection())
                { moveInsideSelection( 0, e.shiftKey ? -1 : 1);
            } else
                { moveCellWithFocus( 0, e.shiftKey ? -1 : 1 ); }
            autoEdit(isEdit);
            return;

        case "Enter":
            e.preventDefault();
            e.stopPropagation();
            if (isMultiSelection())
                { moveInsideSelection( e.shiftKey ? -1 : 1, 0);
            } else
                { moveCellWithFocus( e.shiftKey ? -1 : 1,0); }
            autoEdit(isEdit);
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
    setActiveCell, activeCell, moveCell, moveCellWithFocus, autoEdit, isEdit, isMultiSelection, moveInsideSelection
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
            case "s": {
                e.preventDefault();
                e.stopPropagation();
                setIsEdit(!isEdit);
                autoEdit(isEdit);
                break;
            }
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
setActiveCell(prev => {
  console.log("ESC prev:", prev);
  return {
    ...prev,
    mode: "select",
  };
});
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
}, [ setActiveCell, activeCell, applyToSelectedCell, autoEdit, isEdit, setIsEdit ]);

useEffect(() => {
    const handleEditStart = (e) => {
        if (e.ctrlKey || e.metaKey) { // CTRL+C
            return;
        }
        if (!activeCell) return;

        if (activeCell.mode !== "select") return;

        if (e.key === "Enter") return;

        if ( document.activeElement?.tagName === "TEXTAREA" ) { return; }
        
        const rowSpecialCell = cellMap[`${activeCell?.row}-0`];

        const isSpecialRow =
            rowSpecialCell &&
            rowSpecialCell.type !== "text";

        if (isSpecialRow) { return;}

        const isPrintable =
        e.key.length === 1 ||
        e.key === "Backspace";
        if (e.key === "Enter") return;
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
    draftRef,
    inputRef,
    setActiveCell,
    activeCell,
    cellMap,
    // draftRef
]);

  return { 
    moveCellWithFocus,
    autoEdit,
    isMultiSelection,
    moveInsideSelection,
   };
}