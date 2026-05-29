import NoteEditor from "./NoteEditor";
import useStudyDesk from "../../hooks/useStudyDesk";

function NoteControls({
    setNotePages,
    notePages,
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteIndex,
    currentNoteIndex,
    currentNote,
    MAX_NOTE_PAGE,
}) {

const {
    addPage,
    deleteCurrentPage,
    resetCurrentPage,
    goPrev,
    goNext,
} = useStudyDesk({
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteIndex,
    currentNoteIndex,
    currentNote,
    setNotePages,
    notePages,
    MAX_NOTE_PAGE,
});


    return (
        <>
            
            <button onClick={() => addPage( currentNote.lecturePage ) } >
                메모 추가 (+)
            </button>

            <button onClick={ deleteCurrentPage }
            style={{ marginLeft: 10,
            }}
            >
                현재 페이지 삭제
            </button>

            <button onClick={ resetCurrentPage }
            style = {{ marginLeft: 10, }}>
                현재 페이지 초기화
            </button>

            <h3
            style={{ marginTop: 20, }}
            >
            {currentNote.id}
            </h3>

            <NoteEditor 
                setNotePages={setNotePages}
                currentNote={currentNote}
            />

            <div
            style={{
                marginTop: 20,
            }}
            >
            <button onClick={goPrev}>
                이전
            </button>

            <button
                onClick={goNext}
                style={{
                marginLeft: 10,
                }}
            >
                다음
            </button>
            </div>
        </>
    );
}

export default NoteControls;