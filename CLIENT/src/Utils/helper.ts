import { previewMailStore } from "./Items";

class Helper {


    formatFileSize(bytes: number): string {
        if (bytes === 0) return "0B";

        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        const value = bytes / Math.pow(1024, i);

        const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);

        return `${formatted}${sizes[i]}`;
    }

    debounce<T extends (...args: any[]) => void>(
        func: T,
        delay: number
    ): (...args: Parameters<T>) => void {
        let timeoutId: ReturnType<typeof setTimeout>;

        return (...args: Parameters<T>) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }

    dateFormatter = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now.getTime() - past.getTime();

        const sec = Math.floor(diffMs / 1000);
        const min = Math.floor(sec / 60);
        const hr = Math.floor(min / 60);
        const day = Math.floor(hr / 24);
        const month = Math.floor(day / 30);
        const year = Math.floor(day / 365);

        if (sec < 60) return `${sec} sec ago`;
        if (min < 60) return `${min} min ago`;
        if (hr < 24) return `${hr} hr ago`;
        if (day < 30) return `${day} day${day > 1 ? "s" : ""} ago`;
        if (month < 12) return `${month} month${month > 1 ? "s" : ""} ago`;
        return `${year} year${year > 1 ? "s" : ""} ago`;
    };

    formatMailDate = (isoString: string): string => {
        const date = new Date(isoString);
        const now = new Date();

        const formattedDate = date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHrs = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHrs / 24);

        let relative = "";
        if (diffDays > 0) {
            relative = `(${diffDays} day${diffDays > 1 ? "s" : ""} ago)`;
        } else if (diffHrs > 0) {
            relative = `(${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago)`;
        } else if (diffMin > 0) {
            relative = `(${diffMin} minute${diffMin > 1 ? "s" : ""} ago)`;
        } else {
            relative = "(just now)";
        }

        return `${formattedDate} ${relative}`;
    }

    getFileIconByExtension = (extension: string) => {
       const lowerExt = "." + extension.toLowerCase();

        const { imageExtensions, videoExtensions, audioExtensions, documentExtensions, AttachmentIcons } = previewMailStore;
        const { imageFile, videoFile, docsFile, docxFile, jsFile, pdfFile, audioFile, textFile } = AttachmentIcons;

        if (imageExtensions.includes(lowerExt)) {
            return imageFile;
        } else if (videoExtensions.includes(lowerExt)) {
            return videoFile;
        } else if (audioExtensions.includes(lowerExt)) {
            return audioFile;
        } else if (documentExtensions.includes(lowerExt)) {
            if (lowerExt === ".pdf") return pdfFile;
            if (lowerExt === "docx") return docxFile;
            if (lowerExt === "js") return jsFile;
            if (lowerExt.startsWith(".xls")) return "📊";
            if (lowerExt.startsWith(".ppt")) return "📽️";
            if (lowerExt.startsWith(".doc") || lowerExt.startsWith(".docs")) return docsFile;
            return textFile;
        }

        return "📄";

    }

    getMainFileIcon = (extension: string) => {

        const lowerExt = "." + extension.toLowerCase();

        const { imageExtensions, videoExtensions, audioExtensions, documentExtensions, MainViewIcons, } = previewMailStore;
        const { FileImage, File, FileAudio, FileText, FileVideo } = MainViewIcons;

        if (imageExtensions.includes(lowerExt)) {
            return FileImage;
        } else if (videoExtensions.includes(lowerExt)) {
            return FileVideo;
        } else if (audioExtensions.includes(lowerExt)) {
            return FileAudio;
        } else if (documentExtensions.includes(lowerExt)) {
            return FileText;
        }

        return File;

    }



}

const helper = new Helper();

export { helper }