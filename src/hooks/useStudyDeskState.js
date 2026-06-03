import { useState, useEffect } from "react";

function useStudyDeskState() {

    // 불러온 pdf 파일 -> preview와 screen에 호출할 데이터
    const [pdfFile, setPdfFile] = useState(null);
    
    // 챕터(pdf 페이지 수) 표기용. 안전장치로 최소 1페이지 세팅
    const [lectureCount, setLectureCount] = useState(1);
    const MAX_NOTE_PAGE = 5; // 한 챕터당 최대 생성가능 페이지 수
    
    // 챕터(pdf 페이지 수)당 배정된 노트 표기용. 안전장치로 최소 1노트 세팅
    const [currentNoteId, setCurrentNoteId] = useState("p1-1");
    
    // 초기 데이터 생성. 안전장치로 최소 1노트 세팅
    const createInitialPages = ( count ) => {
        const pages = {};

        for ( let i = 1; i <= count; i++ ) {
            pages[`p${i}`] = [{
                id: `p${i}-1`,
                // content: "",
                cells: {},
                },
            ];
        }

        return pages;
    };
    
    // 노트페이지 세팅 (pdfview > document에서 수신한 페이지를 근거로 LectureCount를 setting)
    const [notePages, setNotePages] =
        useState(() => createInitialPages(lectureCount));
    
    // professor 내비게이션의 보이는 순서 세팅. 기본적으로 i의 갯수는 pdf 페이지의 n-1과 같다.
    const [professorOrder, setProfessorOrder] =
        useState( Array.from( { length: lectureCount },
                (_, i) => `p${i + 1}`
            )
        );
        
    // 내비게이션 정렬된대로 도면을 그리며 맵을 만든다.
    const flattenedNotes = professorOrder.flatMap((lecturePage) => {
            const notes = notePages[ lecturePage ] ?? [];

            return notes.map( (note) => ({
                lecturePage,
                ...note,
            }));
        });
    
    
    useEffect(() => {
        console.log(lectureCount);
        setNotePages( (prev) => {

            const next = { ...prev };

            for ( let i = 1; i <= lectureCount; i++ ) { // pdf 페이지수만큼 노트 생성 (기본값)
                const key = `p${i}`;
                if ( !next[key] ) {
                    next[key] = [{
                        id: `${key}-1`,
                        content: "",
                    },];
                }
            }
            
            return next;
        });

        setProfessorOrder(
            Array.from(
                { length: lectureCount },
                (_, i) => `p${i + 1}`
            )
        );

    }, [lectureCount]);

    // const totalNoteCount = /*flattenedNotes.length;*/
    //     flattenedNotes.filter(
    //         note => note.content.trim().length > 0
    //     ).length;
    
    const totalNoteCount = flattenedNotes.filter(
        n => n.cells && Object.keys(n.cells).length > 0
    ).length

    // 현재 노트 id를 갖고 flattend 맵에서 찾는다. 없다면 첫페이지를 반환
    const currentNote = flattenedNotes.find( (note) => note.id === currentNoteId ) ?? flattenedNotes[0];
    // 현재 pdf에 대응되는 현 노트
    const currentLectureNotes = currentNote
            ? notePages[currentNote.lecturePage]
            : [];

    // 현재 키값에 대응하는 데이터값에서 "p"를 제외하고 슬라이싱
    const currentLectureIndex = currentNote
        ? parseInt(currentNote.lecturePage.replace("p", ""))
        : 1;

    return {
        pdfFile, setPdfFile,
        lectureCount, setLectureCount,
        MAX_NOTE_PAGE,
        currentNoteId, setCurrentNoteId,
        createInitialPages,
        notePages, setNotePages,
        professorOrder, setProfessorOrder,
        flattenedNotes,
        totalNoteCount,
        currentNote,
        currentLectureNotes,
        currentLectureIndex,
    }
}

export default useStudyDeskState