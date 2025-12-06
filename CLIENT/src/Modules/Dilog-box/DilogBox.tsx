import React from "react";
import styles from "./dilog.module.css";
import type { DialogOptions } from "@/Context/GlobalContext";

interface DynamicDialogProps {
    type?: "error" | "info" | "confirm";
    title?: string;
    message: string;
    width?: string;
    height?: string;
    onClose: React.Dispatch<React.SetStateAction<DialogOptions | null>>;
    onConfirm?: () => void;
}

const DynamicDialog: React.FC<DynamicDialogProps> = ({
    type = "info",
    title,
    message,
    width = "320px",
    height = "180px",
    onClose,
    onConfirm,
}) => {
    const renderButtons = () => {
        if (type === "confirm") {
            return (
                <div className={styles.buttonGroup}>
                    <button onClick={() => onClose(null)} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm && onConfirm();
                            onClose(null);
                        }}
                        className={styles.confirmBtn}
                    >
                        Confirm
                    </button>
                </div>
            );
        }

        return (
            <button onClick={() => onClose(null)} className={styles.okBtn}>
                OK
            </button>
        );
    };

    return (
        <div className={styles.overlay}>
            <div
                className={`${styles.dialogBox} ${styles[type]}`}
                style={{ width, height }}
            >
                <h3 className={styles.title}>{title || type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>{renderButtons()}</div>
            </div>
        </div>
    );
};

export default DynamicDialog;
