function NavigationSlot({
    children,
    onClick,
    style,
    active = false,
    disabled = false,
    width = 60,
    height = 60,
    background = "white",
}) {
    // slot 활성화, 비활성화 여부
        const className = `
        slot
        ${active ? "active" : ""}
        ${disabled ? "disabled" : ""}
    `;

    return (
        <div
            onClick={
                disabled ? undefined : onClick
            }
            className={className}
            style={style}
        >
            {children}
        </div>
    );
}

export default NavigationSlot;