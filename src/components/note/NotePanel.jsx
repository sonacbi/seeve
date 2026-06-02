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

    return (
        <>
            <h2 className="areaHeader" style={{"display" : "flex", "--header-color" : textColor,}}>
                <Flute style={{ "--icon-color" : iconColor, width : "25px"}} className="icon"/>
            <span className="headerText">
                <span className="pre">epi</span>
                <span className="logue">logue</span>
            </span>
            <span className="pageCount">{totalNoteCount}개 노트</span>
            </h2>

            <NoteNavigator {...props}  />
            <NoteControls {...props} />

        </>
    );
}

export default NotePanel;