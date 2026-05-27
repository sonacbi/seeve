           
function NoteEditor({
    setNotePages,
    currentNote,
}) {

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

    return (
        <>
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
        </>
    );
}

export default NoteEditor;