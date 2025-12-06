import type { SnackbarOptions } from "@/Context/GlobalContext";
import styles from "./snackbar.module.css";
import type React from "react";
import { useEffect, useState } from "react";

interface SnackBarPayload {
    loadingMsg: string;
    ProcessedMsg: string;
    actions?: { label: string; callbackFunc: () => void }[];
    duration?: number;
    onClose: React.Dispatch<React.SetStateAction<SnackbarOptions | null>>;
}

function SnackBar(
    { loadingMsg, ProcessedMsg, actions, duration = 10000, onClose }: SnackBarPayload


) {

    const [fallbackMsg, setFallbackMsg] = useState<boolean>(false);
    const [currentActions, setCurrentActions] = useState(actions || []);

    useEffect(() => {

        const msgTimeoutId = setTimeout(() => {
            setFallbackMsg(true);
        }, 2000);

        const timeoutId = setTimeout(() => {
            onClose(null);
        }, duration);

        const undoTimeoutId = setTimeout(() => {
            setCurrentActions(prev => prev.filter(action => action.label !== "Undo"));
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(msgTimeoutId);
            clearTimeout(undoTimeoutId);
        };

    }, []);



    return (
        <div className={styles.snackbar}>

            <span>{fallbackMsg ? ProcessedMsg : loadingMsg}</span>
            <div className={styles.actions}>
                {currentActions.map((action, i) => (
                    <button key={i} onClick={action.callbackFunc}>
                        {action.label}
                    </button>
                ))}
            </div>
            <button className={styles.close} onClick={() => onClose(null)}>✕</button>
        </div>
    )
}

export default SnackBar
