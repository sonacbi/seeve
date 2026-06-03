export function useCellUpdater(setNotePages, currentNote) {
  const updateCellValue = (row, col, value) => {
    setNotePages(prev => {
      const pages = prev[currentNote.lecturePage] ?? [];

      return {
        ...prev,
        [currentNote.lecturePage]: pages.map(n => {
          if (n.id !== currentNote.id) return n;

          const cells = { ...(n.cells ?? {}) };
          const key = `${row}-${col}`;

          if (!value) delete cells[key];
          else {
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

  return { updateCellValue };
}