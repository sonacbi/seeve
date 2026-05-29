function useProfessor({
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteId,
    // currentNoteIndex,
    currentNote,
    currentLectureIndex,
    lectureCount,
    setNotePages,
    notePages,
    MAX_NOTE_PAGE,
}) { 
  //ProfessorNavigator
  
    // 교수 네비 슬롯
    const professorSlots = [];

    for (let offset = -2; offset <= 2; offset++) {
    const lectureIndex =
        currentLectureIndex + offset;

    if (
        lectureIndex < 1 ||
        lectureIndex > lectureCount
    ) {
        professorSlots.push(null);
        continue;
    }

    const lectureKey = `p${lectureIndex}`;
    const notes = notePages[lectureKey] || [];

    professorSlots.push({
        lecturePage: lectureKey,
        noteCount: notes.length,
        hasMemo: notes.some(
        (n) => n.content.trim() !== ""
        ),
    });
    }

    // 교수 슬롯 이동
    const moveProfessorPage = (
    lecturePage
    ) => {
    // const firstNote =
    //     notePages[lecturePage][0];
    const firstNote =
        notePages?.[lecturePage]?.[0];

    if (!firstNote) return;

    setCurrentNoteId( firstNote.id );
    };


    return {
        professorSlots,
        moveProfessorPage,
    };

}

export default useProfessor;