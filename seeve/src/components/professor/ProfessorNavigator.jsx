import NavigationSlot from "../common/NavigationSlot";
import useProfessor from "../../hooks/useProfessor";

function ProfessorNavigator({
    lectureCount,
    notePages,
    flattenedNotes,
    setCurrentNoteIndex,
    currentLectureIndex,
}) {

const {
    professorSlots,
    moveProfessorPage,
} = useProfessor({
    lectureCount,
    notePages,
    flattenedNotes,
    setCurrentNoteIndex,
    currentLectureIndex,
});

    return (
        <>
            {/* 교수 페이지 슬롯 */}
                <div className="pSlot" >
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
                                    style={{
                                        "--slot-width": "90px",
                                        "--slot-height": "90px",
                                        "--slot--bg": background,
                                    }}
                                    key={index}
                                    disabled={!slot}
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