import { useCallback, useEffect, useRef, useState } from "react";
import { newMessagePromptIcons } from "@/Utils/Items";
import styles from "./styles.module.css";
import { NewMessageIconActions, type NewMessagePromptProps } from "@/Interfaces";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { helper } from "@/Utils/helper";
import uploading from "@/Assets/file-loader.gif";
import { X } from "lucide-react";
import FontFamilyBox from "./FontFamilyBox";
import FontSizeBox from "./FontSizesBox";
import ColorPickerBox from "./ColorBox";
import { UseComposeMailContext } from "@/Context/ComposeMailContext";
import linkImage from "@/Assets/link.png";
import textImage from "@/Assets/text.png";
import type { UserContext } from "@/Interfaces/user";
import { UseGlobalContext } from "@/Context/GlobalContext";
import emailApiService from "@/Services/email";
import { UseUserContext } from "@/Context/UserContext";



const { icons, ToptoolOptions, bottomToolOptions, dropDown, whiteDropDown, dropDownType, BOTTOM_TOOL_NAMES, TOP_TOOL_NAMES } = newMessagePromptIcons;

interface OpenSuggestionLinkInfoProps {
    link: string;
    text: string;
    x: number;
    y: number;

}

function ComposeEmailPrompt({ toogleCloseAndOpen }: NewMessagePromptProps) {

    // VARIABLES : 

    const {

        setMailTextFocused,
        expandAndOverlayToogle,
        setExpandAndOverlay,
        minimzedOrNot,
        setMinimizedOrNot,
        minimizeAndExpand,
        setMinimizeAndExpand,
        setRecipentMail,
        toFixedToogle,
        selectedEmailForMail,
        setSelectedEmailForMail,
        filesMap,
        textareaRef,
        bodyText,
        bodyTextRef,
        handleInput,
        handleRemoveAttachMentFile,
        insertLinkToogle,
        setInsertLinkToogle,
        searchUsers,
        setSearchUsers,
        subject,
        setSubject,
        setFilesMap,
        setUploadedFiles,

        handleFetchUsersOnSearch,
        checkExistingDraftOpened

    } = UseComposeMailContext();

    const { state: { user } } = UseUserContext();


    const [textValue, setTextValue] = useState<string>("");
    const [linkValue, setLinkValue] = useState<string>("");

    const [enableLinkSuggestion, setEnableLinkSuggestion] = useState<boolean>(false);
    const [storeCurrentOpenLink, setStoreCurrentOpenLink] = useState<HTMLAnchorElement | null>(null);


    const [openSuggestionLinkInfo, setOpenSuggestionLinkInfo] = useState<OpenSuggestionLinkInfoProps | null>(null);
    const recepientEmailRef = useRef<HTMLDivElement>(null);
    const suggestionLinkBoxRef = useRef<HTMLDivElement>(null);
    const [plainTextEmails, setPlainTextEmails] = useState<boolean>(false);


    // HOOKS  : 

    useEffect(() => { bodyTextRef.current = bodyText; }, [bodyText]);


    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }

    }, [bodyText]);

    useEffect(() => {
        const editor = document.getElementById("text-editor");

        if (!editor) return;


        editor.addEventListener("click", handleDetectLinkInEditor);

        return () => {
            editor.removeEventListener("click", handleDetectLinkInEditor);
        };
    }, [textareaRef]);

    useEffect(() => {
        const emailBox = recepientEmailRef.current;
        if (emailBox) {
            emailBox.onfocus = handleOnEmailFocus;
            emailBox.onblur = handleEmailOnBlur;

        }

    }, [recepientEmailRef])

    useEffect(() => {
        if (toFixedToogle && recepientEmailRef.current) {
            recepientEmailRef.current.focus();
        }
    }, [selectedEmailForMail, toFixedToogle]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const box = suggestionLinkBoxRef.current;
            const editor = recepientEmailRef.current;

            if (box && !box.contains(e.target as Node) && !editor?.contains(e.target as Node)) {
                setEnableLinkSuggestion(false);

            }
        };

        document.addEventListener("pointerdown", handleClickOutside);

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, []);



    const debouncedSearch = useCallback(helper.debounce(handleFetchUsersOnSearch, 500), []);


    // FUNCTIONS : 

    function handleOnEmailFocus() {
        setPlainTextEmails(false);
    }

    function handleEmailOnBlur() {
        setPlainTextEmails(true);
    }

    function handleOperationOnClick(name: string) {
        const UpperCaseName = name.toString().toUpperCase();


        switch (UpperCaseName) {
            case NewMessageIconActions.EXPAND: {
                handleExpand();
                return;
            }
            case NewMessageIconActions.MINIMIZE: {
                console.log("clicked")
                handleMinimizeMessagePrompt();
                return;
            }
            case NewMessageIconActions.CLOSE: {
                handleCloseAndSaveInDraftIfTextExists();
                return;
            }

        }

    }

    function handleExpand() {
        setEnableLinkSuggestion(false);
        if (minimzedOrNot && expandAndOverlayToogle) {
            setExpandAndOverlay(prev => !prev);
            return;
        }

        if (minimzedOrNot) {
            setMinimizeAndExpand(true);
            setExpandAndOverlay(prev => !prev);
            setMinimizedOrNot(prev => !prev);
            return;
        }

        setExpandAndOverlay(prev => !prev);

    }

    function handleMinimizeMessagePrompt() {
        if (minimzedOrNot && minimizeAndExpand) {
            setExpandAndOverlay(true);
            setMinimizeAndExpand(false);
            setMinimizedOrNot(prev => !prev);
            return;
        }

        if (expandAndOverlayToogle) {
            setMinimizeAndExpand(true);
            setExpandAndOverlay(false);
            setMinimizedOrNot(prev => !prev);
            return;
        }
        setMinimizedOrNot(prev => !prev);

    }

    async function handleCloseAndSaveInDraftIfTextExists() {
        toogleCloseAndOpen(prev => !prev);

        if (!user || !textareaRef.current) return;

        const hasReceiver = selectedEmailForMail && selectedEmailForMail.size > 0;
        const hasSubject = subject.trim() !== "";
        const hasBody = textareaRef.current && textareaRef.current.innerHTML.trim() !== "";
        const hasAttachments = filesMap && filesMap.size > 0;

        // Only create a draft if there's any user input
        if (hasReceiver || hasSubject || hasBody || hasAttachments) {
            const formData = new FormData();

            // Required: sender info
            formData.append("senderDetails", JSON.stringify({
                id: user._id,
                email: user.email
            }));

            // Optional: receivers
            if (hasReceiver) {
                Array.from(selectedEmailForMail.entries()).forEach(([_, value]) => {
                    formData.append("recieverDetails", JSON.stringify({
                        id: value._id,
                        email: value.email
                    }));
                });
            }

            // Optional: subject & body
            if (hasSubject) formData.append("subject", subject);
            if (hasBody) formData.append("mailBodyContent", textareaRef.current.innerHTML.toString());

            // Mark as draft
            formData.append("type", "Draft");
            formData.append("messageSchedule", Date.now().toString());
            formData.append("category", "Primary");

            // Optional: attachments
            if (hasAttachments) {
                Array.from(filesMap.entries()).forEach(([_, value]) => {
                    const extension = value.fileName.toString().split(".").pop();
                    const fileData = {
                        fileId: value.fileId,
                        contentType: extension,
                        fileName: value.fileName,
                        size: value.size,
                        fileUrl: value.url
                    };
                    formData.append("attachments", JSON.stringify(fileData));
                });
            }

           const result = await checkExistingDraftOpened(formData);

            try {
                const result = await emailApiService.handleSendEmail(formData);
                if (!result.success) {
                    console.log("Failed to save draft:", result.message);
                } else {
                    console.log("Draft saved successfully!");
                }
            } catch (error) {
                console.error("Error saving draft:", error);
            }
        }


        setFilesMap(new Map());
        setSelectedEmailForMail(null);
        setSubject("");
        if (textareaRef.current) textareaRef.current.innerHTML = "";
        setUploadedFiles(0);
    }



    const HandleGenerateLink = () => {

        if (storeCurrentOpenLink) {
            storeCurrentOpenLink.href = linkValue;
            storeCurrentOpenLink.textContent = textValue;

            setStoreCurrentOpenLink(null);
        }
        else {
            const createLink = document.createElement("a");
            createLink.style.marginLeft = "4px";
            createLink.style.color = "blue";
            createLink.href = linkValue;
            createLink.style.textDecoration = "underline";
            createLink.textContent = textValue;
            textareaRef.current?.appendChild(createLink);
            textareaRef.current?.focus();
        }

        setTextValue("");
        setLinkValue("");

        setInsertLinkToogle(prev => !prev);

    }

    const handleDetectLinkInEditor = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        if (target.tagName.toLowerCase() === "a" && textareaRef.current) {
            e.preventDefault();

            const anchor = target as HTMLAnchorElement;
            const linkRect = anchor.getBoundingClientRect();

            setEnableLinkSuggestion(true);
            setStoreCurrentOpenLink(anchor);
            setLinkValue(anchor.href);
            setTextValue(anchor.textContent);

            setOpenSuggestionLinkInfo({
                link: anchor.href,
                text: anchor.textContent,
                x: linkRect.left,
                y: linkRect.bottom,
            });

            console.log({ link: anchor.href, x: linkRect.left, y: linkRect.bottom })
        }
    };

    const handleRemoveLinkFromEditor = () => {
        setLinkValue("");
        setTextValue("");
        setEnableLinkSuggestion(false);
        setOpenSuggestionLinkInfo(null);
        storeCurrentOpenLink?.remove();
        setStoreCurrentOpenLink(null);
    }

    const handleChangeLinkFromEditor = () => {
        setInsertLinkToogle(true);
        setEnableLinkSuggestion(false);
    }

    function handleEmailSelected(user: UserContext) {
        console.log("click new email added");
        if (recepientEmailRef.current) {
            recepientEmailRef.current.textContent = "";
        }
        setSelectedEmailForMail(prev => {
            const newMap = new Map(prev);

            newMap.set(user._id, { _id: user._id, email: user.email, profilePicture: user.profilePicture! });
            return newMap;
        });

        recepientEmailRef.current?.focus();
        setSearchUsers([]);

    }

    function handleRemoveEmail(id: string) {
        setSelectedEmailForMail(prev => {
            const newMap = new Map(prev);
            if (newMap.has(id)) {
                newMap.delete(id);
            }
            return newMap;
        })
    }



    // RETURNED HTML : 

    return (
        <>
            <div className={expandAndOverlayToogle ? styles.overlay : undefined}></div>

            <div className={expandAndOverlayToogle ? styles.expandedContainer : styles.normalContainer}
                style={{ bottom: minimzedOrNot ? "-600px" : "-10px", width: minimzedOrNot ? "400px" : (expandAndOverlayToogle ? "80%" : "650px") }}>


                <div className={styles.topHeadNewMessage}>
                    <span>New Message</span>
                    <div className={styles.toogleIcons}>
                        {icons.map((each) => (
                            <img key={each.name}
                                onClick={() => handleOperationOnClick(each.name)}
                                src={each.imageUrl} alt={each.name} title={each.name} />
                        ))}
                    </div>
                </div>

                <div className={styles.mainContainer}>

                    <div style={{
                        display: 'flex', justifyContent: "center", gap: "15px",
                        position: "relative",
                        flexDirection: "column", width: "100%"
                    }}>
                        <span className={styles.To_Fixed}>To </span>


                        <div onClick={() => {
                            if (recepientEmailRef.current) {
                                recepientEmailRef.current.focus();
                            }
                        }} className={styles.dynamicEmailsAndInputField}>

                            {
                                plainTextEmails ?
                                    (selectedEmailForMail && selectedEmailForMail.size > 0 &&
                                        <div className={styles.allSelectedEmails}>
                                            {
                                                Array.from(selectedEmailForMail.entries()).map(([key, value], index) => (
                                                    <span style={{ fontSize: "13px" }}
                                                        key={key}>{value.email} {selectedEmailForMail.size - 1 != index && ","}</span>
                                                ))
                                            }
                                        </div>
                                    )
                                    :
                                    (selectedEmailForMail && selectedEmailForMail.size > 0 &&
                                        <div id="selected-emails" className={styles.allSelectedEmails}>
                                            {
                                                Array.from(selectedEmailForMail.entries()).map(([key, value]) => (
                                                    <div id={styles.eachEmail} key={key}>
                                                        <img width={25} height={25} style={{ objectFit: "contain", borderRadius: "50%" }}
                                                            src={value.profilePicture} alt="userImage" />
                                                        <span>{value.email}</span>
                                                        <X size={20} color="gray"
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                handleRemoveEmail(value._id);
                                                            }}
                                                            onClick={() => {
                                                                handleRemoveEmail(value._id);
                                                            }} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                            }


                            <div style={{ position: "relative", marginLeft: "15px", width: "50%" }}>

                                <div className={styles.recepientInput}
                                    ref={recepientEmailRef}
                                    contentEditable="plaintext-only"

                                    onInput={e => {
                                        setRecipentMail(e.currentTarget.innerText);
                                        debouncedSearch(e.currentTarget.innerText);
                                    }}
                                    aria-autocomplete="list"
                                    aria-haspopup="true"
                                    role="textbox"
                                />

                                {
                                    searchUsers && searchUsers.length > 0 && !plainTextEmails &&
                                    <div className={styles.searchUsersList}>

                                        {searchUsers.map((user, index) => (
                                            <div
                                                key={index}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    handleEmailSelected(user);

                                                }}
                                                className={styles.userItem} >
                                                {user.profilePicture ? (
                                                    <img src={user.profilePicture} alt={user.username} className={styles.avatar} />
                                                ) : (
                                                    <div className={styles.defaultAvatar}>{user.username[0]}</div>
                                                )}
                                                <div className={styles.userInfo}>
                                                    <span className={styles.userName}>{user.username}</span>
                                                    <span className={styles.userEmail}>{user.email}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }


                            </div>

                        </div>

                        <input id={styles.Subject} type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subject" />

                    </div>


                    <div className={styles.uploadFilesAndTextArea}>

                        {/* MAIN TEXT EDITOR */}
                        <div id="text-editor"
                            onInput={handleInput}
                            onFocus={() => setMailTextFocused(true)}
                            onBlur={() => setMailTextFocused(false)}
                            ref={textareaRef}
                            contentEditable={true}
                            suppressContentEditableWarning
                            className={styles.BodyTextArea}>


                        </div>
                        {/*  INSERT LINK  */}
                        {insertLinkToogle &&

                            <div className={styles.insertLinkPopup}>

                                <div>
                                    <img src={textImage} alt="" />
                                    <input type="text"
                                        value={textValue} onChange={(e) => setTextValue(e.target.value)}
                                        placeholder="Text" />
                                </div>
                                <div>
                                    <img src={linkImage} alt="" />
                                    <input type="text"
                                        value={linkValue} onChange={(e) => setLinkValue(e.target.value)}
                                        placeholder="Type or paste a link" />
                                    <button onClick={HandleGenerateLink}
                                        disabled={!(textValue.length > 0 && linkValue.length > 0)}
                                        className={textValue.length > 0 && linkValue.length > 0 ? styles.activeApplyButton : styles.disableApplyBtn} >Apply</button>
                                </div>

                            </div>
                        }

                        {
                            openSuggestionLinkInfo && enableLinkSuggestion &&
                            <div ref={suggestionLinkBoxRef} className={styles.suggestionLinkBox} style={{ left: openSuggestionLinkInfo.x, top: openSuggestionLinkInfo.y }}>
                                <span>
                                    <span>Go to link: </span>
                                    <a href={openSuggestionLinkInfo.link} target="_blank">{openSuggestionLinkInfo.link.toString().substring(0, 30)}...</a>
                                </span>
                                {"|"}
                                <span style={{ color: "blue", cursor: "pointer" }} onClick={handleChangeLinkFromEditor}>Change</span>
                                {"|"}
                                <span style={{ color: "blue", cursor: "pointer" }}
                                    onClick={handleRemoveLinkFromEditor}
                                >Remove</span>
                            </div>
                        }


                        {/* SELECTED FILES */}

                        <div className={styles.uploadedFileContainer}>
                            {
                                filesMap &&

                                Array.from(filesMap.entries()).map(([name, { uploadedStatus, blobUrl, fileName, size }]) => {


                                    return (
                                        <div key={name} className={styles.eachFileBox}>
                                            <div style={{ alignItems: "center", display: "flex", justifyContent: "center", gap: "10px" }}>
                                                <a href={blobUrl} target="_blank" rel="noopener noreferrer">
                                                    {fileName.substring(0, 20)}...
                                                </a>
                                                <span>({helper.formatFileSize(size)})</span>
                                            </div>
                                            {!uploadedStatus ?
                                                <img src={uploading} alt="uploading..." />

                                                :
                                                <div onClick={() => handleRemoveAttachMentFile(name)}
                                                    style={{ display: "flex", alignItems: "center" }} title="remove-attachment" >
                                                    <X size={14} cursor={"pointer"} />
                                                </div>
                                            }
                                        </div>
                                    );
                                })
                            }


                        </div>

                    </div>


                    <ToolBarOptions toogleCloseAndOpen={toogleCloseAndOpen} />


                </div>

            </div>

        </>
    )
}

interface ToogleBarProps {

    toogleCloseAndOpen: React.Dispatch<React.SetStateAction<boolean>>;

}


function ToolBarOptions({ toogleCloseAndOpen }: ToogleBarProps) {

    const {
        textareaRef,
        setMailTextFocused,
        boldActive,
        italicActive,
        underlineActive,
        setBoldActive,
        setFontFamilyBox,
        setUnderlineActive,
        setItalicActive,
        handleRedo,
        handleUndo,
        setFontSizeBox,
        saveCaret,
        restoreCaret,
        setColorPickerBox,
        InsertFileRef,
        setShowEmojiPicker,
        fontFamilyType,
        setInsertLinkToogle,
        selectedEmailForMail,
        setSelectedEmailForMail,
        subject,
        setSubject,
        filesMap,
        setFilesMap,
        setUploadedFiles,
        uploadedFiles,

    } = UseComposeMailContext();

    const { setMessageDilogBox, emailTimerRef, setSnackbar } = UseGlobalContext();
    const { state: { user } } = UseUserContext();

    const DELAY = 5000;

    function handleTopToolsActions(toolName: string) {

        const UpperToolName = toolName.toString().toUpperCase();
        if (textareaRef.current) {

            switch (UpperToolName) {
                case TOP_TOOL_NAMES["UNDO"]: {
                    handleUndo();
                    break;
                }

                case TOP_TOOL_NAMES.REDO: {
                    handleRedo();
                    break;
                }

                case TOP_TOOL_NAMES.FONT: {
                    setFontSizeBox(false);
                    setColorPickerBox(false);
                    setFontFamilyBox(prev => !prev);
                    break;
                }

                case TOP_TOOL_NAMES.SIZE: {
                    setFontFamilyBox(false);
                    setColorPickerBox(false);
                    setFontSizeBox(prev => !prev);
                    break;
                }

                case TOP_TOOL_NAMES.BOLD: {
                    const caretPos = saveCaret();
                    restoreCaret(caretPos);
                    setMailTextFocused(true);
                    document.execCommand("bold", false);
                    setBoldActive(prev => !prev);
                    break;
                }

                case TOP_TOOL_NAMES.ITALIC: {


                    const caretPos = saveCaret();
                    restoreCaret(caretPos);
                    setMailTextFocused(true);
                    document.execCommand("italic", false);
                    setItalicActive(prev => !prev);
                    break;
                }

                case TOP_TOOL_NAMES.UNDERLINE: {

                    const caretPos = saveCaret();
                    restoreCaret(caretPos);
                    setMailTextFocused(true);

                    document.execCommand("underline", false);
                    setUnderlineActive(prev => !prev);
                    break;
                }

                case TOP_TOOL_NAMES["TEXT-COLOR"]: {
                    setFontFamilyBox(false);
                    setFontSizeBox(false);
                    setColorPickerBox(prev => !prev);
                    break;
                }

                case TOP_TOOL_NAMES["MORE-OPTIONS"]: {
                    break;
                }

                default: {
                    console.warn("Unknown top tool selected:", toolName);
                }
            }
        }
    }

    function handleBottomToolAction(toolName: string) {

        const UpperCaseToolName = toolName.toString().toUpperCase();

        switch (UpperCaseToolName) {
            case BOTTOM_TOOL_NAMES["FORMATTING-OPTIONS"]: {

                break;
            }

            case BOTTOM_TOOL_NAMES["ATTACH-FILES"]: {
                if (InsertFileRef.current) {
                    InsertFileRef.current.click();
                }
                break;
            }

            case BOTTOM_TOOL_NAMES["INSERT-LINK"]: {
                setInsertLinkToogle(prev => !prev);
                break;
            }

            case BOTTOM_TOOL_NAMES["EMOJI"]: {
                setShowEmojiPicker(prev => !prev);
                break;
            }

            case BOTTOM_TOOL_NAMES["INSERT-FILE-USING-DRIVE"]: {
                console.log("Insert file from Google Drive");
                break;
            }

            case BOTTOM_TOOL_NAMES["INSERT-PHOTO"]: {
                console.log("Insert photo");
                break;
            }

            case BOTTOM_TOOL_NAMES["TOGGLE-CONFIDENTIAL-MODE"]: {
                console.log("Toggle confidential mode");
                break;
            }

            case BOTTOM_TOOL_NAMES["INSERT-SIGNATURE"]: {
                console.log("Insert signature");
                break;
            }

            case BOTTOM_TOOL_NAMES["MORE-OPTIONS"]: {
                console.log("Show more options");
                break;
            }

            case BOTTOM_TOOL_NAMES["DISCARD-DRAFT"]: {
                console.log("Discard draft");
                break;
            }

            default: {
                console.warn("Unknown tool selected:", toolName);
            }
        }
    }

    function SendEmail() {
        if (!handleValidateFields()) return;

        if (!selectedEmailForMail || !user || !textareaRef.current) return;

        const formData = new FormData();
        formData.append("senderDetails", JSON.stringify({
            id: user._id,
            email: user.email
        }));


        formData.append("subject", subject);
        formData.append("mailBodyContent", textareaRef.current.innerHTML.toString());
        formData.append("messageSchedule", Date.now().toString());
        formData.append("type", "Sent");
        formData.append("category", "Primary");

        // Multiple receivers 
        Array.from(selectedEmailForMail.entries()).forEach(([_, value]) => {
            formData.append("recieverDetails", JSON.stringify({ id: value._id, email: value.email }));
        })

        // Attachment files
        if (filesMap && filesMap.size > 0) {
            Array.from(filesMap.entries()).forEach(([_, value]) => {
                const extension = value.fileName.toString().split(".").pop();
                const fileData = {
                    fileId: value.fileId,
                    contentType: extension,
                    fileName: value.fileName,
                    size: value.size,
                    fileUrl: value.url
                }
                formData.append("attachments", JSON.stringify(fileData));
            })
        }


        const SendMailsActions = [{
            label: "Undo",
            callbackFunc: () => {
                if (emailTimerRef.current) {
                    clearTimeout(emailTimerRef.current);
                    emailTimerRef.current = null;
                    setSnackbar(null);
                }
            }
        },
        {
            label: "View Message",
            callbackFunc: () => {
                //  TODO : implement the view message ..
            }

        }];


        handleResetFields();
        toogleCloseAndOpen(false);

        setSnackbar({
            message: { loadMsg: "Sending...", processedMsg: "Your Message Sent" },
            actions: SendMailsActions,
        });

        setFilesMap(new Map());
        setSelectedEmailForMail(null);
        setSubject("");
        if (textareaRef.current) {
            textareaRef.current.innerHTML = "";
        }
        setUploadedFiles(0);
        emailTimerRef.current = setTimeout(async () => {

            const result = await emailApiService.handleSendEmail(formData);
            if (!result.success) {
                console.log("Failed to send email !!", result.message);
                return;
            }

            console.log("Email sent successfully!!");

        }, DELAY);


    }

    const handleValidateFields = (): boolean => {

        if (selectedEmailForMail == null || selectedEmailForMail.size == 0) {
            setMessageDilogBox({
                type: "error",
                message: "Please specify at least one recipient.",
            });
            return false;
        }

        if (!subject.trim()) {
            setMessageDilogBox({
                type: "error",
                message: "Subject can not be empty."
            });
            return false;
        }

        if (textareaRef.current && !textareaRef.current.textContent.trim()) {
            setMessageDilogBox({
                type: "error",
                message: "Email body can not be empty."
            })
            return false;
        }

        return true;

    }

    const handleResetFields = () => {
        setSelectedEmailForMail(null);
        setSubject("");
        if (textareaRef.current) {
            textareaRef.current.textContent = "";
        }
    }



    return (
        <>

            <div className={styles.toolbarContainer}>

                <div className={styles.allTools}>
                    {ToptoolOptions.map((each, index) => {

                        return (
                            <div key={index + each.imageIcon}
                                onClick={() => handleTopToolsActions(each.toolName)}
                                className={`${styles.topTools} ${boldActive && each.toolName == "bold" ? styles.activeIcon : undefined}
                                ${italicActive && each.toolName == "italic" ? styles.activeIcon : undefined} ${underlineActive && each.toolName == "underline" ? styles.activeIcon : undefined}
                                `}>
                                <img width={20} style={{ cursor: "pointer" }} src={each.imageIcon} alt="" title={each.toolName} />
                                {each.toolName == "font" && <span title={each.toolName}
                                    className={styles.fontFamilyBox}
                                >{fontFamilyType.length > 20 ? `${fontFamilyType.substring(0, 10)}...` : fontFamilyType}</span>}
                                {dropDownType.includes(each.toolName) &&
                                    <img style={{ width: "20px", cursor: "pointer" }}
                                        title={each.toolName}
                                        src={dropDown} alt="" />
                                }
                            </div>
                        )
                    })}

                </div>


                <div style={{ display: "flex", gap: "5px", width: "100%", alignItems: "center" }}>

                    <div className={styles.SendButton} style={{ opacity: filesMap.size == uploadedFiles ? "1" : "0.5" }}>
                        <button onClick={SendEmail} id={styles.send} disabled={filesMap.size == uploadedFiles ? false : true}>Send</button>
                        <button id={styles.dropDownIcon}>
                            <img width={20} src={whiteDropDown} alt="" />
                        </button>
                    </div>

                    {bottomToolOptions.map((each, index) => {

                        return (
                            <div key={index + each.imageUrl} title={each.toolName}
                                onClick={() => handleBottomToolAction(each.toolName)}
                                className={styles.bottomTools} >
                                <img width={20} src={each.imageUrl} alt="" />
                            </div>
                        )
                    })}


                </div>

            </div>
            <HandleToolFunctionlities />

        </>
    )
}

function HandleToolFunctionlities() {

    const { fontFamilyBox, handleFilesSelected, handleOnEmojiClick, InsertFileRef, showEmojiPicker, fontsizebox, colorPickerBox } = UseComposeMailContext();

    return (
        <div>
            <input hidden={true} ref={InsertFileRef} multiple type="file" onChange={handleFilesSelected} />


            {showEmojiPicker &&

                <div style={{ position: "absolute", top: "22%", left: "100px", height: "auto" }}>
                    <EmojiPicker height={400} onEmojiClick={handleOnEmojiClick}
                        theme={Theme.LIGHT}
                    />
                </div>

            }


            {fontFamilyBox &&
                <div className={styles.fontFamilySelection}>
                    <FontFamilyBox />
                </div>
            }

            {fontsizebox &&
                <div className={styles.fontsizeSection}>
                    <FontSizeBox />
                </div>
            }

            {
                colorPickerBox &&
                <div style={{ position: "relative" }}>
                    <ColorPickerBox />
                </div>
            }

        </div>
    )
}



export default ComposeEmailPrompt;
