import type { Socket } from "socket.io-client";
import type { AttachmentPayload } from "../email";

type DialogType = "error" | "info" | "confirm";

export interface DialogOptions {
    type?: DialogType;
    title?: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    width?: string;
    height?: string;
}

export interface SnackbarOptions {
    message: { loadMsg: string, processedMsg: string };
    actions?: { label: string; callbackFunc: () => void }[];
    duration?: number;
}



export interface GlobalContextPayload {
    socket: Socket;
    messageDilogBox: DialogOptions | null;
    setMessageDilogBox: React.Dispatch<React.SetStateAction<DialogOptions | null>>;
    snackbar: SnackbarOptions | null;
    setSnackbar: React.Dispatch<React.SetStateAction<SnackbarOptions | null>>;
    emailTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
    allMails: MailItem[];
    setAllMails: React.Dispatch<React.SetStateAction<MailItem[]>>;

}

export interface MailItemDraft {
    _id: string;
    senderRef: {
        id: string,
        email: string;
    };
    receiverRef: {
        id: {
            _id: string;
            email: string;
            profilePicture: string;
        };
        email: string;
    }[];

    attachments?: AttachmentPayload[],
    subject: string;
    mailBodyContent: string;
    category: string;
    createdAt: string;
    lastUpdatedAt: string;
    messageSchedule: string;
    isScheduled: boolean;
    isVisibleToSender: boolean;
    seenStatus: boolean;
    sendStatus: "Sent" | "Pending" | "Failed" | string;
    snoozed: boolean;
    starred: boolean;
}


export interface MailItem {
    _id: string;
    senderRef: {
        id: {
            username: string;
            _id: string;
            email: string;
            profilePicture: string;
        }
    };
    receiverRef: {
        id: string;
        email: string;
    };

    attachments?: AttachmentPayload[],
    subject: string;
    mailBodyContent: string;
    category: string;
    createdAt: string;
    lastUpdatedAt: string;
    messageSchedule: string;
    isScheduled: boolean;
    isVisibleToSender: boolean;
    seenStatus: boolean;
    sendStatus: "Sent" | "Pending" | "Failed" | string;
    snoozed: boolean;
    starred: boolean;
}