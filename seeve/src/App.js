import { useState } from "react";

function App() {

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
    flattenedNotes[currentNoteIndex];

  // -----------------------
  // 메모 추가 (최대 5개)
  // -----------------------
  const addPage = (lecturePage) => {
    setNotePages((prev) => {
      const updated = { ...prev };

      const currentCount =
        updated[lecturePage].length;

      if (currentCount >= MAX_NOTE_PAGE) {
        alert("최대 5페이지까지 가능합니다.");
        return prev;
      }

      updated[lecturePage] = [
        ...updated[lecturePage],
        {
          id: `${lecturePage}-${currentCount + 1}`,
          content: "",
        },
      ];

      return updated;
    });
  };

  // -----------------------
  // 삭제
  // -----------------------
  const deleteCurrentPage = () => {
    const lecturePage =
      currentNote.lecturePage;

    const noteList =
      notePages[lecturePage];

    // 최소 1페이지 보장
    if (noteList.length === 1) {
      alert("최소 1페이지는 유지됩니다.");
      return;
    }

    setNotePages((prev) => {
      const updated = { ...prev };

      // 현재 페이지 제거
      let filtered =
        updated[lecturePage].filter(
          (page) =>
            page.id !== currentNote.id
        );

      // sort 재정렬
      filtered = filtered.map(
        (page, index) => ({
          ...page,
          id: `${lecturePage}-${index + 1}`,
        })
      );

      updated[lecturePage] = filtered;

      return updated;
    });

    setCurrentNoteIndex((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  // -----------------------
  // 텍스트 수정
  // -----------------------
  const updateContent = (text) => {
    setNotePages((prev) => {
      const updated = { ...prev };

      updated[currentNote.lecturePage] =
        updated[
          currentNote.lecturePage
        ].map((page) =>
          page.id === currentNote.id
            ? {
                ...page,
                content: text,
              }
            : page
        );

      return updated;
    });
  };

  // -----------------------
  // 이동
  // -----------------------
  const goPrev = () => {
    if (currentNoteIndex > 0) {
      setCurrentNoteIndex((prev) => prev - 1);
    }
  };

  const goNext = () => {
    if (
      currentNoteIndex <
      flattenedNotes.length - 1
    ) {
      setCurrentNoteIndex((prev) => prev + 1);
    }
  };

  // 현재 교수페이지의 노트
  const currentLectureNotes =
    notePages[currentNote.lecturePage];

  // 슬롯 클릭
  const moveToNote = (slotIndex) => {
    const target =
      currentLectureNotes[slotIndex];

    if (!target) return;

    const globalIndex =
      flattenedNotes.findIndex(
        (note) => note.id === target.id
      );

    setCurrentNoteIndex(globalIndex);
  };

  const currentLectureIndex = parseInt(
  currentNote.lecturePage.replace("p", "")
);

// 교수 네비 슬롯
const professorSlots = [];

for (let offset = -2; offset <= 2; offset++) {
  const lectureIndex =
    currentLectureIndex + offset;

  if (
    lectureIndex < 1 ||
    lectureIndex > lectureCount
  ) {
    professorSlots.push(null);
    continue;
  }

  const lectureKey = `p${lectureIndex}`;
  const notes = notePages[lectureKey];

  professorSlots.push({
    lecturePage: lectureKey,
    noteCount: notes.length,
    hasMemo: notes.some(
      (n) => n.content.trim() !== ""
    ),
  });
}

// 교수 슬롯 이동
const moveProfessorPage = (
  lecturePage
) => {
  const firstNote =
    notePages[lecturePage][0];

  const globalIndex =
    flattenedNotes.findIndex(
      (note) =>
        note.id === firstNote.id
    );

  setCurrentNoteIndex(globalIndex);
};

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

      <h2>교수 자료</h2>

      {/* 교수 페이지 슬롯 */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {professorSlots.map(
          (slot, index) => (
            <div
              key={index}
              onClick={() =>
                slot &&
                moveProfessorPage(
                  slot.lecturePage
                )
              }
              style={{
                width: 90,
                height: 90,
                border:
                  "1px solid gray",
                borderRadius: 15,
                display: "flex",
                flexDirection:
                  "column",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                cursor: slot
                  ? "pointer"
                  : "default",

                background:
                  index === 2
                    ? "#ffe66d"
                    : slot?.hasMemo
                    ? "#d8ecff"
                    : "#d9d9d9",

                opacity: slot ? 1 : 0.2,
              }}
            >
              {slot && (
                <>
                  <div>
                    {
                      slot.lecturePage
                    }
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                    }}
                  >
                    {slot.noteCount}
                    page
                  </div>
                </>
              )}
            </div>
          )
        )}
      </div>

      <h1>
        {currentNote.lecturePage}
      </h1>

      <div
        style={{
          marginBottom: 15,
          color: "#666",
        }}
      >
        현재 {currentLectureIndex} /{" "}
        {lectureCount}
      </div>

        <div
          style={{
            border: "1px solid black",
            height: 500,
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
          }}
        >
          PDF 영역
        </div>
      </div>

      {/* 학습 노트 */}
      <div
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        <h2>학습 노트</h2>

        {/* 슬롯 UI */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[...Array(MAX_NOTE_PAGE)].map(
            (_, index) => {
              const page =
                currentLectureNotes[
                  index
                ];

              return (
                <div
                  key={index}
                  onClick={() =>
                    page &&
                    moveToNote(index)
                  }
                  style={{
                    width: 60,
                    height: 60,
                    border:
                      "1px solid gray",
                    borderRadius: 12,
                    display: "flex",
                    justifyContent:
                      "center",
                    alignItems: "center",
                    cursor: page
                      ? "pointer"
                      : "default",
                    opacity: page
                      ? 1
                      : 0.2,
                    background:
                      page?.id ===
                      currentNote.id
                        ? "#ddd"
                        : "white",
                  }}
                >
                  {page
                    ? page.id
                    : ""}
                </div>
              );
            }
          )}
        </div>

        <button
          onClick={() =>
            addPage(
              currentNote.lecturePage
            )
          }
        >
          메모 추가 (+)
        </button>

        <button
          onClick={
            deleteCurrentPage
          }
          style={{
            marginLeft: 10,
          }}
        >
          현재 페이지 삭제
        </button>

        <h3
          style={{
            marginTop: 20,
          }}
        >
          {currentNote.id}
        </h3>

        <textarea
          value={currentNote.content}
          onChange={(e) =>
            updateContent(
              e.target.value
            )
          }
          style={{
            width: "100%",
            height: "60%",
          }}
        />

        <div
          style={{
            marginTop: 20,
          }}
        >
          <button onClick={goPrev}>
            이전
          </button>

          <button
            onClick={goNext}
            style={{
              marginLeft: 10,
            }}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;