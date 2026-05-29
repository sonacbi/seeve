function NavigationSlot({
    children,
    onClick,
    style,
    active = false,
    disabled = false,
    width = 60,
    height = 60,
    background = "white",
    isPending,

    draggable = false,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,

    isDragOver = false,
}) {
    // slot 활성화, 비활성화 여부
        const className = `
        slot
        ${active ? "active" : ""}
        ${disabled ? "disabled" : ""}
        ${isPending ? "isPending" : ""}
        ${isDragOver ? "dragOver" : ""}
    `;

    return (
        <div
            onClick={
                disabled ? undefined : onClick
            }
            draggable={
                !disabled &&
                draggable
            }
            className={className}
            style={style}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            {children}
        </div>
    );
}

export default NavigationSlot;