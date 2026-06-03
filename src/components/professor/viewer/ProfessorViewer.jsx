import { useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";


import ProfessorToolbar from "./ProfessorToolbar";
import useProfessorPdf from "../../../hooks/useProfessorPdf";
import ViewerNavigator from "./ViewerNavigator";
import FullscreenPdfViewer from "./FullscreenPdfViewer";

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

    const {pdfScreenRef, fullscreenRef,
            numPages, setNumPages,
            pageSize, setPageSize,
            containerSize, setContainerSize,
            zoom, setZoom,
            fitMode, setFitMode,
            isFullscreen, setIsFullscreen,
            windowView, setWindowView,} = useProfessorPdf();

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
    
    
    const pageNumber =
        Math.min(
            currentLectureIndex,
            numPages ?? 1
        );
    
    
    const isPortrait = pageSize.height > pageSize.width;

    // const ZOOM_STEP = 0.1;
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 5;

    const widthScale = containerSize.width / pageSize.width;

    const heightScale =
        containerSize.height /
        pageSize.height;

    const baseScale =
        fitMode === "width"
            ? widthScale
            : heightScale;

    const renderScale =
            baseScale * zoom;

    useEffect(() => {
        const container =
            isFullscreen
                ? fullscreenRef.current
                : pdfScreenRef.current;

        if (!container) return;

        const handleWheel = (e) => {
            // 브라우저 확대/부모 스크롤 차단
            e.preventDefault();
            e.stopPropagation();

            // ctrl + wheel => zoom
            if (e.ctrlKey) {
                const currentPercent =
                    (renderScale / widthScale) * 100;

                const snappedPercent =
                    Math.round(currentPercent / 10) * 10;

                const nextPercent =
                    e.deltaY < 0
                        ? snappedPercent + 10
                        : snappedPercent - 10;

                const nextZoom =
                    (nextPercent / 100) *
                    (widthScale / baseScale);

                setZoom(
                    Math.min(
                        MAX_ZOOM,
                        Math.max(
                            MIN_ZOOM,
                            nextZoom
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
    }, [renderScale, widthScale, baseScale, isFullscreen, fullscreenRef, pdfScreenRef, setZoom ] );

    useEffect(() => {
        const resizePdf = () => {
            const container =
            isFullscreen
                ? fullscreenRef.current
                : pdfScreenRef.current;

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

        const container =
            isFullscreen
                ? fullscreenRef.current
                : pdfScreenRef.current;

        if (container) {
            observer.observe(container);
        }

        return () =>
            observer.disconnect();
    }, [isFullscreen, fullscreenRef, pdfScreenRef, setContainerSize]);

    const renderPDF = (targetRef) => {
        return(
            <div
                id="PDFScreen"
                ref={targetRef}
                style={{
                    "--screen-bg": screenColor,
                    "--window-view": windowView,
                }}

                onClick={(e) => {
                    const container =
                        targetRef.current;

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
                            targetRef.current?.querySelector(
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
        )
    }
    const getCurrentPercent = () => {
        const currentScale = renderScale;

        return Math.round( (currentScale / widthScale) * 100 );
    };
    const zoomIn = () => {
        const currentPercent =
            getCurrentPercent();

        const nextPercent =
            currentPercent % 10 === 0
                ? currentPercent + 10
                : Math.ceil(
                    currentPercent / 10
                ) * 10;

        const nextZoom =
            (Math.min(
                nextPercent,
                MAX_ZOOM * 100
            ) / 100) *
            (widthScale / baseScale);

        setZoom(nextZoom);
    };

    const zoomOut = () => {
        const currentPercent =
            getCurrentPercent();

        const nextPercent =
            currentPercent % 10 === 0
                ? currentPercent - 10
                : Math.floor(
                    currentPercent / 10
                ) * 10;

        const nextZoom =
            (Math.max(
                nextPercent,
                MIN_ZOOM * 100
            ) / 100) *
            (widthScale / baseScale);

        setZoom(nextZoom);
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
                <ProfessorToolbar
                    showPageInfo = {true}
                    showFullscreenButton = {true}
                    zoomIn = {zoomIn}
                    zoomOut = {zoomOut}
                    renderScale = {renderScale}
                    widthScale = {widthScale}
                    setFitMode = {setFitMode}
                    setZoom = {setZoom}
                    setIsFullscreen = {setIsFullscreen}
                    currentLectureIndex = {currentLectureIndex}
                    lectureCount = {lectureCount}
                />                
                {!isFullscreen && (
                    <div className="pdfWindow">
                        {renderPDF(pdfScreenRef)}
                    </div>
                )}

            </div>
            < ViewerNavigator
                currentProfessorIndex = {currentProfessorIndex}
                professorOrder = {professorOrder}
                currentProfessorPage = {currentProfessorPage}
                lectureCount = {lectureCount}
                goPrevLecture = {goPrevLecture}
                goNextLecture = {goNextLecture}
                isPending = {isPending}
            />
        

            <FullscreenPdfViewer 
                isFullscreen = {isFullscreen}
                setIsFullscreen = {setIsFullscreen}
                renderScale = {renderScale}
                widthScale = {widthScale}
                zoomOut = {zoomOut}
                zoomIn = {zoomIn}
                setFitMode = {setFitMode}
                setZoom = {setZoom}
                fullscreenRef = {fullscreenRef}
                renderPDF = {renderPDF}
            />
        </>
    );
}

export default ProfessorViewer;


