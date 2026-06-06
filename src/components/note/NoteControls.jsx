import { useState } from "react";

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
    isDelete, isDeleteP, isReset, isSort,
    isPending,
} = mode;
const [isEdit, setIsEdit] = useState(false);

    return (
        <>
            <div className="noteButtonGroup">

                <button 
                    className={ isDelete || isReset
                        ? "commitBtn" : "" }
                        disabled ={isSort || isDeleteP}
                        
                    onClick={() => {
                        if(isPending){
                            clearRollback(); return;
                        } else { addPage( currentNote.lecturePage ) }
                    } } >

                    { isDelete || isReset ? "확정" : "메모 +" }
                    
                </button>

                <button
                    disabled={isReset || isSort || isDeleteP }
                    className={ isDelete ? "undoBtn" : "" }

                    onClick={() => {

                        if ( isDelete ) {
                            rollbackAction({ setNotePages, setCurrentNoteId, });
                            return;
                        }

                        deleteCurrentPage();
                    }}
                >
                    { isDelete ? "삭제↺" : "삭제" }
                </button>

                <button
                    disabled={isDelete || isSort || isDeleteP}
                    className={ isReset ? "undoBtn" : "" }

                    onClick={() => {

                        if ( isReset ) {
                            rollbackAction({ setNotePages, setCurrentNoteId, });
                            return;
                        }
                        
                        resetCurrentPage();
                    }}
                >
                    { isReset ? "초기화↺" : "초기화" }
                </button>
            </div>

            <h3
            style={{ marginTop: 20, display: "flex", flexDirection: "row", alignItems:"baseline", justifyContent:"space-between"}}
            >
            {currentNote.id}
                <div className="noteButtonGroup">
                    <button style={{cursor:"none"}}>{isEdit ? "Editor" : "Selector"}</button>
                    <button style={{padding : "0px 10px", width:"max-content"}} onClick={()=>setIsEdit(!isEdit)}>{isEdit ? "선택 모드로" : "편집 모드로"}</button>
                </div>
            </h3>

            <NoteEditor 
                setNotePages={setNotePages}
                notePages={notePages}
                currentNote={currentNote}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
            />

            <div
            style={{
                marginTop: 20,
            }}
            >
            <div className="noteButtonGroup bottomNarrow">
                <button onClick={()=>{
                    if(isPending){ withRollback({ action: goPrev, context: { setNotePages, setCurrentNoteId, }, })
                        }else{ goPrev();}
                }}
                    disabled ={isSort|| isDeleteP}
                    >
                    이전
                </button>

                <button
                    onClick={()=>{
                        if(isPending){ withRollback({ action: goNext, context: { setNotePages, setCurrentNoteId, }, })
                        }else{ goNext();}
                    }}
                    disabled ={isSort|| isDeleteP}
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