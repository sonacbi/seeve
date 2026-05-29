import NavigationSlot from "../common/NavigationSlot";
import useStudyDesk from "../../hooks/useStudyDesk";

function NoteNavigator({
    flattenedNotes,
    setCurrentNoteIndex,
    setNotePages,
    currentLectureNotes,
    MAX_NOTE_PAGE,
    currentNote,

    rollback,

    isDeleteMode,
    isResetMode,
}) {
const isPending = isDeleteMode || isResetMode;

const {
    moveToNote
} = useStudyDesk({
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteIndex,
});

// const {
//     withRollback,
//     // rollback: rollbackAction,
// } = rollback;

    return (
        <>
            {/* 슬롯 UI */}
            <div className="pSlot noteSlot" // 하단 버튼과 간격 미세 조정 noteSlot
            >
                {[...Array(MAX_NOTE_PAGE)].map(
                    (_, index) => {
                    const page =
                        currentLectureNotes[
                        index
                        ];

                    return (
                        <NavigationSlot
                            key={index}
                            style={{
                                "--slot-width": "60px",
                                "--slot-height": "60px",
                            }}
                            disabled={!page}
                            isPending={isPending}
                            active={
                                page?.id ===
                                currentNote.id
                            }
                            onClick={()=>{
                                    if(isPending) return;
                                    moveToNote(index);
                                }
                            }
                        >
                            {page ? page.id : ""}
                        </NavigationSlot>
                    );
                    }
                )}
            </div>
        </>
    );
}

export default NoteNavigator;