import NoteEditor from "./NoteEditor";
import useStudyDesk from "../../hooks/useStudyDesk";

function NoteControls({
    setNotePages,
    notePages,
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteId,
    currentNoteId,
    currentNote,
    MAX_NOTE_PAGE,

    isDeleteMode,
    isResetMode,

    rollback,
}) {

const {
    // pendingAction,
    createRollback,
    clearRollback,
    rollback: rollbackAction,
    withRollback,
} = rollback;

const {
    addPage,
    deleteCurrentPage,
    resetCurrentPage,
    goPrev,
    goNext,
} = useStudyDesk({
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteId,
    currentNoteId,
    currentNote,
    setNotePages,
    notePages,
    MAX_NOTE_PAGE,

    createRollback,
    // clearRollback,
});
    const isPending = isDeleteMode || isResetMode;

    return (
        <>
            
            <button 
                className={ isPending
                ? "commitBtn" : "" }

                onClick={() => {
                    if(isPending){
                        clearRollback(); return;
                    } else { addPage( currentNote.lecturePage ) }
                } } >

                { isPending ? "확정 (ㆍ)" : "메모 추가 (+)" }
                
            </button>

            <button
                disabled={isResetMode}
                className={ isDeleteMode ? "undoBtn" : "" }

                onClick={() => {

                    if ( isDeleteMode ) {
                        rollbackAction({ setNotePages, setCurrentNoteId, });
                        return;
                    }

                    deleteCurrentPage();
                }}
            >
                { isDeleteMode ? "삭제 취소" : "현재 페이지 삭제" }
            </button>

            <button
                disabled={isDeleteMode}
                className={ isResetMode ? "undoBtn" : "" }

                onClick={() => {

                    if ( isResetMode ) {
                        rollbackAction({ setNotePages, setCurrentNoteId, });
                        return;
                    }

                    resetCurrentPage();
                }}
            >
                { isResetMode ? "초기화 취소" : "현재 페이지 초기화" }
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
            <button onClick={()=>{
                    if(isPending){ withRollback({ action: goPrev, context: { setNotePages, setCurrentNoteId, }, })
                    }else{ goPrev();}
                }}
            >
                이전
            </button>

            <button
                onClick={()=>{
                    if(isPending){ withRollback({ action: goNext, context: { setNotePages, setCurrentNoteId, }, })
                    }else{ goNext();}
                }}
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