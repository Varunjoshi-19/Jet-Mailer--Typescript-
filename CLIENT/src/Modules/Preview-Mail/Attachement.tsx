import styles from "./attach.module.css";
import { Cloud, Download } from "lucide-react";
import { useState } from "react";
import { helper } from "@/Utils/helper";
import type {  AttachmentPayload } from "@/Interfaces/email";

interface AttachementProps { 
    attachment : AttachmentPayload
}

const Attachement = ({ attachment }: AttachementProps) => {

    const [hoveredView, setHoveredView] = useState<boolean>(false);
    const actions = [
        {
            name: "download",
            icon: Download,
            callbackFunc: () => { }
        },
        {
            name: "drive",
            icon: Cloud,
            callbackFunc: () => { }

        }
    ]

    const FileIcon = helper.getMainFileIcon(attachment.contentType);
    const icon = helper.getFileIconByExtension(attachment.contentType);

    return (
        <>
            
            <div className={styles.card} onMouseEnter={() => setHoveredView(true)} onMouseLeave={() => setHoveredView(false)}>
                {
                    hoveredView ?
                        <div className={styles.otherView}>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <img src={icon} alt="" width={15} />
                                <span>{attachment.fileName}</span>
                            </div>
                            <span style={{ marginLeft: "20px", color: "rgb(169, 169, 169)" }}>{helper.formatFileSize(attachment.size)}</span>

                            <div className={styles.options}>
                                {actions.map(each => {
                                    const Icon = each.icon;
                                    return (

                                        <Icon cursor={"pointer"} />
                                    )
                                })}
                            </div>
                        </div>
                        :
                        <>
                            <div className={styles.preview}>
                                <FileIcon size={40} color="gray" />
                            </div>
                            <div className={styles.filename}>
                                <img src={icon} alt="" width={20} />
                                <span>{attachment.fileName.toString().substring(0, 20)}</span>
                            </div>
                        </>

                }

                <div className={styles.corner}>
                    <div className={styles.fold}></div>
                </div>
            </div>

        </>
    );
};

export default Attachement;
