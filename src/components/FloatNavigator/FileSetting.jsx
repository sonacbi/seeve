import { useEffect, useState, useRef } from "react";
import FileList from "./FileList";
import { getRelativeTime } from "../../hooks/Persistence/getRelativeTime";
import { ReactComponent as Flame } from "../../icon/flame.svg";

function FileSetting(props) {
    const {isDark, colorPalette} = props;
    
    const {textColor, iconColor} = colorPalette(!isDark);
    const {isOpen, setIsOpen} = props;
    const { pdfName } = props;
    const fileInputRef = useRef(null);
    const projectInputRef = useRef(null);

    const {
        setNotePages,
        notePages,
        
        setCurrentNoteId,
        currentNoteId,
        
        setLectureCount,
        lectureCount,

        setPdfFile,
        pdfFile,

        setPdfName,

        setProfessorOrder,
        professorOrder,

        projectCreatedAt, setProjectCreatedAt,
        projectUpdatedAt, setProjectUpdatedAt,
        // currentTime, setCurrentTime,
        saveProject, loadProject,
    } = props;
    
    const [shouldRender, setShouldRender] =
        useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        }
    }, [isOpen]);

    const closeAnimationEnd = () => {
        if (!isOpen) {
            setShouldRender(false);
        }
    };
const hasAnyContent =
    (notePages) => {

    for (
        const notes
        of Object.values(
            notePages ?? {}
        )
    ) {

        for (
            const note
            of notes
        ) {

            if (
                Object.keys(
                    note.cells ?? {}
                ).length > 0
            ) {
                return true;
            }
        }
    }

    return false;
};
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
        setPdfFile(file);
        setPdfName(file.name);

        // 기존 노트 완전 삭제
        setLectureCount(1);
        setProfessorOrder([ "p1", ]);
        setNotePages({
            p1: [{ id: "p1-1", cells: {}, }],
        });
        setCurrentNoteId("p1-1");
        
        setIsOpen(false);
    };

    return (
        <div id="fileSetting">

            <div id="saveName" style={{"--file-filter" : textColor}}>
                <Flame style={{ width : "15px", "--file-filter" : iconColor}} />
                {!pdfName ? "강의 자료 학습" : pdfName}
                {/* 강의 자료 학습 */}
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
                <input
                    type="file"
                    accept=".zip"
                    ref={projectInputRef}
                    style={{
                        display: "none",
                    }}
                    onChange={async e => {

                        const file =
                            e.target.files?.[0];

                        if (!file) return;

                        try {
                            await loadProject(file);

                            setIsOpen(false);
                        }
                        catch (err) {
                            console.error(err);

                            alert(
                                "프로젝트 파일을 불러올 수 없습니다."
                            );
                        }
                    }}
                />
            </div>
            <div>
                { getRelativeTime( projectUpdatedAt ) }
            </div>
            <button
                id="openFilePop"
                style={{"--file-filter" : textColor}}
                onClick={() =>{
                    setIsOpen(!isOpen);
                }}
            >
                ∨
            </button>

            {shouldRender && (
                <FileList
                    {...props}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    onAnimationEnd={
                        closeAnimationEnd
                    }
                    fileInputRef={fileInputRef}
                    saveProject={saveProject}
                    projectInputRef={ projectInputRef }
                />
            )}
        </div>
    );
}

export default FileSetting;