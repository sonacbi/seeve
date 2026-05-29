import NavigationSlot from "../common/NavigationSlot";
import useStudyDesk from "../../hooks/useStudyDesk";

function NoteNavigator({
    flattenedNotes,
    setCurrentNoteIndex,
    currentLectureNotes,
    MAX_NOTE_PAGE,
    currentNote,
}) {

const {
    moveToNote
} = useStudyDesk({
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteIndex,
});

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
                            active={
                                page?.id ===
                                currentNote.id
                            }
                            onClick={() =>
                                moveToNote(index)
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