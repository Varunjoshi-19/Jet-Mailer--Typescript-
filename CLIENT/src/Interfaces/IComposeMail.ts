import type { EmojiClickData } from "emoji-picker-react";
import type { SelectedEmailsForMail, UserContext } from "./user";
import type React from "react";

export interface FileEntry {
    file?: File;
    fileId? : string;
    fileName : string;
    size : number;
    uploadedStatus: boolean;
    blobUrl? : string;
    url?: string;

}



export interface ComposeMailContextProps {

    mailTextFocused: boolean;
    setMailTextFocused: React.Dispatch<React.SetStateAction<boolean>>;

    expandAndOverlayToogle: boolean;
    setExpandAndOverlay: React.Dispatch<React.SetStateAction<boolean>>;

    minimizeAndExpand: boolean;
    setMinimizeAndExpand: React.Dispatch<React.SetStateAction<boolean>>;

    minimzedOrNot: boolean;
    setMinimizedOrNot: React.Dispatch<React.SetStateAction<boolean>>;

    setRecipentMail: React.Dispatch<React.SetStateAction<string>>;

    toFixedToogle: boolean;
    setToFixedToogle: React.Dispatch<React.SetStateAction<boolean>>;

    filesMap: Map<string, FileEntry>;
    setFilesMap: React.Dispatch<React.SetStateAction<Map<string, FileEntry>>>;

    boldActive: boolean;
    setBoldActive: React.Dispatch<React.SetStateAction<boolean>>;

    italicActive: boolean;
    setItalicActive: React.Dispatch<React.SetStateAction<boolean>>;

    underlineActive: boolean;
    setUnderlineActive: React.Dispatch<React.SetStateAction<boolean>>;

    fontFamilyBox: boolean;
    setFontFamilyBox: React.Dispatch<React.SetStateAction<boolean>>;

    textareaRef: React.RefObject<HTMLDivElement | null>;

    setUndoHistory: React.Dispatch<React.SetStateAction<string[]>>;
    setRedoHistory: React.Dispatch<React.SetStateAction<string[]>>;

    InsertFileRef: React.RefObject<HTMLInputElement | null>;

    showEmojiPicker: boolean;
    setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;


    fontFamilyType: string;
    setFontFamilyType: React.Dispatch<React.SetStateAction<string>>;

    fontsizebox: boolean;
    setFontSizeBox: React.Dispatch<React.SetStateAction<boolean>>;

    colorPickerBox: boolean;
    setColorPickerBox: React.Dispatch<React.SetStateAction<boolean>>;

    bodyText: string;
    setBodyText: React.Dispatch<React.SetStateAction<string>>;

    MAX_HISTORY: number;

    bodyTextRef: React.RefObject<string>;


    selectedFontSize: string;
    setSelectedFontSize: React.Dispatch<React.SetStateAction<string>>;


    selectedBGColor: string;
    setSelectedBGColor: React.Dispatch<React.SetStateAction<string>>;

    selectedTextColor: string;
    setSelectedTextColor: React.Dispatch<React.SetStateAction<string>>;

    insertLinkToogle: boolean;
    setInsertLinkToogle: React.Dispatch<React.SetStateAction<boolean>>;

    searchUsers: UserContext[];
    setSearchUsers: React.Dispatch<React.SetStateAction<UserContext[]>>;


    selectedEmailForMail: Map<string, SelectedEmailsForMail> | null;
    setSelectedEmailForMail: React.Dispatch<React.SetStateAction<Map<string, SelectedEmailsForMail> | null>>;

    subject : string;
    setSubject : React.Dispatch<React.SetStateAction<string>>;
  
    uploadedFiles : number;
    setUploadedFiles : React.Dispatch<React.SetStateAction<number>>;

    existingDraftOpened : boolean;
    setExistingDraftOpened : React.Dispatch<React.SetStateAction<boolean>>;


    // FUNCTIONS : 

    handleRemoveAttachMentFile: (fileName: string) => void;
    handleFilesSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeCaretAtEnd: (el: HTMLDivElement) => void;
    handleInput: (e: React.FormEvent<HTMLDivElement>) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    saveCaret: () => { container: Node; offset: number } | null;
    restoreCaret: (pos: { container: Node; offset: number } | null) => void;
    handleOnEmojiClick: (emojiData: EmojiClickData) => void;
    handleFetchUsersOnSearch: (searchedText: string) => void;
    checkExistingDraftOpened : (formData : FormData) => void;
}
