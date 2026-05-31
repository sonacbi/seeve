function useProfessor({
    currentLectureNotes,
    flattenedNotes,
    setCurrentNoteId,
    currentNoteId,
    currentNoteIndex,
    currentNote,
    currentLectureIndex,
    lectureCount,
    professorOrder,
    setProfessorOrder,
    
    setNotePages,
    notePages,

    MAX_NOTE_PAGE,

    createRollback,
}) { 
  //ProfessorNavigator
  
    // 교수 네비 슬롯
    // const professorSlots = [];

    // for (
    //     let lectureIndex = 1;
    //     lectureIndex <= lectureCount;
    //     lectureIndex++
    // ) {
    //     const lectureKey = `p${lectureIndex}`;
    //     const notes = notePages[lectureKey] || [];

    //     professorSlots.push({
    //         lecturePage: lectureKey,
    //         noteCount: notes.length,
    //         hasMemo: notes.some(
    //             (n) => n.content.trim() !== ""
    //         ),
    //     });
    // }

    const professorSlots =
    professorOrder.map(
        (lecturePage) => {

            const notes =
                notePages[
                    lecturePage
                ] || [];

            return {
                lecturePage,
                noteCount:
                    notes.length,
                hasMemo:
                    notes.some(
                        (n) =>
                            n.content.trim() !== ""
                    ),
            };
        }
    );

    // p1(3) -> p1 
    const getBasePage = (
        lecturePage
    ) => lecturePage.replace( /\(\d+\)$/, "" );
    // p1(3) -> true
    const isClonePage = (
        lecturePage
    ) => /\(\d+\)$/.test( lecturePage );

    // family 최대 번호 찾기
    const getNextCloneNumber = (
        basePage
    ) => { 
        const escapedBasePage = basePage.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(
            `^${escapedBasePage}\\((\\d+)\\)$`
        );
                
        let max = 0; professorOrder.forEach(
            (page) => { 
                const match = page.match( regex );
                
                if (match)
                    { max = Math.max( max, Number( match[1] ) ); } 
            } 
        ); 
        
        return max + 1;
    };

    // 교수 슬롯 이동
    const moveProfessorPage = (
        lecturePage
    ) => {
        // const firstNote =
        //     notePages[lecturePage][0];
            const firstNote =
                notePages?.[lecturePage]?.[0];

            if (!firstNote) return;

            setCurrentNoteId( firstNote.id );
    };
    // 검색 이동
    const moveProfessorByNumber = (
        value
    ) => {
            let pageNum = Number(value);
            if ( Number.isNaN( pageNum ) ) return;
            pageNum = Math.max( 1, Math.min( pageNum, lectureCount ) );
            moveProfessorPage( `p${pageNum}` );
    };

    const swapProfessorPage = (
        fromIndex,
        toIndex
    ) => {
        // createRollback({
        //     type:
        //         "swap-professor",
        //     snapshot: {
        //         notePages,
        //         currentNoteId,
        //         professorOrder,
        //     },
        // });

        if (
            fromIndex == null ||
            fromIndex === toIndex
        ) {
            return;
        }

        setProfessorOrder(
            (prev) => {
                const updated =
                    [...prev];

                [
                    updated[fromIndex],
                    updated[toIndex],
                ] = [
                    updated[toIndex],
                    updated[fromIndex],
                ];

                return updated;
            }
        );
    };
        
    const sortProfessorPage =
        () => {

            createRollback({
                type:
                    "sort-professor",
                snapshot: {
                    notePages,
                    currentNoteId,
                    professorOrder,
                },
            });

            const getSortValue =
                (page) => {

                    // p5(2) -> p5
                    const basePage =
                        getBasePage(
                            page
                        );

                    // p5 -> 5
                    const baseNum =
                        parseInt(
                            basePage.replace(
                                "p",
                                ""
                            )
                        );

                    // (2)
                    const cloneMatch =
                        page.match(
                            /\((\d+)\)$/
                        );

                    // 원본이면 0
                    const cloneNum =
                        cloneMatch
                            ? Number(
                                cloneMatch[1]
                            )
                            : 0;

                    return {
                        baseNum,
                        cloneNum,
                    };
                };

            setProfessorOrder(
                (prev) =>
                    [...prev].sort(
                        (a, b) => {

                            const aSort =
                                getSortValue(
                                    a
                                );

                            const bSort =
                                getSortValue(
                                    b
                                );

                            // p1 vs p2
                            if (
                                aSort.baseNum !==
                                bSort.baseNum
                            ) {
                                return (
                                    aSort.baseNum -
                                    bSort.baseNum
                                );
                            }

                            // p5(1) vs p5(2)
                            return (
                                aSort.cloneNum -
                                bSort.cloneNum
                            );
                        }
                    )
            );
        };

// 페이지 복제
const duplicateProfessorPage = () => {
    const currentPage = `p${currentLectureIndex}`;
    const actualPage =
        professorOrder.find(
            (page) =>
                page === currentPage ||
                notePages[page]?.some(
                    (note) => note.id === currentNoteId
                )
        ) || currentPage;
            const basePage = getBasePage( actualPage );
            const nextNum = getNextCloneNumber( basePage );
            const newPage = `${basePage}(${nextNum})`; 
            // createRollback({ type: "duplicate-professor",
            //     snapshot: { notePages, currentNoteId, professorOrder, }, });
            
                const sourceNotes = notePages[ actualPage ] ?? []; 
                const copiedNotes = sourceNotes.map( ( note, index ) => 
                    ({ ...note, id: `${newPage}-${index + 1}`, }) ); 
                
                setNotePages( (prev          
                ) => ({ ...prev, [newPage]: copiedNotes, 
                    }) 
                ); 
                
                setProfessorOrder( (prev        
                ) => { const idx = prev.indexOf( actualPage );
                    const next = [...prev];
                    next.splice( idx + 1, 0, newPage );
                    return next; } 
                ); 
            moveProfessorPage( newPage ); 
        }; 

    // 복제 페이지 삭제
    const deleteProfessorPage =
        () => {

            const currentPage =
                professorOrder.find(
                    (page) =>
                        notePages[
                            page
                        ]?.some(
                            (note) =>
                                note.id ===
                                currentNoteId
                        )
                );

            if (!currentPage)
                return;

            if (
                !isClonePage(
                    currentPage
                )
            )
                return;

            createRollback({
                type:
                    "delete-professor",
                snapshot: {
                    notePages,
                    currentNoteId,
                    professorOrder,
                },
            });

            const basePage =
                getBasePage(
                    currentPage
                );

            const currentIndex =
                professorOrder.indexOf(
                    currentPage
                );

            const nextProfessorOrder =
                professorOrder.filter(
                    (page) =>
                        page !==
                        currentPage
                );

            setNotePages(
                (prev) => {

                    const next = {
                        ...prev,
                    };

                    delete next[
                        currentPage
                    ];

                    return next;
                }
            );

            setProfessorOrder(
                nextProfessorOrder
            );

            if (
                notePages[
                    basePage
                ]?.[0]
            ) {

                setCurrentNoteId(
                    notePages[
                        basePage
                    ][0].id
                );

            } else {

                const fallback =
                    nextProfessorOrder[
                        Math.max(
                            0,
                            currentIndex - 1
                        )
                    ];

                if (fallback) {
                    moveProfessorPage(
                        fallback
                    );
                }
            }
        };



    return {
        professorSlots,
        moveProfessorPage,
        swapProfessorPage,
        sortProfessorPage,
        moveProfessorByNumber,
        duplicateProfessorPage,
        deleteProfessorPage,
        isClonePage,
    };

}

export default useProfessor;