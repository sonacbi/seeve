import { useEffect, useState } from "react";
import FileList from "./FileList";

function FileSetting({
    isOpen,
    setIsOpen
}) {
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

    return (
        <div id="fileSetting">

            <div id="saveName">
                강의 자료 학습
            </div>

            <button
                id="openFilePop"
                onClick={() =>
                    setIsOpen(!isOpen)
                }
            >
                ∨
            </button>

            {shouldRender && (
                <FileList
                    isOpen={isOpen}
                    onAnimationEnd={
                        closeAnimationEnd
                    }
                />
            )}
        </div>
    );
}

export default FileSetting;