function ProfessorPageInfo({
    currentLectureIndex,
    lectureCount,
}) {
    return (
        <>
            <div id="ProfessorPageInfo"
                
            >
                p {currentLectureIndex} /{" "}
                {lectureCount}
            </div>
        </>
    );
}

export default ProfessorPageInfo;