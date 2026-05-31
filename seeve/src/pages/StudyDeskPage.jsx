import { useState, useEffect } from "react";

import ProfessorPanel from "../components/professor/ProfessorPanel";
import NotePanel from "../components/note/NotePanel"
import useRollback from "../hooks/useRollback";
import FloatNavigator from "../components/FloatNavigator/FloatNavigator";

import colorPalette from "../styles/color";

function StudyDeskPage() {
    const [pdfFile, setPdfFile] =
        useState(null);

    // 챕터표기용 가안
    const [lectureCount,
        setLectureCount] =
        useState(1);
    const MAX_NOTE_PAGE = 5;
    
    
    // 초기 데이터 생성
    const createInitialPages = (
        count
    ) => {
        const pages = {};

        for (
            let i = 1;
            i <= count;
            i++
        ) {
            pages[`p${i}`] = [
                {
                    id:
                        `p${i}-1`,
                    content: "",
                },
            ];
        }

        return pages;
    };

    const [notePages,
        setNotePages] =
        useState(
            () =>
                createInitialPages(
                    lectureCount
                )
        );
    useEffect(() => {
        setNotePages(
            (prev) => {

                const next =
                    { ...prev };

                for (
                    let i = 1;
                    i <= lectureCount;
                    i++
                ) {

                    const key =
                        `p${i}`;

                    if (
                        !next[key]
                    ) {
                        next[key] = [
                            {
                                id:
                                    `${key}-1`,
                                content:
                                    "",
                            },
                        ];
                    }
                }

                return next;
            }
        );

        setProfessorOrder(
            Array.from(
                {
                    length:
                        lectureCount
                },
                (_, i) =>
                    `p${i + 1}`
            )
        );

    }, [lectureCount]);
            // const [currentNoteIndex, setCurrentNoteIndex] =
        //     useState(0);

    useEffect(() => {
        console.log(lectureCount);

        setNotePages((prev) => {
            const next = { ...prev };

            for (
                let i = 1;
                i <= lectureCount;
                i++
            ) {
                const key = `p${i}`;

                if (!next[key]) {
                    next[key] = [
                        {
                            id: `${key}-1`,
                            content: "",
                        },
                    ];
                }
            }

            console.log(next);

            return next;
        });

    }, [lectureCount]);
    
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
    const totalNoteCount = /*flattenedNotes.length;*/
        flattenedNotes.filter(
            note => note.content.trim().length > 0
        ).length;

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
// console.log(mode);
// useEffect(() => {
//     console.log(
//         "lectureCount:",
//         lectureCount
//     );
// }, [lectureCount]);
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