import { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

import ProfessorPageInfo from "./ProfessorPageInfo";

pdfjs.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


function ProfessorViewer(props) {
    const {currentLectureIndex, lectureCount, notePages, setCurrentNoteId,
        currentNoteId, professorOrder, mode,
        isDark, colorPalette,
        pdfFile, setLectureCount,
    } =props;
    const {screenBoder} = colorPalette(!isDark);
    const pdfBackground = screenBoder;
    const moveProfessorPage = (lecturePage) => {
        const firstNote =
            notePages?.[lecturePage]?.[0];

        if (!firstNote) return;

        setCurrentNoteId(firstNote.id);
    };

    const {
        // isDelete, isDeleteP, isReset, isSort,
        isPending,
    } = mode|| {};
    
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

    const currentProfessorIndex =
        professorOrder.indexOf(
            currentProfessorPage
            );
    
    // const goPrevLecture = () => {
    //     if (currentLectureIndex <= 1) return;

    //     moveProfessorPage(
    //         `p${currentLectureIndex - 1}`
    //     );
    // };

    // const goNextLecture = () => {
    //     if (currentLectureIndex >= lectureCount) return;

    //     moveProfessorPage(
    //         `p${currentLectureIndex + 1}`
    //     );
    // };
    // const [pageNumber,
    //     setPageNumber] =
    //     useState(1);
    const [numPages,
        setNumPages] =
        useState(null);
    const pageNumber =
        Math.min(
            currentLectureIndex,
            numPages ?? 1
        );
        


    const pdfScreenRef =
        useRef(null);

    const [pdfWidth,
        setPdfWidth] =
        useState(0);
        
    useEffect(() => {
        if (!pdfScreenRef.current)
            return;

        const observer =
            new ResizeObserver(
                ([entry]) => {
                    setPdfWidth(
                        entry.contentRect
                            .width
                    );
                }
            );

        observer.observe(
            pdfScreenRef.current
        );

        return () =>
            observer.disconnect();
    }, []);
            
    const goPrevLecture =
        () => {

            if (
                currentProfessorIndex <= 0
            )
                return;

            moveProfessorPage(
                professorOrder[
                    currentProfessorIndex - 1
                ]
            );
        };

    const goNextLecture =
        () => {

            if (
                currentProfessorIndex >=
                professorOrder.length - 1
            )
                return;

            moveProfessorPage(
                professorOrder[
                    currentProfessorIndex + 1
                ]
            );
        };
console.log(pdfFile);
    const {PDFScreenColor
    } = colorPalette(!isDark);

    const screenColor = PDFScreenColor;
    return (
        <>


            <div id="ProfessorViewer" style={{"--professor-bd" : pdfBackground}} >
                <div id="ProfessorEditNavi">
                    <ProfessorPageInfo currentLectureIndex={ props.currentLectureIndex } lectureCount={ props.lectureCount } />
                    <div className="spacer"></div>
                    {/* pdf 영역 확대축소 버튼 */}
                    <div className="noteButtonGroup">
                        <button>
                            -
                        </button>
                        <span>
                            100%
                        </span>
                        <button>
                            +
                        </button>
                    </div>
                    <div className="professorButtonGroup">
                        <button style={{background:"transparent", width:"18px"}}>
                            <div className="ContentLogo" >
                                {Array.from({ length: 6 }).map((_, i) => ( <div key={i}></div> ))}
                            </div>
                        </button>
                        <button style={{background:"transparent", width:"18px"}}>
                            <div className="fullScreenLogo">
                                {Array.from({ length: 9 }).map((_, i) => ( <div key={i}></div> ))}
                            </div>
                        </button>
                        <button style={{background:"transparent", width:"18px"}}>
                            <div className="additionalInfo">
                                {Array.from({ length: 3 }).map((_, i) => ( <div key={i}></div> ))}
                            </div>
                        </button>
                    </div>
                </div>
                <div
                    id="PDFScreen"
                    ref={pdfScreenRef}
                    style={{
                        "--screen-bg":
                            screenColor
                    }}
                >
                    {!pdfFile ? (
                        <div>
                            PDF를 선택하세요
                        </div>
                    ) : (
<Document
    file={pdfFile}
    onLoadSuccess={({ numPages }) => {
        console.log(
            "PDF loaded:",
            numPages
        );

        setNumPages(numPages);

        if (
            lectureCount !==
            numPages
        ) {
            setLectureCount(
                numPages
            );
        }
    }}
    onLoadError={(error) => {
        console.error(
            "PDF load error:",
            error
        );
    }}
>
                            <Page
                                pageNumber={pageNumber}
                                width={pdfWidth
                                }
                            />
                        </Document>
                    )}
                </div>
            </div>
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
        </>
    );
}

export default ProfessorViewer;


