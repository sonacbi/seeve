import { useState } from "react";

import ProfessorPanel from "../components/professor/ProfessorPanel";
import NotePanel from "../components/note/NotePanel"
import useRollback from "../hooks/useRollback";
import FloatNavigator from "../components/FloatNavigator/FloatNavigator";

function StudyDeskPage() {
    // 챕터표기용 가안
    const lectureCount = 56;
    const MAX_NOTE_PAGE = 5;
    
    
    // 초기 데이터 생성
    const createInitialPages = () => {
        const pages = {};
        
        for (let i = 1; i <= lectureCount; i++) {
            pages[`p${i}`] = [
                {
                    id: `p${i}-1`,
                    content: "",
                },
        ];
        }

        return pages;
    };

    const [notePages, setNotePages] =
        useState(createInitialPages);

        // const [currentNoteIndex, setCurrentNoteIndex] =
    //     useState(0);
    
    const [currentNoteId, setCurrentNoteId] =
        useState("p1-1");

    // flat 구조 professor 페이지 대로.
    // const flattenedNotes = Object.entries(
    //     notePages
    // ).flatMap(([lecturePage, notes]) =>
        //     notes.map((note) => ({
            //     lecturePage,
            //     ...note,
            //     }))
            // );
    const [professorOrder,
        setProfessorOrder] =
        useState(
            Array.from(
                { length: lectureCount },
                (_, i) => `p${i + 1}`
            )
    );
    // 내비게이션 정렬된대로
    const flattenedNotes =
        professorOrder.flatMap(
            (lecturePage) => {
                    
            const notes =
                notePages[
                    lecturePage
                ] ?? [];

            return notes.map(
                (note) => ({
                    lecturePage,
                    ...note,
                })
            );
        }
    );


    const currentNote =
        // flattenedNotes[currentNoteIndex] ?? flattenedNotes[0];
        flattenedNotes.find(
            (note) => note.id === currentNoteId
        ) ?? flattenedNotes[0];


    // 현재 교수페이지의 노트
    const currentLectureNotes =
        // notePages[currentNote.lecturePage];
        currentNote
            ? notePages[currentNote.lecturePage]
            : [];

    // 현재 데이터 표기
    // const currentLectureIndex = parseInt(
    //   currentNote.lecturePage.replace("p", "")
    // );
    const currentLectureIndex = currentNote
        ? parseInt(currentNote.lecturePage.replace("p", ""))
        : 1;

    const rollback = useRollback();

    const {
    pendingAction,
    } = rollback; // 구조분해

    const mode = {
        isDelete: pendingAction?.type === "delete",
        isReset: pendingAction?.type === "reset",
        isSort: pendingAction?.type === "sort-professor",
    };

    mode.isPending =
        mode.isDelete ||
        mode.isReset ||
        mode.isSort;

    const [isDark, setIsDark] = useState(false); // 테스트용 코드
    const background = !isDark ? "lightgray" : "#1a1a1a";

    return (

        <div id="wrapper"
        style={{ "--wrapper-background" : background }}
        >
            <FloatNavigator
                isDark={isDark}
                setIsDark={setIsDark}
            />

            <div id="flexWrap">
                {/* 교수 자료 */}
                <div
                    style={{
                    position: "relative",
                    width : "50%",
                    flex: 1,
                    borderRight:
                        "1px solid black",
                        padding: 20,
                    }}
                >
                <ProfessorPanel
                    professorOrder={ professorOrder } setProfessorOrder={ setProfessorOrder } // 리오더용
                    currentLectureIndex={currentLectureIndex}
                    lectureCount={lectureCount}
                    setNotePages={setNotePages}
                    currentNote={currentNote}
                    notePages={notePages}
                    flattenedNotes={flattenedNotes}
                    // setCurrentNoteIndex={setCurrentNoteIndex}
                    setCurrentNoteId={setCurrentNoteId}
                    currentNoteId={currentNoteId}
                    mode={mode} // 롤백 제어용
                    rollback={rollback}
                />

                </div>

                {/* 학습 노트 */}
                <div
                    style={{
                    flex: 1,
                    padding: 20,
                    position: "relative",
                    width : "50%",
                    }}
                >

                    <NotePanel
                    currentLectureIndex={currentLectureIndex}
                    lectureCount={lectureCount}
                    currentNote={currentNote}
                    setNotePages={setNotePages}
                    notePages={notePages}
                    flattenedNotes={flattenedNotes}
                    // setCurrentNoteIndex={setCurrentNoteIndex}
                    // currentNoteIndex={currentNoteIndex}
                    setCurrentNoteId={setCurrentNoteId}
                    currentNoteId={currentNoteId}
                    currentLectureNotes={currentLectureNotes}
                    MAX_NOTE_PAGE={MAX_NOTE_PAGE}
                    rollback={rollback} mode={mode}
                    />
                    
                </div>
            </div>
        </div>
    );
}

export default StudyDeskPage;