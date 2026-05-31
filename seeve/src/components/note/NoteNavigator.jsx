import { useRef, useState } from "react";

import NavigationSlot from "../common/NavigationSlot";
import useStudyDesk from "../../hooks/useStudyDesk";

function NoteNavigator({
    isDark,
    colorPalette,

    flattenedNotes,
    // setCurrentNoteIndex,
    setCurrentNoteId,
    currentNoteId,

    setNotePages,
    notePages,
    currentLectureNotes,
    MAX_NOTE_PAGE,
    currentNote,

    rollback,

    mode,
}) {

const { noteBorder, noteBorder_A, noteColor, noteColor_A,
/*slotShadow,*/ noteShadow_A, noteGround, slotBackground
} = colorPalette(!isDark);

const {
    // isDelete, isReset, isSort,
    isPending,
} = mode;

const dragIndexRef =
    useRef(null);

const [dragOverIndex,
    setDragOverIndex] =
    useState(null);

const {
    moveToNote,
    swapNotePage,
} = useStudyDesk({
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteId,
    currentNoteId,
    setNotePages,
    notePages,
    currentNote,
    createRollback:
        rollback?.createRollback,
});

// const {
//     withRollback,
//     // rollback: rollbackAction,
// } = rollback;

    return (
        <>
            {/* 슬롯 UI */}
            <div className="noteSlot" // 하단 버튼과 간격 미세 조정 noteSlot
            >
                {[...Array(MAX_NOTE_PAGE)].map(
                    (_, index) => {
                    const page =
                        currentLectureNotes[
                        index
                        ];
                        const isActive = page?.id === currentNote?.id
console.log(
    page?.id,
    currentNote?.id,
    page?.id === currentNote?.id
);
                                const background =
                                    isActive
                                        ? noteGround
                                        : slotBackground;

                                const ActiveBorder =
                                    isActive
                                        ? noteBorder_A
                                        : noteBorder;
                                const ActiveColor =
                                    isActive
                                        ? noteColor_A
                                        : noteColor;
                                const ActiveShadow =
                                    isActive
                                        ? noteShadow_A
                                        : "none";
                    return (
                        <NavigationSlot
                            key={index}
                            style={{
                                "--slot-width": "60px",
                                "--slot-height": "60px",
                                "--slot--bg": background,
                                "--slot--bd": ActiveBorder,
                                "--box-shadow" :ActiveShadow,
                                "--slot-color":ActiveColor,
                            }}
                            disabled={!page}
                            isPending={isPending}
                            active={
                                page?.id ===
                                currentNote?.id
                            }
                            draggable
                            isDragOver={
                                dragOverIndex ===
                                index
                            }
                            onDragStart={() => {
                                dragIndexRef.current =
                                    index;
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOverIndex( index );
                            }}
                            onDragLeave={() => {
                                setDragOverIndex( null );
                            }}
                            onDrop={() => {
                                const from =
                                    dragIndexRef.current;

                                const to = index;

                                if (from == null) return;

                                swapNotePage(
                                    currentNote
                                        ?.lecturePage,
                                    from,
                                    to
                                );

                                dragIndexRef.current =
                                    null;

                                setDragOverIndex(
                                    null
                                );
                            }}
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