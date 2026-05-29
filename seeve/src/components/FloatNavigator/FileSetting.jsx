import { useEffect, useState } from "react";
import FileList from "./FileList";
import { ReactComponent as Flame } from "../../icon/flame.svg";

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
                <Flame style={{ width : "15px"}} />
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