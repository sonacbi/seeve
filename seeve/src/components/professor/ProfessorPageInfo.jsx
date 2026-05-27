function ProfessorPageInfo({
    currentLectureIndex,
    lectureCount,
}) {
    return (
        <>
            <div
                style={{
                marginBottom: 15,
                color: "#666",
                }}
            >
                현재 {currentLectureIndex} /{" "}
                {lectureCount}
            </div>
        </>
    );
}

export default ProfessorPageInfo;