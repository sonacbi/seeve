export function useCellNavigation({
  activeCell,
  setActiveCell,
  // draftRef,
  // clearDraft,
  // updateCellValue,
  commitDraft,
  ROWS,
  COLS,
  CELL_HEIGHT,
  editorRef,
}) {
  // const moveCell = (dr, dc) => {
  //   // if (activeCell) {
  //   //         const value = draftRef.current;
  //   //         updateCellValue(
  //   //             activeCell.row,
  //   //             activeCell.col,
  //   //             value
  //   //         );
        
  //   //   clearDraft();
  //   // };
  //   commitDraft();

  //   setActiveCell(prev => {
  //     if (!prev) return prev;

  //     return {
  //       row: Math.max(0, Math.min(ROWS - 1, prev.row + dr)),
  //       col: Math.max(0, Math.min(COLS - 1, prev.col + dc)),
  //       mode: "select",
  //     };
  //   });
  // };
const moveCell = (dr, dc) => {
  commitDraft();

  setActiveCell(prev => {
    if (!prev) return prev;

    const nextRow =
      Math.max(
        0,
        Math.min(ROWS - 1, prev.row + dr)
      );

    const nextCol =
      Math.max(
        0,
        Math.min(COLS - 1, prev.col + dc)
      );

    scrollToRow(nextRow);

    return {
      row: nextRow,
      col: nextCol,
      mode: "select",
    };
  });
};
const scrollToRow = (row) => {
  const container = editorRef.current;

  if (!container) return;

  const top = row * CELL_HEIGHT;
  const bottom = top + CELL_HEIGHT;

  const viewTop = container.scrollTop;
  const viewBottom =
    viewTop + container.clientHeight;

  if (bottom > viewBottom) {
    container.scrollTop =
      bottom - container.clientHeight;
  } else if (top < viewTop) {
    container.scrollTop = top;
  }
};
  return { moveCell };
}