import NoteControls from "./NoteControls";
// import NoteEditor from "./NoteEditor";
import NoteNavigator from "./NoteNavigator";

import { ReactComponent as Flute } from "../../icon/flute.svg";

function NotePanel(props) {   
    const {
        isDark, colorPalette,
        totalNoteCount,
    } = props;
    const {textColor, iconColor} = colorPalette(!isDark);

    const openNotepad = () => {
        // window.location.href =
        // "shell:AppsFolder\\Microsoft.WindowsNotepad_8wekyb3d8bbwe!App";
        console.log("메모장 켜보기");
    };

    const openPaint = () => {
        // window.location.href =
        // "shell:AppsFolder\\Microsoft.MSPaint_8wekyb3d8bbwe!App";
        console.log("그림판 켜보기");
    };

    return (
        <>
            <h2 className="areaHeader" style={{"display" : "flex", "--header-color" : textColor,}}>
                <Flute style={{ "--icon-color" : iconColor, width : "25px"}} className="icon"/>
            <span className="headerText">
                <span className="pre">epi</span>
                <span className="logue">logue</span>
            </span>
            <span className="pageCount">{totalNoteCount}개 노트</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
                <button onClick={openNotepad}>
                    메모장
                </button>

                <button onClick={openPaint}>
                    그림판
                </button>
            </div>
            </h2>

            <NoteNavigator {...props}  />
            <NoteControls {...props} />

        </>
    );
}

export default NotePanel;