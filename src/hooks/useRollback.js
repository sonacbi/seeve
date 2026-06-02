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
        setCurrentNoteId,
        setProfessorOrder,
    }) => {

        if (!pendingAction) return;

        setNotePages(
            pendingAction.snapshot.notePages
        );

        setCurrentNoteId(
            pendingAction.snapshot
                .currentNoteId
        );
        // 교수페이지 재정렬
        if (
            setProfessorOrder &&
            pendingAction
                .snapshot
                .professorOrder
        ) {
            setProfessorOrder(
                pendingAction
                    .snapshot
                    .professorOrder
            );
        }

        clearRollback();
    };

    const withRollback = ({
        action,
        context,
    }) => {
        rollback(context);
        clearRollback();

        requestAnimationFrame(action);
        return;
    };

    return {
        pendingAction,
        createRollback,
        clearRollback,
        rollback,
        withRollback,
    };
}

export default useRollback;