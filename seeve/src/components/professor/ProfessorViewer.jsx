import ProfessorPageInfo from "./ProfessorPageInfo";

function ProfessorViewer(props) {
    return (
        <>


            <div id="ProfessorViewer" >
                <ProfessorPageInfo
                currentLectureIndex={ props.currentLectureIndex }
                lectureCount={ props.lectureCount }
                />
                PDF 영역
            </div>
        </>
    );
}

export default ProfessorViewer;


