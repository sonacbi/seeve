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
    
    setPdfThumbnails,
    pdfThumbnails,
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

    const { professorSlots,
            moveProfessorPage,
            moveProfessorByNumber,
            swapProfessorPage,
            sortProfessorPage,
            duplicateProfessorPage,
            deleteProfessorPage,
            isClonePage,
        } = useProfessor({
            lectureCount, 
            notePages,
            setNotePages, 

            setPdfThumbnails,

            flattenedNotes, 
            setCurrentNoteId, 
            currentNoteId, 
            professorOrder, 
            setProfessorOrder, 
            currentLectureIndex, 
            createRollback: 
            rollback?.createRollback, 
        });

    const [pageInput, setPageInput] =
        useState("");

    const {
        isDelete, isDeleteP, isReset, isSort,
        isPending,
    } = mode;


    const currentProfessorPage =
        professorOrder.find(
            (page) =>
                notePages[
                    page
                ]?.some(
                    (note) =>
                        note.id ===
                        currentNoteId
                )
        ) ?? `p${currentLectureIndex}`;



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
                el.querySelectorAll(
                    ".slot"
                )[index];

            if (!target) return;

            target.scrollIntoView({
                behavior:
                    "smooth",
                inline:
                    "center",
                block:
                    "nearest",
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
    // useEffect(() => {
    //     const index =
    //         currentLectureIndex - 1;

    //     scrollToIndex(index);

    // }, [
    //     currentLectureIndex,
    //     scrollToIndex,
    // ]);
    
    useEffect(() => {

        const index =
            professorOrder.indexOf(
                currentProfessorPage
            );

        if (index >= 0) {
            scrollToIndex(
                index
            );
        }

    }, [
        currentProfessorPage,
        professorOrder,
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
                {(isSort || isDeleteP)
                 && (
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
                    disabled = {isDeleteP || isDelete || isReset}
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

                <button
                    disabled={isPending}
                    onClick={
                        duplicateProfessorPage
                    }
                >
                    ⫘
                </button>

                <button
                    className={
                        isDelete
                            ? "undoBtn"
                            : ""
                    }
                    disabled={
                        (
                            !currentProfessorPage ||
                            !isClonePage(
                                currentProfessorPage
                            )
                        ) ||

                        (
                            isPending &&
                            !isDelete
                        )
                    }
                    onClick={() => {

                        if (
                            isDelete
                        ) {

                            rollbackAction({
                                setNotePages,
                                setCurrentNoteId,
                                setProfessorOrder,
                            });

                            return;
                        }

                        deleteProfessorPage();
                    }}
                >
                    {
                        isDelete
                            ? "⨱↺"
                            : "⨱"
                    }
                </button>

                <div className="spacer" style={{flex:1}}></div>

                    <div
                    style={{
                        display: "flex",
                        gap: "6px",
                    }}
                    >
                        <input
                            value={pageInput}
                            disabled={isPending}
                            placeholder={`${lectureCount}`}
                            onChange={(e) => {

                                const onlyNumber =
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    );

                                setPageInput(
                                    onlyNumber
                                );
                            }}
                            onKeyDown={(e) => {

                                if (
                                    e.key ===
                                    "Enter"
                                ) {

                                    moveProfessorByNumber(
                                        pageInput
                                    );
                                }
                            }}
                            style={{
                                width: "60px",
                            }}
                        />

                        <button
                        disabled={isPending}
                            onClick={() =>
                                moveProfessorByNumber(
                                    pageInput
                                )
                            }
                        >
                            →
                        </button>
                    </div>
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
                                // const isActive =
                                // slot?.lecturePage ===
                                // `p${currentLectureIndex}`;
                                const isActive =
                                    slot?.lecturePage ===
                                    currentProfessorPage;

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
                                            "--slot-width": "75px", //clamp(60px, 10vw, 90px) 취소
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
                                            <div
                                                className="PDFPreview"
                                                style={{
                                                    "--slot-color": textColor,
                                                    "--slot-border": slotBorder,
                                                    background: "#ffffff77",
                                                }}
                                            >
                                                {pdfThumbnails?.[
                                                    slot.lecturePage
                                                ] && (
                                                    <img
                                                        src={
                                                            pdfThumbnails[
                                                                slot.lecturePage
                                                            ]
                                                        }
                                                        alt={
                                                            slot.lecturePage
                                                        }
                                                        draggable={false}
                                                    />
                                                )}
                                            </div>
                                            <div className={slotActive} style={{"--slot-color":ActiveColor,}}>
                                                <div style={{"--slot-border":ActiveBorder, "--slot-color":ActiveColor,}}>
                                                    { slot.lecturePage }
                                                </div>

                                                <div className="noteCount" style={{ "--slot-border":ActiveBorder,}} >
                                                    { slot.noteCount }
                                                    
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