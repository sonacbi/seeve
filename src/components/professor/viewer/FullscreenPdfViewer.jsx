import ProfessorToolbar from "./ProfessorToolbar";

export default function FullscreenPdfViewer({
    isFullscreen,
    setIsFullscreen,
    renderScale,
    widthScale,
    zoomOut,
    zoomIn,
    setFitMode,
    setZoom,
    fullscreenRef,
    renderPDF,

}) {
    if (!isFullscreen) return null;
    return (
        <div
            className="fullscreenOverlay"
            onClick={() =>
                setIsFullscreen(false)
            }
            onWheel={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div
                className="fullscreenModal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <div className="fullscreenToolbar">
                    <ProfessorToolbar
                        showFullscreenClose = {true}
                        zoomIn = {zoomIn}
                        zoomOut = {zoomOut}
                        renderScale = {renderScale}
                        widthScale = {widthScale}
                        setFitMode = {setFitMode}
                        setZoom = {setZoom}
                        setIsFullscreen = {setIsFullscreen}
                    /> 
                </div>

                <div className="fullscreenPDF">
                    {renderPDF(fullscreenRef)}
                </div>
            </div>
        </div>
    );
}