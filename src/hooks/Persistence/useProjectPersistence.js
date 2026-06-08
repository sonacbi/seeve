import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function useProjectPersistence({
    pdfName,
    pdfFile,

    notePages,
    currentNoteId,

    lectureCount,
    professorOrder,

    setPdfName,
    setPdfFile,
    setNotePages,
    setCurrentNoteId,

    setLectureCount,
    setProfessorOrder,

    projectCreatedAt, setProjectCreatedAt,
    projectUpdatedAt, setProjectUpdatedAt,
    // currentTime, setCurrentTime,
}) {

    const saveProject = async () => {
        const now = new Date().toISOString();

        setProjectUpdatedAt(now);

        const zip = new JSZip();

        const lectureFolder =
            zip.folder("lecture");

        const imageFolder =
            zip.folder("image");

        const refer = {
            version: 1,

            projectName: pdfName,

            createdAt: projectCreatedAt ?? now,

            updatedAt: now,

            lectureCount,

            currentNoteId,

            professorOrder,
        };

        zip.file(
            "refer.json",
            JSON.stringify(
                refer,
                null,
                2
            )
        );

        // PDF 저장
        if (pdfFile) {
            zip.file(
                "source.pdf",
                pdfFile
            );
        }

        for (
            const [lecturePage, notes]
            of Object.entries(notePages)
        ) {
            const folder =
                lectureFolder.folder(
                    lecturePage
                );

            for (const note of notes) {
                const noteCopy =
                    structuredClone(note);

                for (
                    const cell
                    of Object.values(
                        noteCopy.cells
                    )
                ) {
                    if (
                        cell.type === "image" &&
                        cell.imageData
                    ) {
                        const fileName =
                            `${cell.id}.png`;

                        const base64 =
                            cell.imageData.split(
                                ","
                            )[1];

                        imageFolder.file(
                            fileName,
                            base64,
                            {
                                base64: true,
                            }
                        );

                        delete cell.imageData;

                        cell.imagePath =
                            `image/${fileName}`;
                    }
                }

                folder.file(
                    `${note.id}.json`,
                    JSON.stringify(
                        noteCopy,
                        null,
                        2
                    )
                );
            }
        }

        const blob =
            await zip.generateAsync({
                type: "blob",
            });

        saveAs(
            blob,
            `${pdfName || "project"}.zip`
        );
    };

    const loadProject = async (
        selectedFile
    ) => {
        const zip =
            await JSZip.loadAsync(
                selectedFile
            );

        const referFile =
            zip.file("refer.json");

        if (!referFile) {
            throw new Error(
                "refer.json not found"
            );
        }

        const refer = JSON.parse(
            await referFile.async("text")
        );

        const nextNotePages = {};

        for (
            const lecturePage
            of refer.professorOrder
        ) {
            nextNotePages[
                lecturePage
            ] = [];

            const prefix =
                `lecture/${lecturePage}/`;

            const noteFiles =
                Object.keys(zip.files)
                    .filter(
                        (path) =>
                            path.startsWith(
                                prefix
                            ) &&
                            path.endsWith(
                                ".json"
                            )
                    )
                    .sort();

            for (
                const filePath
                of noteFiles
            ) {
                const note = JSON.parse(
                    await zip
                        .file(filePath)
                        .async("text")
                );

                for (
                    const cell
                    of Object.values(
                        note.cells
                    )
                ) {
                    if (
                        cell.type ===
                            "image" &&
                        cell.imagePath
                    ) {
                        const imageFile =
                            zip.file(
                                cell.imagePath
                            );

                        if (imageFile) {
                            const base64 =
                                await imageFile.async(
                                    "base64"
                                );

                            cell.imageData =
                                `data:image/png;base64,${base64}`;
                        }
                    }
                }

                nextNotePages[
                    lecturePage
                ].push(note);
            }
        }

        const pdfEntry =
            zip.file("source.pdf");

        if (pdfEntry) {
            const pdfBlob =
                await pdfEntry.async(
                    "blob"
                );

            const restoredPdf =
                new File(
                    [pdfBlob],
                    "source.pdf",
                    {
                        type:
                            "application/pdf",
                    }
                );

            setPdfFile(
                restoredPdf
            );
        }

        setPdfName(
            refer.projectName
        );

        setLectureCount(
            refer.lectureCount
        );

        setProfessorOrder(
            refer.professorOrder
        );

        setNotePages(
            nextNotePages
        );

        setCurrentNoteId(
            refer.currentNoteId
        );

        setProjectCreatedAt(
            refer.createdAt
        );

        setProjectUpdatedAt(
            refer.updatedAt
        );
    };

    return {
        saveProject,
        loadProject,
    };
}