import NoteControls from "./NoteControls";
// import NoteEditor from "./NoteEditor";
import NoteNavigator from "./NoteNavigator";

import { ReactComponent as Flute } from "../../icon/flute.svg";

function NotePanel(props) {   
    const {isDark} = props;
    const iconColor = isDark? "white" : "black";

    return (
        <>
            <h2 style={{"display" : "flex",}}>
                <Flute style={{ "--icon-color" : iconColor, width : "25px"}} className="icon"/>
            epilogue</h2>

            <NoteNavigator {...props}  />
            <NoteControls {...props} />

        </>
    );
}

export default NotePanel;