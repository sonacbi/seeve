function useStudyDesk({
    currentLectureNotes,
    flattenedNotes,
    // setCurrentNoteIndex,
    setCurrentNoteId,
    // currentNoteIndex,
    currentNoteId,
    currentNote,
    // currentLectureIndex,
    // lectureCount,
    setNotePages,
    notePages,
    MAX_NOTE_PAGE,

    // useRollback 계승
    createRollback,
    // clearRollback,
}) { 

//NoteNavigator
    // 슬롯 클릭
    const moveToNote = (slotIndex) => {
        const target =
        currentLectureNotes[slotIndex];

        if (!target) return;

        // const globalIndex =
        // flattenedNotes.findIndex(
        //   (note) => note.id === target.id
        // );

        setCurrentNoteId(target.id)
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

    // 삭제 후 이동할 페이지 id
    let nextTargetId = null;
    
    setNotePages((prev) => {
      // rollback 저장
      createRollback({ type: "delete",
          snapshot: { notePages, currentNoteId, },
      });

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

      // 삭제 후 이동 위치
      nextTargetId =
          filtered[0]?.id ??
          `${lecturePage}-1`;

      return updated;
    });

    // setCurrentNoteIndex((prev) =>
    //   Math.max(prev - 1, 0)
    // );
    // setState 밖에서 이동
    if (nextTargetId) {
        setCurrentNoteId(
            nextTargetId
        );
    }
  };

  // -----------------------
  // 초기화
  // -----------------------
  const resetCurrentPage = () => {
    const lecturePage =
      currentNote.lecturePage;
  

    setNotePages((prev) => {
      // rollback 저장
      createRollback({ type: "reset",
        snapshot: { notePages, currentNoteId, },
      });

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
    // if (currentNoteIndex > 0) { setCurrentNoteIndex((prev) => prev - 1); }
    const currentIndex =
      flattenedNotes.findIndex(
          (note) =>
              note.id === currentNoteId
      );

    if (currentIndex > 0) {
        setCurrentNoteId(
            flattenedNotes[
                currentIndex - 1
            ].id
        );
    }
  };

  const goNext = () => {
    // if ( currentNoteIndex < flattenedNotes.length - 1 ) { setCurrentNoteIndex((prev) => prev + 1); }
    const currentIndex =
      flattenedNotes.findIndex(
          (note) =>
              note.id === currentNoteId
      );

    if (currentIndex < flattenedNotes.length - 1 ) {
        setCurrentNoteId(
            flattenedNotes[
                currentIndex + 1
            ].id
        );
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