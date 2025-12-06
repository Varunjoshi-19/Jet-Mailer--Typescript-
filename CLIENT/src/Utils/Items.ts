import markRead from "@/Assets/mark.png";
import archieveLogo from "@/Assets/archieve.png";
import docxLogo from "@/Assets/file-icons/docx-file.png";
import jsLogo from "@/Assets/file-icons/javascript.png";
import pdfLogo from "@/Assets/file-icons/pdf.png";
import docsLogo from "@/Assets/file-icons/google-docs.png";

import {
    FileText,
    FileImage,
    FileAudio,
    FileVideo,
    FileArchive,
    FileType,
    File,
} from "lucide-react";



class NewMessageIcons {


    icons = [
        { name: "minimize", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/ic_minimize_16px_1x.png" },
        { name: "expand", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/ic_open_in_full_16px_1x.png" },
        { name: "close", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/ic_close_16px_1x.png" }
    ]

    ToptoolOptions = [
        { toolName: "undo", imageIcon: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/undo_baseline_nv700_20dp.png" },
        { toolName: "redo", imageIcon: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/redo_baseline_nv700_20dp.png" },
        { toolName: "font", imageIcon: "", text: "Sans Serif" },
        { toolName: "size", imageIcon: "https://www.gstatic.com/images/icons/material/system_gm/2x/format_size_black_20dp.png", },
        { toolName: "bold", imageIcon: "https://www.gstatic.com/images/icons/material/system_gm/2x/format_bold_black_20dp.png" },
        { toolName: "italic", imageIcon: "https://www.gstatic.com/images/icons/material/system_gm/2x/format_italic_black_20dp.png" },
        { toolName: "underline", imageIcon: "https://www.gstatic.com/images/icons/material/system_gm/2x/format_underlined_black_20dp.png" },
        { toolName: "text-color", imageIcon: "https://www.gstatic.com/images/icons/material/system_gm/2x/text_format_black_20dp.png" },
        { toolName: "moreOptions", imageIcon: "https://www.gstatic.com/images/icons/material/system_gm/2x/arrow_drop_down_black_20dp.png" },


    ]

    bottomToolOptions = [
        { toolName: "formatting-options", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/match_case_baseline_nv700_20dp.png" },
        { toolName: "attach-files", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/attach_file_baseline_nv700_20dp.png" },
        { toolName: "insert-link", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/link_baseline_nv700_20dp.png" },
        { toolName: "emoji", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/mood_baseline_nv700_20dp.png" },
        { toolName: "insert-file-using-drive", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/drive_baseline_nv700_20dp.png" },
        { toolName: "insert-photo", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/image_baseline_nv700_20dp.png" },
        { toolName: "toggle-confidential-mode", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/lock_clock_baseline_nv700_20dp.png" },
        { toolName: "insert-signature", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/ink_pen_baseline_nv700_20dp.png" },
        { toolName: "more-options", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/more_vert_baseline_nv700_20dp.png" },
        { toolName: "discard-draft", imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/delete_baseline_nv700_20dp.png" },
    ];


    dropDown = "https://www.gstatic.com/images/icons/material/system_gm/2x/arrow_drop_down_black_20dp.png";
    whiteDropDown = "https://www.gstatic.com/images/icons/material/system_gm/2x/arrow_drop_down_white_20dp.png";
    dropDownType = ["font", "size", "text-color"];



    BOTTOM_TOOL_NAMES = {
        "FORMATTING-OPTIONS": "FORMATTING-OPTIONS",
        "ATTACH-FILES": "ATTACH-FILES",
        "INSERT-LINK": "INSERT-LINK",
        "EMOJI": "EMOJI",
        "INSERT-FILE-USING-DRIVE": "INSERT-FILE-USING-DRIVE",
        "INSERT-PHOTO": "INSERT-PHOTO",
        "TOGGLE-CONFIDENTIAL-MODE": "TOGGLE-CONFIDENTIAL-MODE",
        "INSERT-SIGNATURE": "INSERT-SIGNATURE",
        "MORE-OPTIONS": "MORE-OPTIONS",
        "DISCARD-DRAFT": "DISCARD-DRAFT"
    };


    TOP_TOOL_NAMES = {
        "UNDO": "UNDO",
        "REDO": "REDO",
        "FONT": "FONT",
        "SIZE": "SIZE",
        "BOLD": "BOLD",
        "ITALIC": "ITALIC",
        "UNDERLINE": "UNDERLINE",
        "TEXT-COLOR": "TEXT-COLOR",
        "MORE-OPTIONS": "MORE-OPTIONS"
    };


    FONT_OPTIONS = ["Arial", "Times New Roman", "Courier New", "Verdana"];


    colors = [
        "#000000", "#444444", "#666666", "#999999", "#cccccc", "#eeeeee", "#ffffff",
        "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#9900ff", "#ff00ff",
        "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc",
        "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd",
        "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0",
        "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79",
        "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47",
        "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130",
    ];

    fontFamiliesMap = new Map<string, string>([
        ["sans-serif", "Arial, Sans Serif"],
        ["serif", "Serif"],
        ["monospace", "Fixed Width"],
        ['"Arial Black"', "Wide"],
        ['"Arial Narrow"', "Narrow"],
        ['"Comic Sans MS"', "Comic Sans MS"],
        ["Garamond", "Garamond"],
        ["Georgia", "Georgia"],
        ["Tahoma", "Tahoma"],
        ['"Trebuchet MS"', "Trebuchet MS"],
        ["Verdana", "Verdana"],
    ]);





}

class LeftSideBarUitls {


    BarIcons = [
        { name: "Inbox", navigate: "/mail/inbox", url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/inbox_fill_baseline_p900_20dp.png", count: 0, selected: true },
        { name: "Starred", navigate: "/mail/starred", url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/star_baseline_nv700_20dp.png", count: 0, selected: false },
        { name: "Snoozed", navigate: "/mail/snoozed", url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/schedule_baseline_nv700_20dp.png", count: 0, selected: false },
        { name: "Sent", navigate: "/mail/sent", url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/send_baseline_nv700_20dp.png", count: 0, selected: false },
        { name: "Draft", navigate: "/mail/draft", url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/draft_baseline_nv700_20dp.png", count: 0, selected: false },
        { name: "Purchases", navigate: "/mail/purchases", url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/shopping_bag_baseline_nv700_20dp.png", count: 0, selected: false },
        { name: "Archieve", navigate: "/mail/archieve", url: archieveLogo, count: 5, selected: false },


    ]


}

class InboxBarItems {

    ppsuIcons = [
        {
            optionName: "Primary",
            newMailColor: "#188038",
            lastMail: "Meeting scheduled at 3 PM 📅",
            totalMailCount: 0,
            select: true,
            activeImageUrl:
                "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/inbox_fill_baseline_p600_20dp.png",
            imageUrl:
                "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/inbox_baseline_nv700_20dp.png",
        },
        {
            optionName: "Promotions",
            newMailColor: "#188038",
            lastMail: "50% discount just for you 🎉",
            totalMailCount: 0,
            select: false,
            activeImageUrl:
                "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/sell_fill_baseline_p600_20dp.png",
            imageUrl:
                "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/sell_baseline_nv700_20dp.png",
        },
        {
            optionName: "Social",
            newMailColor: "#E37400",
            lastMail: "John mentioned you in a post 📢",
            totalMailCount: 0,
            select: false,
            activeImageUrl:
                "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/group_fill_baseline_p600_20dp.png",
            imageUrl:
                "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/group_baseline_nv700_20dp.png",
        },
        {
            optionName: "Updates",
            newMailColor: "#E37400",
            lastMail: "System update available ⚡",
            totalMailCount: 0,
            select: false,
            activeImageUrl:
                "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/info_fill_baseline_p600_20dp.png",
            imageUrl:
                "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/info_baseline_nv700_20dp.png",
        },
    ]

    Hovericons = [
        {
            name: "delete",
            url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/delete_baseline_nv700_20dp.png",
        },
        {
            name: "archive",
            url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/archive_baseline_nv700_20dp.png",
        },
        {
            name: "message",
            url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/drafts_baseline_nv700_20dp.png",
        },
        {
            name: "snooze",
            url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/schedule_baseline_nv700_20dp.png",
        },
    ];

}

class PreivewMailStore {

    Topicons = [
        {
            name: "back",
            url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/arrow_back_baseline_nv700_20dp.png"
        },
        {
            name: "archive",
            url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/archive_baseline_nv700_20dp.png"
        },
        {
            name: "report",
            url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/report_baseline_nv700_20dp.png"
        },
        {
            name: "delete",
            url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/delete_baseline_nv700_20dp.png"
        },
        {
            name: "markRead",
            url: markRead,
            style: { width: "21px", opacity: "0.6" }
        },
        {
            name: "move",
            url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/drive_file_move_outline_baseline_nv700_20dp.png"
        },
        {
            name: "more",
            url: "https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/more_vert_baseline_nv700_20dp.png"
        }
    ];

    AttachmentIcons = {
        textFile: docsLogo,
        imageFile: "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_image_x32.png",
        audioFile: "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_audio_x32.png",
        videoFile: "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_video_x32.png",
        docxFile: docxLogo,
        docsFile: docsLogo,
        pdfFile: pdfLogo,
        jsFile: jsLogo
    }

    MainViewIcons = {
        FileText,
        FileImage,
        FileAudio,
        FileVideo,
        FileArchive,
        FileType,
        File,
    }




    documentExtensions: string[] = [
        ".pdf", ".doc", ".docx", ".dot", ".dotx", ".odt", ".ott", ".rtf", ".txt", ".csv",
        ".xls", ".xlsx", ".xlsm", ".xlt", ".xltx", ".ods", ".ots", ".ppt", ".pptx",
        ".pps", ".odp", ".otp", ".xml", ".json", ".md", ".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".iso",
        ".html", ".htm", ".css", ".js", ".ts", ".tsx", ".jsx", ".c", ".cpp",
        ".java", ".py", ".json", ".xml", ".sql", ".yaml", ".yml", ".ini", ".log", ".epub", ".mobi", ".azw", ".azw3",
        ".ics", ".vcf"
    ];

    imageExtensions: string[] = [
        ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".tiff", ".svg",
        ".webp", ".ico", ".heic"
    ];

    audioExtensions: string[] = [
        ".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".aif", ".aiff"
    ];

    videoExtensions: string[] = [
        ".mp4", ".mov", ".avi", ".mpeg", ".mpg", ".mkv", ".wmv", ".webm", ".ogv", ".qt"
    ];

    blockedFileExtensions: string[] = [
        ".ade", ".adp", ".apk", ".appx", ".appxbundle", ".bat", ".cab", ".chm", ".cmd", ".com", ".cpl",
        ".diagcab", ".diagcfg", ".diagpkg", ".dll", ".dmg", ".ex", ".ex_", ".exe", ".hta", ".img", ".ins",
        ".iso", ".isp", ".jar", ".jnlp", ".js", ".jse", ".lib", ".lnk", ".mde", ".mjs", ".msc", ".msi",
        ".msix", ".msixbundle", ".msp", ".mst", ".nsh", ".pif", ".ps1", ".scr", ".sct", ".shb", ".sys",
        ".vb", ".vbe", ".vbs", ".vhd", ".vxd", ".wsc", ".wsf", ".wsh", ".xll"
    ];

    allAllowedExtensions: string[] = [
        ...this.documentExtensions,
        ...this.imageExtensions,
        ...this.audioExtensions,
        ...this.videoExtensions,
    ];


}

const newMessagePromptIcons = new NewMessageIcons();
const leftbarUtils = new LeftSideBarUitls();
const inboxUtilsItems = new InboxBarItems();
const previewMailStore = new PreivewMailStore();

export { newMessagePromptIcons, leftbarUtils, inboxUtilsItems, previewMailStore }