import { ChevronDownIcon, Keyboard } from "lucide-react"
import styles from "./index.module.css";
import { useEffect, useRef, useState } from "react";
import type { MailItem, MailItemDraft } from "@/Interfaces/IContext/globalContext";
import { useNavigate } from "react-router-dom";
import { UseUserContext } from "@/Context/UserContext";
import { helper } from "@/Utils/helper";
import { inboxUtilsItems } from "@/Utils/Items";
import ComposeEmailPrompt from "./Compose-Mail";
import { UseComposeMailContext } from "@/Context/ComposeMailContext";

export const TopBarIcons = () => {
    const totalMails = 271;

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [dropDownList, setDropDownList] = useState<boolean>(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropDownList(false);
            }
        }

        if (dropDownList) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropDownList]);



    return (

        <div className={styles.topUtilIcons}>

            <div className={styles.leftSideUtils}>

                <div className={styles.selectLinkDown}>
                    <input type="checkbox" />
                    <div ref={dropdownRef} className={styles.downIcon}>
                        <ChevronDownIcon onClick={() => setDropDownList(prev => !prev)} size={14} />
                        <div style={{ display: dropDownList ? "block" : "none" }} className={styles.dropdownContent}>
                            <a href="#">All</a>
                            <a href="#">None</a>
                            <a href="#">Read</a>
                            <a href="#">Unread</a>
                            <a href="#">Starred</a>
                            <a href="#">Unstarred</a>
                        </div>
                    </div>

                </div>

                <img style={{ objectFit: "contain", width: "22px" }}
                    src="https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/refresh_baseline_nv700_20dp.png"
                    alt=""
                />
                <img style={{ objectFit: "contain", width: "22px" }}
                    src="https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/more_vert_baseline_nv700_20dp.png"
                    alt=""
                />

            </div>

            <div className={styles.rightSideUtils}>

                <div className={styles.mailPages}>
                    <span>1-50</span>
                    <span>of</span>
                    <span>{totalMails}</span>
                    <div className={styles.newAndOld}>
                        <span>NEWEST</span>
                        <span>OLDEST</span>
                    </div>
                </div>

                <div className={styles.movePages}>
                    <img
                        src="https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/chevron_left_baseline_nv700_20dp.png"
                        alt="newer"
                    />
                    <img
                        src="https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/chevron_right_baseline_nv700_20dp.png"
                        alt="older"
                    />
                </div>

                <div className={styles.keyboardAndItemSelect}>
                    <Keyboard size={18} />
                    <img
                        style={{ width: "18px" }}
                        src="https://www.gstatic.com/images/icons/material/system_gm/2x/arrow_drop_down_black_20dp.png"
                        alt=""
                    />
                </div>

            </div>


        </div>
    )



}

interface EmailListerProps {
    allMails: MailItem[];
    type: string;
}


export const EmailsLister = ({ allMails, type }: EmailListerProps) => {

    const { Hovericons } = inboxUtilsItems;
    const [composeEmailPrompt, setComposeEmailPrompt] = useState<boolean>(false);
    const [starred, setStarred] = useState<Set<number>>(new Set());
    const navigate = useNavigate();
    const { state: { user } } = UseUserContext();
    const { setExpandAndOverlay, textareaRef, setSubject, setFilesMap, setSelectedEmailForMail } = UseComposeMailContext();

    const toggleStar = (index: number) => {
        setStarred((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const handleOpenMail = (mailId: string) => {
        navigate(`/mail/inbox/${mailId}`);
    }

    const handleOpenEditorWithMaxScreen = (mail: MailItemDraft) => {
        setExpandAndOverlay(true);
        setComposeEmailPrompt(true);

        if (mail.mailBodyContent && textareaRef.current) textareaRef.current.innerHTML = mail.mailBodyContent;
        if (mail.subject) setSubject(mail.subject);
        if (mail.attachments && mail.attachments.length > 0) {
            setFilesMap((prev) => {
                const copy = new Map(prev);
                const files = mail.attachments;
                if (files) {
                    files.forEach((file) => {
                        const key = Date.now() + file.fileName;
                        copy.set(key, { url: file.fileUrl, uploadedStatus: true, fileId: file.fileId, fileName: file.fileName, size: file.size });

                    });
                }

                return copy;
            });
        }

        if (mail.receiverRef) {
            setSelectedEmailForMail(prev => {
                const copy = new Map(prev);

                mail.receiverRef.map(each => {
                    copy.set(each.id._id, { email: each.email, profilePicture: each.id.profilePicture, _id: each.id._id })
                })
                return copy;
            })
        }




    }


    return (

        <>
            {composeEmailPrompt && <ComposeEmailPrompt toogleCloseAndOpen={setComposeEmailPrompt} />}
            <div className={styles.inboxContainer}>

                {allMails.map((mail: any, index) => (
                    <div onClick={() => type == "Draft" ? handleOpenEditorWithMaxScreen(mail) : handleOpenMail(mail._id)} key={index} className={styles.emailRow}>
                        <input type="checkbox" className={styles.checkbox} />

                        <span
                            className={`${styles.star} ${starred.has(index) ? styles.active : ""}`}
                            onClick={() => toggleStar(index)}
                        >
                            {starred.has(index) ? "★" : "☆"}
                        </span>


                        {
                            type == "Draft" ?
                                <span className={styles.emailSender} style={{ color: "red", fontWeight: "lighter" }}>Draft</span>
                                :
                                <span className={styles.emailSender}>
                                    {user?.email === mail.senderRef?.id?.email ? "Me" : mail.senderRef?.id?.username}
                                </span>
                        }

                        <span className={styles.emailSubject}>
                            <b>{mail?.subject ? `${mail.subject}` : "(no subject)"}</b>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: `${mail?.mailBodyContent ? ` - ${mail?.mailBodyContent.substring(0, 50)}.....` : ""}`,
                                }}
                            >
                            </span>
                        </span>

                        <span className={styles.emailDate}>{helper.dateFormatter(mail.createdAt)}</span>
                        <div className={styles.hoverActions}>
                            {Hovericons.map(icon => (
                                <button title={icon.name} ><img src={icon.url} alt="archive" /></button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )


}







