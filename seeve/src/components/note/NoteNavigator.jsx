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
            <div
            style={{
                display: "flex",
                gap: 10,
                marginBottom: 20,
            }}
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
                            width={60}
                            height={60}
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