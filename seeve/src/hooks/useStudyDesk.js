function useStudyDesk({
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteIndex,
    currentNoteIndex,
    currentNote,
    // currentLectureIndex,
    // lectureCount,
    setNotePages,
    notePages,
    MAX_NOTE_PAGE,
}) { 

//NoteNavigator
    // 슬롯 클릭
    const moveToNote = (slotIndex) => {
        const target =
        currentLectureNotes[slotIndex];

        if (!target) return;

        const globalIndex =
        flattenedNotes.findIndex(
            (note) => note.id === target.id
        );

        setCurrentNoteIndex(globalIndex);
    };

//NoteControls

  // -----------------------
  // 메모 추가 (최대 5개)
  // -----------------------
  const addPage = (lecturePage) => {
    setNotePages((prev) => {
      const updated = { ...prev };

      const currentCount =
        updated[lecturePage].length;

      if (currentCount >= MAX_NOTE_PAGE) {
        alert("최대 5페이지까지 가능합니다.");
        return prev;
      }

      updated[lecturePage] = [
        ...updated[lecturePage],
        {
          id: `${lecturePage}-${currentCount + 1}`,
          content: "",
        },
      ];

      return updated;
    });
  };

  // -----------------------
  // 삭제
  // -----------------------
  const deleteCurrentPage = () => {
    const lecturePage =
      currentNote.lecturePage;

    const noteList =
      notePages[lecturePage];

    // 최소 1페이지 보장
    if (noteList.length === 1) {
      alert("최소 1페이지는 유지됩니다.");
      return;
    }

    setNotePages((prev) => {
      const updated = { ...prev };

      // 현재 페이지 제거
      let filtered =
        updated[lecturePage].filter(
          (page) =>
            page.id !== currentNote.id
        );

      // sort 재정렬
      filtered = filtered.map(
        (page, index) => ({
          ...page,
          id: `${lecturePage}-${index + 1}`,
        })
      );

      updated[lecturePage] = filtered;

      return updated;
    });

    setCurrentNoteIndex((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  // -----------------------
  // 초기화
  // -----------------------
  const resetCurrentPage = () => {
    const lecturePage =
      currentNote.lecturePage;

    setNotePages((prev) => {
      const updated = { ...prev };

      updated[lecturePage] =
        updated[lecturePage].map((page) =>
          page.id === currentNote.id
            ? {
                ...page,
                content: "",
              }
            : page
        );

      return updated;
    });
  };



  // -----------------------
  // 이동
  // -----------------------
  const goPrev = () => {
    if (currentNoteIndex > 0) {
      setCurrentNoteIndex((prev) => prev - 1);
    }
  };

  const goNext = () => {
    if (
      currentNoteIndex <
      flattenedNotes.length - 1
    ) {
      setCurrentNoteIndex((prev) => prev + 1);
    }
  };

  //ProfessorNavigator
  

    return {
        moveToNote,
        addPage,
        deleteCurrentPage,
        resetCurrentPage,
        goPrev,
        goNext,
        // professorSlots,
        // moveProfessorPage,
    };

}

export default useStudyDesk;