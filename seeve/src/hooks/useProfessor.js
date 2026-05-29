function useProfessor({
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteId,
    // currentNoteIndex,
    currentNote,
    currentLectureIndex,
    lectureCount,
    // setNotePages,
    professorOrder,
    setProfessorOrder,

    notePages,
    MAX_NOTE_PAGE,
}) { 
  //ProfessorNavigator
  
    // 교수 네비 슬롯
    // const professorSlots = [];

    // for (
    //     let lectureIndex = 1;
    //     lectureIndex <= lectureCount;
    //     lectureIndex++
    // ) {
    //     const lectureKey = `p${lectureIndex}`;
    //     const notes = notePages[lectureKey] || [];

    //     professorSlots.push({
    //         lecturePage: lectureKey,
    //         noteCount: notes.length,
    //         hasMemo: notes.some(
    //             (n) => n.content.trim() !== ""
    //         ),
    //     });
    // }

    const professorSlots =
    professorOrder.map(
        (lecturePage) => {

            const notes =
                notePages[
                    lecturePage
                ] || [];

            return {
                lecturePage,
                noteCount:
                    notes.length,
                hasMemo:
                    notes.some(
                        (n) =>
                            n.content.trim() !== ""
                    ),
            };
        }
    );

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

        const swapProfessorPage = (
        fromIndex,
        toIndex
    ) => {
        if (
            fromIndex == null ||
            fromIndex === toIndex
        ) {
            return;
        }

        setProfessorOrder(
            (prev) => {
                const updated =
                    [...prev];

                [
                    updated[fromIndex],
                    updated[toIndex],
                ] = [
                    updated[toIndex],
                    updated[fromIndex],
                ];

                return updated;
            }
        );
    };


    return {
        professorSlots,
        moveProfessorPage,
        swapProfessorPage,
    };

}

export default useProfessor;