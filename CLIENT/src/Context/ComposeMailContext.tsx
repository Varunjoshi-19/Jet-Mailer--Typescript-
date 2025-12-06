import { storage } from "@/Config/appwrite";
import { ApiEndPoints } from "@/Config/endPoints";
import type { ComposeMailContextProps, FileEntry } from "@/Interfaces/IComposeMail";
import type { SelectedEmailsForMail, UserContext } from "@/Interfaces/user";
import emailApiService from "@/Services/email";
import userApiHandler from "@/Services/user";
import { newMessagePromptIcons } from "@/Utils/Items";
import { ID } from "appwrite";
import type { EmojiClickData } from "emoji-picker-react";
import React, { createContext, useEffect, useRef, useState } from "react";


export const ComposeMailContext = createContext<ComposeMailContextProps | undefined>(undefined);

export const UseComposeMailContext = () => {
    const context = React.useContext(ComposeMailContext);
    if (!context) {
        throw new Error("Compose context not avialable!!");
    }
    return context;
}



export const ComposeMailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { fontFamiliesMap } = newMessagePromptIcons;

    const [mailTextFocused, setMailTextFocused] = useState<boolean>(false);
    const [expandAndOverlayToogle, setExpandAndOverlay] = useState(false);
    const [minimizeAndExpand, setMinimizeAndExpand] = useState(false);
    const [minimzedOrNot, setMinimizedOrNot] = useState(false);
    const [_, setRecipentMail] = useState("");
    const [toFixedToogle, setToFixedToogle] = useState(false);
    const [filesMap, setFilesMap] = useState<Map<string, FileEntry>>(new Map());
    const [boldActive, setBoldActive] = useState(false);
    const [italicActive, setItalicActive] = useState(false);
    const [underlineActive, setUnderlineActive] = useState(false);

    const textareaRef = useRef<HTMLDivElement | null>(null);

    const [, setUndoHistory] = useState<string[]>([]);
    const [, setRedoHistory] = useState<string[]>([]);

    const InsertFileRef = useRef<HTMLInputElement | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [fontFamilyBox, setFontFamilyBox] = useState(false);
    const [fontFamilyType, setFontFamilyType] = useState("Arial");

    const [fontsizebox, setFontSizeBox] = useState(false);
    const [selectedFontSize, setSelectedFontSize] = useState<string>("16px");

    const [colorPickerBox, setColorPickerBox] = useState(false);
    const [selectedBGColor, setSelectedBGColor] = useState<string>("#ffffff");
    const [selectedTextColor, setSelectedTextColor] = useState<string>("#000000");

    const [insertLinkToogle, setInsertLinkToogle] = useState<boolean>(false);
    const [searchUsers, setSearchUsers] = useState<UserContext[]>([]);

    const [selectedEmailForMail, setSelectedEmailForMail] = useState<Map<string, SelectedEmailsForMail> | null>(null);
    const [subject, setSubject] = useState<string>("");

    const [bodyText, setBodyText] = useState("text here...");
    const MAX_HISTORY = 500;
    const bodyTextRef = useRef(bodyText);

    const [existingDraftOpened, setExistingDraftOpened] = useState<boolean>(false);


    const [uploadedFiles, setUploadedFiles] = useState<number>(0);



    useEffect(() => {
        function updateFormattingState() {
            setBoldActive(document.queryCommandState("bold"));
            setItalicActive(document.queryCommandState("italic"));
            setUnderlineActive(document.queryCommandState("underline"));

            setSelectedFontSize(document.queryCommandValue("fontSize"));

            setFontFamilyType(fontFamiliesMap.get(document.queryCommandValue("fontName")) || document.queryCommandValue("fontName"));
            setSelectedTextColor(document.queryCommandValue("foreColor"));
            setSelectedBGColor(document.queryCommandValue("hiliteColor"));

        }

        document.addEventListener("selectionchange", updateFormattingState);

        return () => {
            document.removeEventListener("selectionchange", updateFormattingState);
        };
    }, []);




    function handleRemoveAttachMentFile(key: string) {
        setUploadedFiles(prev => prev - 1);
        setFilesMap((prev) => {
            const copy = new Map(prev);

            const data = copy.get(key);
            if (!data) return copy;
            if (data.blobUrl) {
                URL.revokeObjectURL(data.blobUrl);
            }

            copy.delete(key);

            // also delete from Appwrite (non-blocking)
            if (data.fileId) {
                const { appwriteBucketId } = ApiEndPoints;
                storage
                    .deleteFile(appwriteBucketId, data.fileId)
                    .then(() => console.log("Deleted from Appwrite:", data.fileId))
                    .catch((err) => console.error("Failed to delete from Appwrite:", err));
            }

            return copy;
        });
    }

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files) return;

        const fileArray = Array.from(e.target.files);


        setFilesMap((prev) => {
            const copy = new Map(prev);

            fileArray.forEach((file) => {
                const key = Date.now() + file.name;
                const url = URL.createObjectURL(file);
                handleUploadFileSimultaneously(key, file);
                copy.set(key, { file: file, uploadedStatus: false, blobUrl: url, fileName: file.name, size: file.size });

            });

            return copy;
        });
    };

    const handleUploadFileSimultaneously = async (key: string, file: File) => {
        try {
            const { appwriteBucketId, appwriteEndPoint, appwriteProjectId } = ApiEndPoints;
            const res = await storage.createFile({
                bucketId: appwriteBucketId,
                fileId: ID.unique(),
                file: file,
            });

            if (res.$id) {
                const fileUrl = `${appwriteEndPoint}/storage/buckets/${appwriteBucketId}/files/${res.$id}/view?project=${appwriteProjectId}`;
                setUploadedFiles(prev => prev + 1);
                setFilesMap((prev) => {
                    const copy = new Map(prev);
                    const item = copy.get(key);
                    if (item) {
                        item.uploadedStatus = true;
                        item.url = fileUrl;
                        item.fileId = res.$id;
                    }
                    return copy;
                });

                console.log("File uploaded", file.name, fileUrl);
            }
        } catch (err) {
            console.error("Upload failed:", err);

            setFilesMap((prev) => {
                const copy = new Map(prev);
                copy.delete(key);
                return copy;
            });
        }
    };


    const placeCaretAtEnd = (el: HTMLDivElement) => {
        el.focus(); const range = document.createRange();
        range.selectNodeContents(el); range.collapse(false);
        const sel = window.getSelection();
        if (!sel) return;
        sel.removeAllRanges();
        sel.addRange(range);
    };


    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (e.currentTarget.textContent.length == 0) {
            resetTheStyling();
        }
        const el = e.currentTarget;
        const newContent = el.innerHTML ?? "";

        if (newContent === bodyTextRef.current) return;

        setUndoHistory(prev => {
            const next = [...prev, bodyTextRef.current];
            if (next.length > MAX_HISTORY) next.splice(0, next.length - MAX_HISTORY);
            return next;
        });

        setBodyText(newContent);
        setRedoHistory([]);
    };

    const handleUndo = () => {
        setUndoHistory(prev => {
            if (prev.length === 0) return prev;

            const prevState = prev[prev.length - 1];
            setRedoHistory(rprev => {
                const nextR = [...rprev, bodyTextRef.current];
                if (nextR.length > MAX_HISTORY) nextR.splice(0, nextR.length - MAX_HISTORY);
                return nextR;
            });

            setBodyText(prevState);
            if (textareaRef.current) {
                textareaRef.current.innerHTML = prevState;
                placeCaretAtEnd(textareaRef.current);
            }

            return prev.slice(0, -1);
        });
    };

    const handleRedo = () => {
        setRedoHistory(prev => {
            if (prev.length === 0) return prev;

            const nextState = prev[prev.length - 1];
            setUndoHistory(uprev => {
                const nextU = [...uprev, bodyTextRef.current];
                if (nextU.length > MAX_HISTORY) nextU.splice(0, nextU.length - MAX_HISTORY);
                return nextU;
            });

            setBodyText(nextState);
            if (textareaRef.current) {
                textareaRef.current.innerHTML = nextState;
                placeCaretAtEnd(textareaRef.current);

            }

            return prev.slice(0, -1);
        });
    };

    const handleOnEmojiClick = (emojiData: EmojiClickData) => {
        const el = textareaRef.current;
        if (!el) return;

        el.focus();
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        const range = sel.getRangeAt(0);

        setUndoHistory(prev => {
            const next = [...prev, el.innerHTML];
            if (next.length > MAX_HISTORY) next.splice(0, next.length - MAX_HISTORY);
            return next;
        });

        range.deleteContents();
        range.insertNode(document.createTextNode(emojiData.emoji));

        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);

        setBodyText(el.innerHTML);
        setRedoHistory([]);
    };


    const resetTheStyling = () => {

        textareaRef.current?.blur();

        document.execCommand("removeFormat", false);
        setBoldActive(false);
        setItalicActive(false);
        setUnderlineActive(false);

    }


    const saveCaret = () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return null;

        const range = sel.getRangeAt(0);
        return {
            container: range.startContainer,
            offset: range.startOffset,
        };
    };

    const restoreCaret = (pos: { container: Node; offset: number } | null) => {
        if (!pos) return;
        const sel = window.getSelection();
        if (!sel) return;

        const range = document.createRange();
        range.setStart(pos.container, pos.offset);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    };


    const handleFetchUsersOnSearch = async (text: string) => {

        if (!text.trim()) {
            setSearchUsers([]);
            return;
        }
        console.log("triggered", text);
        const users: UserContext[] = await userApiHandler.handleFetchUsers(text);
        const filtered = users.sort((a, b) =>
            a.username.localeCompare(b.username)
        );

        setSearchUsers(filtered);
    }


    const checkExistingDraftOpened = async (formData : FormData) => {
        // formData.append("email_id" , ) 
        if(existingDraftOpened) {
              setExistingDraftOpened(false);
            const result = await emailApiService.handleUpdateExistingDraft(formData);
            console.log("Result" , result);
        }
        return false;
       
    }


    return (
        <ComposeMailContext.Provider
            value={{
                saveCaret,
                restoreCaret,
                mailTextFocused,
                setMailTextFocused,
                expandAndOverlayToogle,
                setExpandAndOverlay,
                minimizeAndExpand,
                setMinimizeAndExpand,
                minimzedOrNot,
                setMinimizedOrNot,
                setRecipentMail,
                toFixedToogle,
                setToFixedToogle,
                filesMap,
                setFilesMap,
                boldActive,
                setBoldActive,
                italicActive,
                setItalicActive,
                underlineActive,
                setUnderlineActive,
                fontFamilyBox,
                setFontFamilyBox,
                textareaRef,
                setUndoHistory,
                setRedoHistory,
                InsertFileRef,
                showEmojiPicker,
                setShowEmojiPicker,
                fontFamilyType,
                setFontFamilyType,
                fontsizebox,
                setFontSizeBox,
                colorPickerBox,
                setColorPickerBox,
                bodyText,
                setBodyText,
                MAX_HISTORY,
                bodyTextRef,
                selectedFontSize,
                setSelectedFontSize,
                selectedBGColor,
                setSelectedBGColor,
                selectedTextColor,
                setSelectedTextColor,
                insertLinkToogle,
                setInsertLinkToogle,
                searchUsers,
                setSearchUsers,
                selectedEmailForMail,
                setSelectedEmailForMail,
                subject,
                setSubject,
                uploadedFiles,
                setUploadedFiles,
                existingDraftOpened,
                setExistingDraftOpened,

                // FUNCTIONS : 
                handleRemoveAttachMentFile,
                handleFilesSelected,
                placeCaretAtEnd,
                handleInput,
                handleUndo,
                handleRedo,
                handleOnEmojiClick,
                handleFetchUsersOnSearch,
                checkExistingDraftOpened
            }}
        >
            {children}
        </ComposeMailContext.Provider>
    );
};
