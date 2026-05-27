function NavigationSlot({
    children,
    onClick,
    active = false,
    disabled = false,
    width = 60,
    height = 60,
    background = "white",
}) {
    return (
        <div
            onClick={
                disabled ? undefined : onClick
            }
            style={{
                width,
                height,

                border: "1px solid gray",
                borderRadius: 12,

                display: "flex",
                flexDirection: "column",

                justifyContent: "center",
                alignItems: "center",

                cursor: disabled
                    ? "default"
                    : "pointer",

                opacity: disabled ? 0.2 : 1,

                background: active
                    ? "#ddd"
                    : background,
            }}
        >
            {children}
        </div>
    );
}

export default NavigationSlot;