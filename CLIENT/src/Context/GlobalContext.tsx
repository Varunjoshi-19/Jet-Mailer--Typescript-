import { BACKEND_URL } from "@/Config/endPoints";
import type { DialogOptions, GlobalContextPayload, MailItem, SnackbarOptions } from "@/Interfaces/IContext/globalContext";
import DynamicDialog from "@/Modules/Dilog-box/DilogBox";
import SnackBar from "@/Modules/Dilog-box/SnackBar";
import emailApiService from "@/Services/email";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

const GlobalContext = React.createContext<GlobalContextPayload | undefined>(undefined);

export const UseGlobalContext = () => {

    const context = React.useContext(GlobalContext);
    if (!context) {
        throw new Error("Context is not available!!");
    }
    return context;
}


export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [messageDilogBox, setMessageDilogBox] = useState<DialogOptions | null>(null);
    const [allMails, setAllMails] = useState<MailItem[]>([]);
    const [snackbar, setSnackbar] = useState<SnackbarOptions | null>(null);
    const emailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    const socket = useMemo(() => io(BACKEND_URL), []);

    useEffect(() => {

        socket.on("new-email-available", async (data) => {
            const { email_id } = data;
            const result = await emailApiService.handleFetchSingleMail(email_id);
            if (result.success && result.data) {
                setAllMails(prev => [result.data, ...prev]);
            }

        })

    }, [socket]);


    return (
        <>

            {snackbar &&
                <SnackBar
                    loadingMsg={snackbar.message.loadMsg}
                    ProcessedMsg={snackbar.message.processedMsg}
                    actions={snackbar.actions}
                    onClose={setSnackbar}
                />
            }

            <GlobalContext.Provider value={{ socket, setAllMails, allMails, emailTimerRef, messageDilogBox, setMessageDilogBox, snackbar, setSnackbar }}>
                {children}

                {messageDilogBox && (
                    <DynamicDialog
                        type={messageDilogBox.type}
                        title={messageDilogBox.title}
                        message={messageDilogBox.message}
                        width={messageDilogBox.width}
                        height={messageDilogBox.height}
                        onClose={setMessageDilogBox}
                        onConfirm={() => {
                            messageDilogBox.onConfirm?.();
                            setMessageDilogBox(null);
                        }}
                    />
                )}




            </GlobalContext.Provider>
        </>

    )
}



