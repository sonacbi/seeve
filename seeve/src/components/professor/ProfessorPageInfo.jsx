function ProfessorPageInfo({
    currentLectureIndex,
    lectureCount,
}) {
    return (
        <>
            <div id="ProfessorPageInfo"
                
            >
                현재 {currentLectureIndex} /{" "}
                {lectureCount}
            </div>
        </>
    );
}

export default ProfessorPageInfo;