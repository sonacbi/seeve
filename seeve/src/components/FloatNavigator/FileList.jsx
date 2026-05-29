function FileList({
    isOpen,
    onAnimationEnd
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
                    console.log("pdf import")
                }
            >
                PDF 가져오기
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