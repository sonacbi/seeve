import { useRef } from "react";

function FileList({
    setIsOpen,
    isOpen,
    onAnimationEnd,
    setPdfFile,
    pdfFile,
    setLectureCount,
    setNotePages,
    setCurrentNoteId,
    setPdfName,
}) {

    const fileInputRef =
        useRef(null);
    const handlePdfUpload = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        console.log(
            "selected file:",
            file
        );

        if (!file) return;
        // 기존 노트 완전 삭제
        setNotePages({
            p1: [{ id: "p1-1", cells: {}, }],
        });

        setCurrentNoteId("p1-1");
        setPdfFile(file);
        setPdfName(file.name);
        setIsOpen(false);
    };

    return (
        <div
            id="fileList"
            className={
                isOpen
                ? "open"
                : "close"
            }
            onAnimationEnd={
                onAnimationEnd
            }
        >

            <button
                onClick={() =>
                    {fileInputRef.current?.click();}
                }
            >
                PDF 가져오기
            </button>
            <input
                type="file"
                accept=".pdf,application/pdf"
                ref={fileInputRef}
                style={{
                    display: "none"
                }}
                onChange={
                    handlePdfUpload
                }
            />
            <ol>
                <li>파일1</li>
                <li>파일2</li>
                <li>파일3</li>
                <li>파일4</li>
                <li>파일5</li>
            </ol>
        </div>
    );
}

export default FileList;