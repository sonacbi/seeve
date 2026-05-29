import { useEffect, useRef, useCallback } from "react";

import NavigationSlot from "../common/NavigationSlot";
import useProfessor from "../../hooks/useProfessor";

function ProfessorNavigator({
    lectureCount,
    // setNotePages,
    notePages,
    flattenedNotes,
    // setCurrentNoteIndex,
    setCurrentNoteId,
    currentLectureIndex,

    isDeleteMode, isResetMode,
}) {

const {
    professorSlots,
    moveProfessorPage,
} = useProfessor({
    lectureCount,
    notePages,
    flattenedNotes,
    setCurrentNoteId,
    currentLectureIndex,
});

const isPending = isDeleteMode || isResetMode;

const scrollRef = useRef(null);

/**
 * 특정 index 슬롯을
 * 중앙 기준으로 스크롤 이동
 */
const scrollToIndex =
useCallback((index) => {
    const el =
        scrollRef.current;

    if (!el) return;

    const target =
        el.children[index];

    if (!target) return;

    const maxScroll =
        el.scrollWidth -
        el.clientWidth;

    const offset =
        target.offsetLeft -
        el.clientWidth / 2 +
        target.clientWidth / 2;

    const clamped =
        Math.max(
            0,
            Math.min(
                offset,
                maxScroll
            )
        );

    el.scrollTo({
        left: clamped,
        behavior: "smooth",
    });
}, []);

/**
 * 마우스 휠 입력을
 * 가로 스크롤로 변환
 */
useEffect(() => {
    const el =
        scrollRef.current;

    if (!el) return;

    const handleWheel =
        (e) => {
            e.preventDefault();

            el.scrollLeft +=
                e.deltaY;
        };

    el.addEventListener(
        "wheel",
        handleWheel,
        { passive: false }
    );

    return () => {
        el.removeEventListener(
            "wheel",
            handleWheel
        );
    };
}, []);

/**
 * 스크롤 영역 크기 확인
 * (디버깅용 로그)
 */
// useEffect(() => {
//     const el =
//         scrollRef.current;

//     if (!el) return;

//     console.log(
//         "scrollWidth:",
//         el.scrollWidth
//     );

//     console.log(
//         "clientWidth:",
//         el.clientWidth
//     );
// }, []);

/**
 * 현재 lecture 변경 시
 * 해당 슬롯으로 자동 이동
 */
useEffect(() => {
    const index =
        currentLectureIndex - 1;

    scrollToIndex(index);

}, [
    currentLectureIndex,
    scrollToIndex,
]);
    return (
        <>
            {/* 교수 페이지 슬롯 */}
                <div className="professorSlot"
                ref={scrollRef}
                style={{ overflowX: "auto",  "--pSlot-width" : "100%"}} >
                    {professorSlots.map(
                        (slot, index) => {
                            const isActive =
                            slot?.lecturePage ===
                            `p${currentLectureIndex}`;

                            const background =
                                isActive
                                    ? "#ffe66d"
                                    : slot?.hasMemo
                                    ? "#d8ecff"
                                    : "#d9d9d9";

                            return (
                                <NavigationSlot
                                    style={{
                                        "--slot-width": "90px",
                                        "--slot-height": "90px",
                                        "--slot--bg": background,
                                    }}
                                    isPending={isPending}
                                    key={index}
                                    disabled={!slot}
                                    onClick={() =>
                                        {
                                            if (isPending) return;
                                            if (!slot) return;

                                            moveProfessorPage(slot.lecturePage);
                                            // scrollToIndex(index);
                                        }
                                    }
                                >
                                    {slot && (
                                        <>
                                            <div>
                                                { slot.lecturePage }
                                            </div>

                                            <div style={{ fontSize: 12, }} >
                                                { slot.noteCount }
                                                page
                                            </div>
                                        </>
                                    )}
                                </NavigationSlot>
                            );
                        }
                    )}
                </div>
        </>
    );
}

export default ProfessorNavigator;