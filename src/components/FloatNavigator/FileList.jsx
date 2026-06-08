
function FileList({
    setIsOpen,
    isOpen,
    onAnimationEnd,
    pdfFile,
    fileInputRef,
    projectInputRef,
    saveProject,
}) {

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
            <button
                onClick={() =>
                    saveProject()
                }
            >
                프로젝트 저장
            </button>

            <button
                onClick={() =>
                    projectInputRef.current?.click()
                }
            >
                프로젝트 열기
            </button>
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