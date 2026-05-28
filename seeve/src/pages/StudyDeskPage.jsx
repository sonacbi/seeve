import { useState } from "react";

import ProfessorPanel from "../components/professor/ProfessorPanel";
import NotePanel from "../components/note/NotePanel"

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

    const [currentNoteIndex, setCurrentNoteIndex] =
        useState(0);

    // flat 구조
    const flattenedNotes = Object.entries(
        notePages
    ).flatMap(([lecturePage, notes]) =>
        notes.map((note) => ({
        lecturePage,
        ...note,
        }))
    );

    const currentNote =
        flattenedNotes[currentNoteIndex] ?? flattenedNotes[0];


    // 현재 교수페이지의 노트
    const currentLectureNotes =
        notePages[currentNote.lecturePage];

    // 현재 데이터 표기
    // const currentLectureIndex = parseInt(
    //   currentNote.lecturePage.replace("p", "")
    // );
    const currentLectureIndex = currentNote
        ? parseInt(currentNote.lecturePage.replace("p", ""))
        : 1;
    return (
        <div
        style={{
            display: "flex",
            height: "100vh",
        }}
        >
        {/* 교수 자료 */}
        <div
            style={{
            flex: 1,
            borderRight:
                "1px solid lightgray",
            padding: 20,
            }}
        >
        <ProfessorPanel
            currentLectureIndex={currentLectureIndex}
            lectureCount={lectureCount}
            currentNote={currentNote}
            notePages={notePages}
            flattenedNotes={flattenedNotes}
            setCurrentNoteIndex={setCurrentNoteIndex}
        />

        </div>

        {/* 학습 노트 */}
        <div
            style={{
            flex: 1,
            padding: 20,
            }}
        >

            <NotePanel
            currentLectureIndex={currentLectureIndex}
            lectureCount={lectureCount}
            currentNote={currentNote}
            setNotePages={setNotePages}
            notePages={notePages}
            flattenedNotes={flattenedNotes}
            setCurrentNoteIndex={setCurrentNoteIndex}
            currentNoteIndex={currentNoteIndex}
            currentLectureNotes={currentLectureNotes}
            MAX_NOTE_PAGE={MAX_NOTE_PAGE}
            />
            
        </div>
        </div>
    );
}

export default StudyDeskPage;