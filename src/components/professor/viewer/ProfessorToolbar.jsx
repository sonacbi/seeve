import ProfessorPageInfo from "../ProfessorPageInfo";

export default function ProfessorToolbar({
    zoomIn,
    zoomOut,
    renderScale,
    widthScale,
    setFitMode,
    setZoom,
    setIsFullscreen,
    
    showFullscreenButton = false,
    showPageInfo = false,
    showFullscreenClose = false,

    currentLectureIndex,
    lectureCount,
}) {
console.log(lectureCount);
    return (
        <div id="ProfessorEditNavi">
            {(showPageInfo) &&(
                <>
                    <ProfessorPageInfo currentLectureIndex={ currentLectureIndex } lectureCount={ lectureCount } />
                    <div className="spacer"></div>
                </>
            )}
            {/* pdf 영역 확대축소 버튼 */}
            <div className="professorButtonGroup">
                <button onClick={zoomOut}>
                    -
                </button>

                <span>
                    {Math.round((renderScale / widthScale) * 100)}%
                </span>

                <button onClick={zoomIn}>
                    +
                </button>
            </div>
            <div className="professorButtonGroup">
                <button className="fit2width"
                    onClick={() => {setFitMode("width"); setZoom(1);} }
                >
                    ⇔
                </button>

                <button className="fit2height"
                    onClick={() => {setFitMode("height"); setZoom(1);} }
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
                {(showFullscreenButton)&&(
                    <button style={{background:"transparent", width:"18px"}}
                    onClick={() => setIsFullscreen(true) }>
                        <div className="fullScreenLogo">
                            {Array.from({ length: 9 }).map((_, i) => ( <div key={i}></div> ))}
                        </div>
                    </button>
                )}
                <button style={{background:"transparent", width:"18px"}}>
                    <div className="additionalInfo">
                        {Array.from({ length: 3 }).map((_, i) => ( <div key={i}></div> ))}
                    </div>
                </button>
                {(showFullscreenClose)&&(
                    <button
                        className="fullscreenClose"
                        onClick={() => setIsFullscreen(false) }
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}