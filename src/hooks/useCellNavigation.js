export function useCellNavigation({
  activeCell,
  setActiveCell,
  // draftRef,
  // clearDraft,
  // updateCellValue,
  commitDraft,
  ROWS,
  COLS
}) {
  const moveCell = (dr, dc) => {
    // if (activeCell) {
    //         const value = draftRef.current;
    //         updateCellValue(
    //             activeCell.row,
    //             activeCell.col,
    //             value
    //         );
        
    //   clearDraft();
    // };
    commitDraft();

    setActiveCell(prev => {
      if (!prev) return prev;

      return {
        row: Math.max(0, Math.min(ROWS - 1, prev.row + dr)),
        col: Math.max(0, Math.min(COLS - 1, prev.col + dc)),
      };
    });
  };

  return { moveCell };
}