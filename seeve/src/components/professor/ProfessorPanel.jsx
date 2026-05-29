import ProfessorNavigator from "./ProfessorNavigator";
import ProfessorPageInfo from "./ProfessorPageInfo";
import ProfessorViewer from "./ProfessorViewer";

import { ReactComponent as FireCandle } from "../../icon/fire_candle.svg";

function ProfessorPanel(props) {
    const {isDark} = props;
    const iconColor = isDark? "white" : "black";
    return (
        <>
            <h2 style={{"display" : "flex",}}>
                <FireCandle style={{ "--icon-color" : iconColor , width : "25px" }} className="icon" />
            Prologue</h2>

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