import NoteControls from "./NoteControls";
// import NoteEditor from "./NoteEditor";
import NoteNavigator from "./NoteNavigator";

function NotePanel(props) {   

    return (
        <>
            <h2>학습 노트</h2>

            <NoteNavigator {...props} />
            <NoteControls {...props} />

        </>
    );
}

export default NotePanel;