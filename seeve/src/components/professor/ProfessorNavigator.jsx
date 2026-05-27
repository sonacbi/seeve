import NavigationSlot from "../common/NavigationSlot";
// import useStudyDesk from "../../hooks/useStudyDesk";

function ProfessorNavigator({
    lectureCount,
    notePages,
    flattenedNotes,
    setCurrentNoteIndex,
    currentLectureIndex,
}) {

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

    const globalIndex =
        flattenedNotes.findIndex(
        (note) =>
            note.id === firstNote.id
        );

    setCurrentNoteIndex(globalIndex);
    };

// const {
//     professorSlots,
//     moveProfessorPage,
// } = useStudyDesk({
//     lectureCount,
//     notePages,
//     flattenedNotes,
//     setCurrentNoteIndex,
//     currentLectureIndex,
// });

    return (
        <>
            {/* 교수 페이지 슬롯 */}
                <div
                    style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 20,
                    }}
                >
                    {professorSlots.map(
                        (slot, index) => {

                            const background =
                                index === 2
                                    ? "#ffe66d"
                                    : slot?.hasMemo
                                    ? "#d8ecff"
                                    : "#d9d9d9";

                            return (
                                <NavigationSlot
                                    key={index}
                                    width={90}
                                    height={90}
                                    disabled={!slot}
                                    background={background}
                                    onClick={() =>
                                        moveProfessorPage(
                                            slot.lecturePage
                                        )
                                    }
                                >
                                    {slot && (
                                        <>
                                            <div>
                                                {
                                                    slot.lecturePage
                                                }
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: 12,
                                                }}
                                            >
                                                {
                                                    slot.noteCount
                                                }
                                                page
                                            </div>
                                        </>
                                    )}
                                </NavigationSlot>
                            );
                        }
                    )}
                </div>
        </>
    );
}

export default ProfessorNavigator;