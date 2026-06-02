import "./FloatNavigator.css";
import { useState } from "react";

import LogoSVG from "./LogoSVG";
import FileSetting from "./FileSetting";

function FloatNavigator(props) {
    const {isDark, setIsDark, colorPalette} = props;
    const {textColor} = colorPalette(!isDark);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div id="floatNavigator">

            <LogoSVG {...props}/>

            <FileSetting
                {...props}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

            <button
                className="navButton"
                style={{"--nav-btn" : textColor}}
                onClick={() =>
                    setIsDark(!isDark)
                }
            >
                ☼
            </button>

            <button
                className="navButton"
                style={{"--nav-btn" : textColor}}
                onClick={() =>
                    console.log("setting")
                }
            >
                ⚙
            </button>
        </div>
    );
}

export default FloatNavigator;