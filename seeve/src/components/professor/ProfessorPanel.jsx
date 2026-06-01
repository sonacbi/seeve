import { useState } from "react";
import ProfessorNavigator from "./ProfessorNavigator";
import ProfessorViewer from "./ProfessorViewer";

import { ReactComponent as FireCandle } from "../../icon/fire_candle.svg";

function ProfessorPanel(props) {
    const {
        lectureCount,
        isDark, colorPalette} = props;
    const {textColor, iconColor} = colorPalette(!isDark);
    const [pdfThumbnails, setPdfThumbnails] = useState({});

    return (
        <>
            <h2 className="areaHeader" style={{"display" : "flex", "--header-color" : textColor}}>
                <FireCandle style={{ "--icon-color" : iconColor , width : "25px" }} className="icon" />
            <span className="headerText">
                <span className="pre">pro</span>
                <span className="logue">logue</span>
            </span>
            <span className="pageCount">📑 총 {lectureCount} 페이지</span>
            </h2>

            <ProfessorNavigator {...props}
            pdfThumbnails={pdfThumbnails}
                />

            <h1>
                {/* {currentNote.lecturePage} */}
            </h1>
            <ProfessorViewer {...props}
            setPdfThumbnails={setPdfThumbnails}
            />
        </>
    );
}

export default ProfessorPanel;