import { useEffect, useRef, useCallback, useState } from "react";

import NavigationSlot from "../common/NavigationSlot";
import useProfessor from "../../hooks/useProfessor";

function ProfessorNavigator({
    isDark,
    colorPalette,

    lectureCount,
    
    setNotePages,
    notePages,
    flattenedNotes,
    // setCurrentNoteIndex,
    setCurrentNoteId,
    currentNoteId,
    currentLectureIndex,

    professorOrder,
    setProfessorOrder,

    mode,
    rollback,
}) {
    const {textColor, slotBorder, slotBorder_A, slotColor, slotColor_A,
    /*slotShadow,*/ slotShadow_A,
    slotBackground, slotMemoBackground, slotActiveBackground, 
    } = colorPalette(!isDark);

    const {
        clearRollback,
        rollback:
            rollbackAction,
    } = rollback;

    const {
        professorSlots,
        moveProfessorPage,
        swapProfessorPage,
        sortProfessorPage,
    } = useProfessor({
        lectureCount,
        notePages,
        flattenedNotes,
        setCurrentNoteId,
        currentNoteId,
        // setNotePages,
        professorOrder,
        setProfessorOrder,

        currentLectureIndex,
        createRollback:
            rollback?.createRollback,
    });

    const {
        isDelete, isReset, isSort,
        isPending,
    } = mode;


    const scrollRef = useRef(null);

    const dragIndexRef =
        useRef(null);

    const [dragOverIndex,
        setDragOverIndex] =
        useState(null);

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

    const scrollBy = (dir) => {
        const el = scrollRef.current;
        if (!el) return;

        const targetWidth = el.children[0]?.clientWidth ?? 100;

        el.scrollBy({
            left: dir * (targetWidth + 10),
            behavior: "smooth",
        });
    };


    return (
        <>  
            <div className="professorButtonGroup">
                {/* 리셋 버튼 */}
                {isSort && (
                    <button
                        className="commitBtn"
                        onClick={() => {
                            clearRollback();
                        }}
                    >
                        ≡ ▪
                    </button>
                )}
                <button
                    className={
                        isSort
                            ? "undoBtn"
                            : ""
                    }
                    disabled = {isDelete || isReset}
                    onClick={() => {

                        if (
                            isSort
                        ) {

                            rollbackAction({
                                setNotePages,
                                setCurrentNoteId,
                                setProfessorOrder,
                            });

                            return;
                        }
                        
                        sortProfessorPage();
                    }}
                >
                    {
                        isSort
                        ? "≡↺"
                        : "≡▴"
                    }
                </button>
                {/* 활성화된 페이지번호 복사. 처음 복제시 p1 → p1(1), 연관된 노트도 p1(1)-1로 변경 p1(2), p1(3), p1(4)식으로 복제*/}
                <button>
                    ⫘
                </button>
                {/* 복사된 페이지만 사용가능. 중복체크를한다. 복제된 페이지 삭제 롤백기능 있어야함*/}
                <button>
                    ⨱
                </button>
                {/* 텍스트홀더로 nn까지 입력. 이라 적힌 텍스트필드. 최대값을 넘기면 자동으로 최대값으로 바꿔서 입력 활성화된 페이지를 바꾼다.  */}
            </div>

            {/* 교수 페이지 슬롯 */}
            <div className="professorNavWrapper">
                <button className="navArrow" onClick={() => scrollBy(-1)}>
                        ‹
                </button>
                    <div className="professorSlot"
                    ref={scrollRef}
                    style={{ }} >
                        {professorSlots.map(
                            (slot, index) => {
                                const isActive =
                                slot?.lecturePage ===
                                `p${currentLectureIndex}`;
                                // console.log(slot?.lecturePage, `p${currentLectureIndex}`);
                                const slotActive =
                                `PDFPageInfo ${isActive
                                    ? "active"
                                    : "notActive"
                                }`

                                const background =
                                    isActive
                                        ? slotActiveBackground
                                        : slot?.hasMemo
                                        ? slotMemoBackground
                                        : slotBackground;

                                const ActiveBorder =
                                    isActive
                                        ? slotBorder_A
                                        : slotBorder;
                                const ActiveColor =
                                    isActive
                                        ? slotColor_A
                                        : slotColor;
                                const ActiveShadow =
                                    isActive
                                        ? slotShadow_A
                                        : "none";

                                return (
                                    <NavigationSlot
                                        style={{
                                            "--slot-width": `clamp(60px, 10vw, 90px)`,
                                            "--slot-ratio": "1 / 1.5",
                                            "--slot--bg": background,
                                            "--slot--bd": ActiveBorder,
                                            "--box-shadow" :ActiveShadow,
                                        }}
                                        isActive={isActive}
                                        isPending={isPending}
                                        isPDFActive={true}
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
                                        isDragOver={
                                            dragOverIndex ===
                                            index
                                        }
                                        draggable
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
                                            if (isPending) return;
                                            const from =
                                                dragIndexRef.current;

                                            swapProfessorPage(
                                                from,
                                                index
                                            );

                                            dragIndexRef.current =
                                                null;

                                            setDragOverIndex(
                                                null
                                            );
                                        }}
                                    >
                                        {slot && (
                                            <>
                                            <div className="PDFPreview" style={{"--slot-color":textColor, "--slot-border":slotBorder, background : "#ffffff77"}}>
                                                {/* pdf 미리보기 */}
                                            </div>
                                            <div className={slotActive} style={{"--slot-color":ActiveColor,}}>
                                                <div style={{"--slot-border":ActiveBorder, "--slot-color":ActiveColor,}}>
                                                    { slot.lecturePage }
                                                </div>

                                                <div className="noteCount"s style={{ "--slot-border":ActiveBorder,}} >
                                                    { slot.noteCount }
                                                    page
                                                </div>
                                            </div >
                                            </>
                                        )}
                                    </NavigationSlot>
                                );
                            }
                        )}
                    </div>
                <button className="navArrow"
                    onClick={() => scrollBy(1)}>
                    ›
                </button>
            </div>
        </>
    );
}

export default ProfessorNavigator;