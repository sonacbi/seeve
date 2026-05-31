import { useEffect, useState } from "react";

function ProfessorPageInfo({
    currentLectureIndex,
    lectureCount,
}) {

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(false);

        const timer = setTimeout(() => {
            setVisible(true);
        }, 800);

        return () => clearTimeout(timer);
    }, [currentLectureIndex]);

    return (
        <>
            <div id="ProfessorPageInfo"
                
            >
                <span style={{color: "black", opacity: visible ? 1 : 0.5, transition: "opacity 0.8s"}}>p {currentLectureIndex}</span>
                /{" "}
                {lectureCount}
            </div>
        </>
    );
}

export default ProfessorPageInfo;