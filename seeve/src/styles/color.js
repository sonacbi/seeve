const colorPalette = (
    /*setIsDark,*/ isDark,
) => ({
    // wrap 컬러
    background : !isDark ? "lightgray" : "#1a1a1a", 

    // wrap container 컬러
    c_background : !isDark ? "white" : "#a7a7a7", 

    // text 컬러
    textColor: !isDark ? "#ffffff" : "#000000",

    // icon 컬러
    iconColor: !isDark ? "#ffffff" : "#000000",

})

export default colorPalette;