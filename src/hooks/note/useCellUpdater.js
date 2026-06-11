export function useCellUpdater(setNotePages, currentNote) {
  const updateCellValue = (row, col, value, colSpan = 1 ) => {
    setNotePages(prev => {
      const pages = prev[currentNote.lecturePage] ?? [];

      return {
        ...prev,
        [currentNote.lecturePage]: pages.map(n => {
          if (n.id !== currentNote.id) return n;

          const cells = { ...(n.cells ?? {}) };
          const key = `${row}-${col}`;
            const isSpecialCell =
            cells[key]?.type &&
            cells[key]?.type !== "text";

          if (!value && !isSpecialCell) delete cells[key];
          else {
            cells[key] = {
              ...(cells[key] ?? {}),
              id: cells[key]?.id ?? crypto.randomUUID(),
              type: cells[key]?.type ?? "text",
              row,
              col,
              content: value,
              colSpan,
            };
          }

          return { ...n, cells };
        })
      };
    });
  };

  return { updateCellValue };
}