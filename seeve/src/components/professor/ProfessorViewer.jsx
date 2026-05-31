import ProfessorPageInfo from "./ProfessorPageInfo";

function ProfessorViewer(props) {
    const {currentLectureIndex, lectureCount, notePages, setCurrentNoteId,
        isDark, colorPalette,
    } =props;
    
    const moveProfessorPage = (lecturePage) => {
        const firstNote =
            notePages?.[lecturePage]?.[0];

        if (!firstNote) return;

        setCurrentNoteId(firstNote.id);
    };

    const goPrevLecture = () => {
        if (currentLectureIndex <= 1) return;

        moveProfessorPage(
            `p${currentLectureIndex - 1}`
        );
    };

    const goNextLecture = () => {
        if (currentLectureIndex >= lectureCount) return;

        moveProfessorPage(
            `p${currentLectureIndex + 1}`
        );
    };
    const {PDFScreenColor
    } = colorPalette(!isDark);

    const screenColor = PDFScreenColor;
    return (
        <>


            <div id="ProfessorViewer" >
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
                <div id="PDFScreen" style={{"--screen-bg" : screenColor}}>
                    PDF 영역
                </div>
            </div>
                <div className="professorButtonGroup bottomNarrow">

            <button
                disabled={currentLectureIndex <= 1}
                onClick={goPrevLecture}
            >
                ◀ p{currentLectureIndex - 1}
            </button>

            <span>
                p{currentLectureIndex} / {lectureCount}
            </span>

            <button
                disabled={currentLectureIndex >= lectureCount}
                onClick={goNextLecture}
            >
                p{currentLectureIndex + 1} ▶
            </button>

        </div>
        </>
    );
}

export default ProfessorViewer;


