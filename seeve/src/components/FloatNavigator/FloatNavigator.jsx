import "./FloatNavigator.css";
import { useState } from "react";

import LogoSVG from "./LogoSVG";
import FileSetting from "./FileSetting";

function FloatNavigator({
    isDark,
    setIsDark
}) {
    const [isOpen, setIsOpen] =
        useState(false);

    return (
        <div id="floatNavigator">

            <LogoSVG />

            <FileSetting
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

            <button
                className="navButton"
                onClick={() =>
                    setIsDark(!isDark)
                }
            >
                ☼
            </button>

            <button
                className="navButton"
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