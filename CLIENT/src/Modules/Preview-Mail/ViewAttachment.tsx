import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import styles from "./viewAttachment.module.css";
import type { AttachmentPayload } from "@/Interfaces/email";
import { previewMailStore } from "@/Utils/Items";



export interface ViewAttachmentProps {
    attachment: AttachmentPayload;
    onClose: React.Dispatch<React.SetStateAction<AttachmentPayload | null>>;
}

const ViewAttachment = ({ attachment, onClose }: ViewAttachmentProps) => {
    const [docxHtml, setDocxHtml] = useState<string | null>(null);
    const [textContent, setTextContent] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { imageExtensions, videoExtensions, audioExtensions, documentExtensions } = previewMailStore;

    const extension = attachment.contentType;
    console.log('extension', extension);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        console.log('extension', extension);

        loadPreview();
    }, [attachment.fileUrl, extension]);

    const loadPreview = async () => {

        try {
            if (extension === "docx") {
                const res = await fetch(attachment.fileUrl);
                const arrayBuffer = await res.arrayBuffer();
                const { value } = await mammoth.convertToHtml({ arrayBuffer });
                setDocxHtml(value);
            }

            else if (["xlsx", "xls"].includes(extension)) {
                const res = await fetch(attachment.fileUrl);
                const data = await res.arrayBuffer();
                const workbook = XLSX.read(data, { type: "array" });
                const html = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);
                setDocxHtml(html);
            }

            else if (documentExtensions.includes(`.${extension}`)) {
                const res = await fetch(attachment.fileUrl);
                const text = await res.text();
                setTextContent(text);
            }


        } catch (err) {
            console.error("Preview error:", err);
        }
    };

    const renderPreview = () => {

        if (imageExtensions.includes(`.${extension}`)) {
            return <img src={attachment.fileUrl} className={styles.previewImage} />;
        }

        if (videoExtensions.includes(`.${extension}`)) {
            return <video src={attachment.fileUrl} controls className={styles.previewMedia} />;
        }

        if (audioExtensions.includes(`.${extension}`)) {
            return <audio src={attachment.fileUrl} controls className={styles.previewMedia} />;
        }

        if (extension === "pdf") {
            return (
                <iframe
                    src={attachment.fileUrl}
                    className={styles.previewPdf}
                    title={attachment.fileName}
                />
            );
        }

        if (documentExtensions.includes(`.${extension}`)) {
            if (docxHtml)
                return <div className={styles.docxContent} dangerouslySetInnerHTML={{ __html: docxHtml }} />;
            if (textContent)
                return <pre className={styles.textContent}>{textContent}</pre>;
        }

        return (
            <div className={styles.noPreview}>
                <p>No preview available for this file type.</p>
                <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer" download>
                    Download {attachment.fileName}
                </a>
            </div>
        );
    };


    return (
        <>
            <div className={styles.overlay}></div>
            <div ref={containerRef} className={styles.container}>
                {renderPreview()}
            </div>
        </>
    );
};

export default ViewAttachment;
