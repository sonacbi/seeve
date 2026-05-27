import ProfessorNavigator from "./ProfessorNavigator";
import ProfessorPageInfo from "./ProfessorPageInfo";
import ProfessorViewer from "./ProfessorViewer";

function ProfessorPanel(props) {
    return (
        <>
            <h2>교수 자료</h2>

            <ProfessorNavigator {...props} />

            <ProfessorPageInfo
                currentLectureIndex={
                    props.currentLectureIndex
                }
                lectureCount={
                    props.lectureCount
                }
            />
            <h1>
                {/* {currentNote.lecturePage} */}
            </h1>
            <ProfessorViewer />
        </>
    );
}

export default ProfessorPanel;