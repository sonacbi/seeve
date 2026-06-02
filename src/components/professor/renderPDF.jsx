const renderPDF = (
    targetRef
) => (
    <div
        id="PDFScreen"
        ref={targetRef}
        style={{
            "--screen-bg":
                screenColor,
            "--window-view":
                windowView,
        }}
        onClick={(e) => {
            const container =
                targetRef.current;

            if (!container) return;

            const rect =
                container.getBoundingClientRect();

            const x =
                e.clientX - rect.left;

            const y =
                e.clientY - rect.top;

            const moveX =
                isPortrait
                    ? rect.width * 0.15
                    : rect.width * 0.3;

            const moveY =
                isPortrait
                    ? rect.height * 0.3
                    : rect.height * 0.15;

            if (x < rect.width * 0.3) {
                container.scrollLeft -=
                    moveX;
            }
            else if (
                x > rect.width * 0.7
            ) {
                container.scrollLeft +=
                    moveX;
            }

            if (y < rect.height * 0.3) {
                container.scrollTop -=
                    moveY;
            }
            else if (
                y > rect.height * 0.7
            ) {
                container.scrollTop +=
                    moveY;
            }
        }}
        onContextMenu={async (
            e
        ) => {
            e.preventDefault();

            try {
                const canvas =
                    targetRef.current?.querySelector(
                        "canvas"
                    );

                if (!canvas) return;

                canvas.toBlob(
                    async (blob) => {
                        if (!blob) return;

                        await navigator.clipboard.write([
                            new ClipboardItem({
                                [blob.type]:
                                    blob
                            })
                        ]);
                    }
                );
            }
            catch (err) {
                console.error(err);
            }
        }}
    >
        {!pdfFile ? (
            <div>
                PDF를 선택하세요
            </div>
        ) : (
            <Document
                file={pdfFile}
            >
                <Page
                    pageNumber={
                        pageNumber
                    }
                    scale={
                        renderScale
                    }
                    onLoadSuccess={(
                        page
                    ) => {
                        const viewport =
                            page.getViewport({
                                scale: 1
                            });

                        setPageSize({
                            width:
                                viewport.width,
                            height:
                                viewport.height
                        });

                        setWindowView(
                            viewport.height >
                            viewport.width
                                ? "flex-start"
                                : "center"
                        );
                    }}
                />
            </Document>
        )}
    </div>
);