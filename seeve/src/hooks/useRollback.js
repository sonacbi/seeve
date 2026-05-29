import { useState } from "react";

function useRollback() {

    const [pendingAction, setPendingAction] =
        useState(null);

    // rollback 저장
    const createRollback = ({
        type,
        snapshot,
    }) => {
        setPendingAction({
            type,
            snapshot,
        });
    };

    // rollback 취소
    const clearRollback = () => {
        setPendingAction(null);
    };

    // undo 실행
    const rollback = ({
        setNotePages,
        setCurrentNoteIndex,
    }) => {

        if (!pendingAction) return;

        setNotePages(
            pendingAction.snapshot.notePages
        );

        setCurrentNoteIndex(
            pendingAction.snapshot
                .currentNoteIndex
        );

        clearRollback();
    };

    return {
        pendingAction,
        createRollback,
        clearRollback,
        rollback,
    };
}

export default useRollback;