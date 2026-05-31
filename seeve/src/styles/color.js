const colorPalette = (
    /*setIsDark,*/ isDark,
) => 
    {
        const slot_NotActive = !isDark ? "white" : "gray";
        const slot_active = !isDark ? "#ffa600" : "#ff8800";
        const whiteNblack = !isDark ? "#ffffff" : "#000000";

        const screen_boder = isDark ? "#ffe66d" : "rgb(161, 159, 157)";

        const note_background = !isDark ? "rgb(127, 165, 235)" : "#d8ecff";
        const note_color = !isDark ? "#d8ecff" : "rgb(127, 165, 235)";
    
        return {
            // wrap 컬러
            background : !isDark ? "lightgray" : "#1a1a1a", 

            // wrap container 컬러
            c_background : !isDark ? "white" : "#a7a7a7", 

            // text 컬러
            textColor: whiteNblack,

            // icon 컬러
            iconColor: whiteNblack,

            // slot 컬러
            slotBorder: `1.5px solid ${slot_NotActive}`,
            slotColor: slot_NotActive,
            // active slot 컬러
            slotBorder_A: `1.5px solid ${slot_active}`,
            slotColor_A: slot_active,

            slotBackground: !isDark ? "#2f2f2f": "#d9d9d9", // 미선택
            slotMemoBackground: !isDark ? "#28435a" : "#d8ecff", // 입력 있음
            slotActiveBackground: !isDark ? "#ffe66d" : "rgb(254, 246, 239)", // 현재 선택됨

            //slot 테두리 그림자 추가
            slotShadow: `0.3px 0 ${slot_NotActive},
                        -0.3px 0 ${slot_NotActive},
                        0 0.3px ${slot_NotActive},
                        0 -0.3px ${slot_NotActive};`,

            slotShadow_A: `0.3px 0 ${slot_active},
                        -0.3px 0 ${slot_active},
                        0 0.3px ${slot_active},
                        0 -0.3px ${slot_active}`,

            // professor pdfScreen 컬러
            screenBoder : `2px solid ${screen_boder}`,
            PDFScreenColor : !isDark ? "rgb(254, 246, 239)": "#d9d9d9", // 미선택

            // note 컬러
            noteGround : note_background,
            noteColor : slot_NotActive,
            noteBorder :`1.5px solid ${slot_NotActive}`,
            noteColor_A: note_color,
            noteBorder_A: `1.5px solid ${note_color}`,

            noteShadow_A: `0.3px 0 ${note_color},
                        -0.3px 0 ${note_color},
                        0 0.3px ${note_color},
                        0 -0.3px ${note_color}`,
        }
};
// rgb(red, green, blue)
export default colorPalette;