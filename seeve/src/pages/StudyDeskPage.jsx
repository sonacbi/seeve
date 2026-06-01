import { useState } from "react";

import useStudyDeskState from "../hooks/useStudyDeskState"
import ProfessorPanel from "../components/professor/ProfessorPanel";
import NotePanel from "../components/note/NotePanel"
import useRollback from "../hooks/useRollback";
import FloatNavigator from "../components/FloatNavigator/FloatNavigator";

import colorPalette from "../styles/color";

function StudyDeskPage() {
    const {
        pdfFile, setPdfFile,
        lectureCount, setLectureCount,
        MAX_NOTE_PAGE,
        currentNoteId, setCurrentNoteId,
        // createInitialPages,
        notePages, setNotePages,
        professorOrder, setProfessorOrder,
        flattenedNotes,
        totalNoteCount,
        currentNote,
        currentLectureNotes,
        currentLectureIndex,
    } = useStudyDeskState();

    const rollback = useRollback();

    const {
    pendingAction,
    } = rollback; // 구조분해

    const mode = {
        isDelete: pendingAction?.type === "delete",
        isDeleteP: pendingAction?.type === "delete-professor",
        // isDuplicate: pendingAction?.type === "duplicate-professor",
        isReset: pendingAction?.type === "reset",
        isSort: pendingAction?.type === "sort-professor",
    };

    mode.isPending =
        mode.isDelete ||
        mode.isDeleteP ||
        // mode.isDuplicate ||
        mode.isReset ||
        mode.isSort;

    const [isDark, setIsDark] = useState(false); // 테스트용 코드
    const { background, c_background } = colorPalette(isDark);

    return (

        <div id="wrapper"
        style={{ "--wrapper-background" : background }}
        >
            <FloatNavigator
                isDark={isDark}
                setIsDark={setIsDark}
                colorPalette={colorPalette}

                pdfFile={pdfFile}
                setPdfFile={setPdfFile}
                setLectureCount={ setLectureCount }
            />

            <div id="flexWrap">
                {/* 교수 자료 */}
                <div className="flexContainer p"
                    style={{
                        "--wrap-children" : c_background,
                    }}
                >
                <ProfessorPanel
                    professorOrder={ professorOrder } setProfessorOrder={ setProfessorOrder } // 리오더용
                    currentLectureIndex={currentLectureIndex}
                    lectureCount={lectureCount}
                    setLectureCount={ setLectureCount }
                    setNotePages={setNotePages}
                    currentNote={currentNote}
                    notePages={notePages}
                    flattenedNotes={flattenedNotes}
                    // setCurrentNoteIndex={setCurrentNoteIndex}
                    setCurrentNoteId={setCurrentNoteId}
                    currentNoteId={currentNoteId}
                    mode={mode} // 롤백 제어용
                    rollback={rollback}
                    isDark={isDark} setIsDark={setIsDark} colorPalette={colorPalette}

                    pdfFile={pdfFile}
                />

                </div>

                {/* 학습 노트 */}
                <div className="flexContainer n"
                    style={{
                        "--wrap-children" : c_background,
                    }}
                >

                <NotePanel
                    currentLectureIndex={currentLectureIndex}
                    lectureCount={lectureCount}
                    currentNote={currentNote}
                    setNotePages={setNotePages}
                    notePages={notePages}
                    flattenedNotes={flattenedNotes}
                    totalNoteCount={totalNoteCount}
                    // setCurrentNoteIndex={setCurrentNoteIndex}
                    // currentNoteIndex={currentNoteIndex}
                    setCurrentNoteId={setCurrentNoteId}
                    currentNoteId={currentNoteId}
                    currentLectureNotes={currentLectureNotes}
                    MAX_NOTE_PAGE={MAX_NOTE_PAGE}
                    rollback={rollback} mode={mode}
                    isDark={isDark} setIsDark={setIsDark} colorPalette={colorPalette}
                    />
                    
                </div>
            </div>
        </div>
    );
}

export default StudyDeskPage;