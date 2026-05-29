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

    mode,

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
const {
    isDelete, isReset, isSort,
    isPending,
} = mode;

    return (
        <>
            <div className="noteButtonGroup">

                <button 
                    className={ isDelete || isReset
                        ? "commitBtn" : "" }
                        disabled ={isSort}
                        
                    onClick={() => {
                        if(isPending){
                            clearRollback(); return;
                        } else { addPage( currentNote.lecturePage ) }
                    } } >

                    { isDelete || isReset ? "확정 (ㆍ)" : "메모 추가 (+)" }
                    
                </button>

                <button
                    disabled={isReset || isSort }
                    className={ isDelete ? "undoBtn" : "" }

                    onClick={() => {

                        if ( isDelete ) {
                            rollbackAction({ setNotePages, setCurrentNoteId, });
                            return;
                        }

                        deleteCurrentPage();
                    }}
                >
                    { isDelete ? "삭제 취소" : "현재 페이지 삭제" }
                </button>

                <button
                    disabled={isDelete || isSort}
                    className={ isReset ? "undoBtn" : "" }

                    onClick={() => {

                        if ( isReset ) {
                            rollbackAction({ setNotePages, setCurrentNoteId, });
                            return;
                        }
                        
                        resetCurrentPage();
                    }}
                >
                    { isReset ? "초기화 취소" : "현재 페이지 초기화" }
                </button>
            </div>

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
            <div className="noteButtonGroup">
                <button onClick={()=>{
                    if(isPending){ withRollback({ action: goPrev, context: { setNotePages, setCurrentNoteId, }, })
                        }else{ goPrev();}
                }}
                    disabled ={isSort}
                    >
                    이전
                </button>

                <button
                    onClick={()=>{
                        if(isPending){ withRollback({ action: goNext, context: { setNotePages, setCurrentNoteId, }, })
                        }else{ goNext();}
                    }}
                    disabled ={isSort}
                    style={{
                    marginLeft: 10,
                    }}
                >
                    다음
                </button>
            </div>
            </div>
        </>
    );
}

export default NoteControls;