export default function ViewerNavigator({
    currentProfessorIndex,
    professorOrder,
    currentProfessorPage,
    lectureCount,
    goPrevLecture,
    goNextLecture,
    isPending
}) {

    return (
        <div className="professorButtonGroup bottomNarrow">
            <button
                disabled={
                    (currentProfessorIndex <= 0) || isPending
                }
                onClick={goPrevLecture}
            >
                ◀ {
                    professorOrder[
                        currentProfessorIndex - 1
                    ]
                }
            </button>

            <span>
                {currentProfessorPage}
                {" / "}
                {lectureCount}
            </span>

            <button
                disabled={
                    (currentProfessorIndex >=
                    professorOrder.length - 1)
                    || isPending
                }
                onClick={goNextLecture}
            >
                {
                    professorOrder[
                        currentProfessorIndex + 1
                    ]
                } ▶
            </button>
    </div>
    );
}