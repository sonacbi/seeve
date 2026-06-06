import { useEffect, useState } from "react";
import FileList from "./FileList";
import { ReactComponent as Flame } from "../../icon/flame.svg";

function FileSetting(props) {
    const {isDark, colorPalette} = props;
    const {textColor, iconColor} = colorPalette(!isDark);
    const {isOpen, setIsOpen} = props;
    const { pdfName } = props;


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

            <div id="saveName" style={{"--file-filter" : textColor}}>
                <Flame style={{ width : "15px", "--file-filter" : iconColor}} />
                {!pdfName ? "강의 자료 학습" : pdfName}
                {/* 강의 자료 학습 */}
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
                />
            )}
        </div>
    );
}

export default FileSetting;