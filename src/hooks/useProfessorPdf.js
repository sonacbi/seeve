import { useState, useRef } from "react";

export default function useProfessorPdf() {

    const pdfScreenRef = useRef(null);
    const fullscreenRef = useRef(null);

    const [numPages, setNumPages] =
        useState(null);

    const [pageSize, setPageSize] =
        useState({ width: 1, height: 1 });

    const [containerSize, setContainerSize] =
        useState({
            width: 1,
            height: 1
        });

    const [zoom, setZoom] = useState(1);

    const [fitMode, setFitMode] = useState("width");

    const [isFullscreen, setIsFullscreen] = useState(false);

    const [windowView, setWindowView] = useState("center"); // 세로형 pdf는 flex-start

    return {
        pdfScreenRef,
        fullscreenRef,

        numPages,
        setNumPages,

        pageSize,
        setPageSize,

        containerSize,
        setContainerSize,

        zoom,
        setZoom,

        fitMode,
        setFitMode,

        isFullscreen,
        setIsFullscreen,

        windowView,
        setWindowView,
    };
}