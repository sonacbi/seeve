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

        setPdfThumbnails,
    } =props;
    const {screenBoder} = colorPalette(!isDark);
    const pdfBackground = screenBoder;
    const moveProfessorPage = (lecturePage) => {
        const firstNote =
            notePages?.[lecturePage]?.[0];

        if (!firstNote) return;

        setCurrentNoteId(firstNote.id);
    };
// console.log(document.querySelectorAll( ".react-pdf__Page" ).length);

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

    const [pageSize, setPageSize] =
    useState({ width: 1, height: 1 });
    const isPortrait = pageSize.height > pageSize.width;
    const [zoom, setZoom] = useState(1);
    const [fitMode, setFitMode] = useState("width");
    
    const [windowView, setWindowView] = useState("center"); // 세로형 pdf는 flex-start
    // width | height
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [scrollPos, setScrollPos] = useState({ x: 0,  });

    const ZOOM_STEP = 0.1;
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 5;
    const [containerSize,
    setContainerSize] =
    useState({
        width: 1,
        height: 1
    });

    useEffect(() => {
        const container =
            pdfScreenRef.current;

        if (!container) return;

        const handleWheel = (e) => {
            // 브라우저 확대/부모 스크롤 차단
            e.preventDefault();
            e.stopPropagation();

            // ctrl + wheel => zoom
            if (e.ctrlKey) {
                const delta =
                    e.deltaY > 0
                        ? -ZOOM_STEP
                        : ZOOM_STEP;

                setZoom((prev) =>
                    Math.min(
                        MAX_ZOOM,
                        Math.max(
                            MIN_ZOOM,
                            prev + delta
                        )
                    )
                );

                return;
            }

            // 일반 wheel => 세로 스크롤
            container.scrollTop +=
                e.deltaY;
        };

        container.addEventListener(
            "wheel",
            handleWheel,
            {
                passive: false
            }
        );

        return () => {
            container.removeEventListener(
                "wheel",
                handleWheel
            );
        };
    }, []);

    useEffect(() => {
        const resizePdf = () => {
            const container =
                pdfScreenRef.current;

            if (!container) return;

            setContainerSize({
                width:
                    container.clientWidth - 24,
                height:
                    container.clientHeight - 24
            });
        };

        resizePdf();

        const observer =
            new ResizeObserver(
                resizePdf
            );

        observer.observe(
            pdfScreenRef.current
        );

        return () =>
            observer.disconnect();
    }, []);
    const widthScale =
        containerSize.width /
        pageSize.width;

    const heightScale =
        containerSize.height /
        pageSize.height;

    const baseScale =
        fitMode === "width"
            ? widthScale
            : heightScale;

    const renderScale =
        baseScale * zoom;
            
    
    const zoomIn = () => {
        setZoom((prev) =>
            Math.min(
                prev + ZOOM_STEP,
                MAX_ZOOM
            )
        );
    };

    const zoomOut = () => {
        setZoom((prev) =>
            Math.max(
                prev - ZOOM_STEP,
                MIN_ZOOM
            )
        );
    };

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
    // console.log(pdfFile);
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
                    <div className="professorButtonGroup">
                        <button onClick={zoomOut}>
                            -
                        </button>

                        <span>
                            {Math.round(zoom * 100)}%
                        </span>

                        <button onClick={zoomIn}>
                            +
                        </button>
                    </div>
                    <div className="professorButtonGroup">
                        <button className="fit2width"
                            onClick={() => setFitMode("width") }
                        >
                            ⇔
                        </button>

                        <button className="fit2height"
                            onClick={() => setFitMode("height") }
                        >
                            ⇕
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

                <div className="pdfWindow">
                    <div
                        id="PDFScreen"
                        ref={pdfScreenRef}
                        style={{
                            "--screen-bg": screenColor,
                            "--window-view": windowView,
                        }}

                        onClick={(e) => {
                            const container =
                                pdfScreenRef.current;

                            if (!container) return;

                            const rect =
                                container.getBoundingClientRect();

                            const x =
                                e.clientX - rect.left;

                            const y =
                                e.clientY - rect.top;

                            const moveX =
                                isPortrait
                                    ? rect.width * 0.15
                                    : rect.width * 0.3;

                            const moveY =
                                isPortrait
                                    ? rect.height * 0.3
                                    : rect.height * 0.15;

                            // 좌우
                            if (x < rect.width * 0.3) {
                                container.scrollLeft -= moveX;
                            }
                            else if (
                                x > rect.width * 0.7
                            ) {
                                container.scrollLeft += moveX;
                            }

                            // 상하
                            if (y < rect.height * 0.3) {
                                container.scrollTop -= moveY;
                            }
                            else if (
                                y > rect.height * 0.7
                            ) {
                                container.scrollTop += moveY;
                            }
                        }}
                        onContextMenu={async (e) => {
                            e.preventDefault();

                            try {
                                const canvas =
                                    pdfScreenRef.current?.querySelector(
                                        "canvas"
                                    );

                                if (!canvas) return;

                                canvas.toBlob(
                                    async (blob) => {
                                        if (!blob) return;

                                        await navigator.clipboard.write([
                                            new ClipboardItem({
                                                [blob.type]:
                                                    blob
                                            })
                                        ]);

                                        console.log(
                                            "PDF 화면 복사 완료"
                                        );
                                    }
                                );
                            }
                            catch (err) {
                                console.error(
                                    "클립보드 복사 실패:",
                                    err
                                );
                            }
                        }}
                    >
                        {!pdfFile ? (
                            <div>
                                PDF를 선택하세요
                            </div>
                        ) : (
                                <Document
                                    file={pdfFile}
                                    onLoadSuccess={async (pdf) => {
                                        const { numPages } = pdf;
                                        console.log("PDF loaded:", numPages);

                                        setNumPages(numPages);

                                        if ( lectureCount !== numPages ) {
                                            setLectureCount( numPages );
                                        }
                                        const thumbs = {};

                                        for (
                                            let pageNum = 1;
                                            pageNum <= pdf.numPages;
                                            pageNum++
                                        ) {
                                            const page =
                                                await pdf.getPage(pageNum);

                                            const viewport =
                                                page.getViewport({
                                                    scale: 0.15,
                                                });

                                            const canvas =
                                                document.createElement("canvas");

                                            const context =
                                                canvas.getContext("2d");

                                            canvas.width =
                                                viewport.width;

                                            canvas.height =
                                                viewport.height;

                                            await page.render({
                                                canvasContext: context,
                                                viewport,
                                            }).promise;

                                            thumbs[`p${pageNum}`] =
                                                canvas.toDataURL(
                                                    "image/jpeg",
                                                    0.7
                                                );
                                        }

                                        setPdfThumbnails(
                                            thumbs
                                        );
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
                                    // width={pdfWidth}
                                    onLoadSuccess={(page) => {
                                        const viewport =
                                            page.getViewport({ scale: 1 });

                                            setPageSize({
                                                width: viewport.width,
                                                height: viewport.height
                                            });
                                            setWindowView(
                                                viewport.height > viewport.width
                                                ? "flex-start"
                                                : "center"
                                            );
                                        }}
                                    scale={renderScale}
                                />
                            </Document>
                        )}
                    </div>
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


