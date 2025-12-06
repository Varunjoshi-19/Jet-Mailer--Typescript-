import { useNavigate, useParams } from "react-router-dom";
import styles from "@/wwwroot/CSS/mail.module.css";
import { Printer, ExternalLink, Star, Smile, Reply, MoreVertical } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import emailApiService from "@/Services/email";
import { helper } from "@/Utils/helper";
import { UseGlobalContext } from "@/Context/GlobalContext";
import type { MailItem } from "@/Interfaces/IContext/globalContext";
import { previewMailStore } from "@/Utils/Items";
import Attachement from "@/Modules/Preview-Mail/Attachement";
import ViewAttachment from "@/Modules/Preview-Mail/ViewAttachment";
import type { AttachmentPayload } from "@/Interfaces/email";



function PreviewMail() {

  const { mailId } = useParams();
  const navigate = useNavigate();
  const mailBodyRef = useRef<HTMLDivElement>(null);

  const { allMails } = UseGlobalContext();
  const { Topicons } = previewMailStore;

  const [currentEmail, setCurrentEmail] = useState<MailItem | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<AttachmentPayload | null>(null);

  const FetchCurrentMail = useCallback(async () => {
    try {
      if (!mailId || typeof mailId != "string") return;

      const mail = allMails.find(each => each._id == mailId);
      if (mail) {
        console.log("Fetched from list", mail);
        setCurrentEmail(mail);
        return;
      }

      const result = await emailApiService.handleFetchSingleMail(mailId);
      if (!result.success) {
        setCurrentEmail(null);
        navigate("/mail/inbox");
        return;
      }
      console.log("current fetched email", result.data);
      setCurrentEmail(result.data);

    } catch (error) {

    } finally {

    }


  }, [mailId]);


  useEffect(() => {
    FetchCurrentMail();


  }, [mailId]);

  useEffect(() => {
    handleRenderMailContent();
  }, [currentEmail])

  const handleRenderMailContent = () => {
    if (currentEmail?.mailBodyContent && mailBodyRef.current) {
      mailBodyRef.current.innerHTML = currentEmail.mailBodyContent.replace(/style="[^"]*"/g, "");
    }

  }



  if (currentEmail != null) {
    return (
      <>

        {selectedAttachment && <ViewAttachment onClose={setSelectedAttachment} attachment={selectedAttachment} />}

        <div className={styles.topIconContainer}>

          {Topicons.map((icon) => (
            <div
              onClick={icon.name === "back" ? () => window.history.back() : undefined}
              title={icon.name} className={styles.eachIcon}>
              <img
                key={icon.name}
                src={icon.url}
                alt={icon.name}
                style={icon.style || {}}

              />
            </div>
          ))}

        </div>

        <div className={styles.mainContainer}>

          <div className={styles.mailHeader}>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span className={styles.subject}>
                {currentEmail.subject}
              </span>

              <span className={styles.tag}>Inbox</span>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Printer size={15} />
              <ExternalLink size={15} />
            </div>

          </div>

          <div className={styles.senderRow}>

            <div className={styles.logoAndEmailDetails}>
              <img
                className={styles.avatar}
                src={currentEmail.senderRef.id.profilePicture}
                alt="Sender avatar"
                onError={(e) => {
                  e.currentTarget.src = "https://www.gravatar.com/avatar/?d=mp&s=50";
                }}
              />

              <div className={styles.senderInfo}>
                <div className={styles.senderTop}>
                  <span className={styles.senderName}>{currentEmail.senderRef.id.username}</span>
                  <span className={styles.senderEmail}>&lt;{currentEmail.senderRef.id.email}&gt;</span>
                </div>
                <span className={styles.toMe}>to me ▾</span>
              </div>
            </div>

            <div className={styles.headerRight}>
              <span className={styles.date}>{helper.formatMailDate(currentEmail.createdAt)}</span>
              <Star size={15} />
              <Smile size={15} />
              <Reply size={15} />
              <MoreVertical size={15} />
            </div>
          </div>



          <div ref={mailBodyRef} className={styles.mailBody}></div>

          <div style={{ display: "flex", gap: "5px", fontSize: "13px" }}>
            <span>[Message clipped]  </span>
            <a style={{ textDecoration: "underline", color: "blue" }} href="">View entire message</a>
          </div>


          { currentEmail.attachments && currentEmail.attachments.length > 0 &&  
            <>
              <hr style={{ color: "gray", opacity: "0.5" }} />

              <div style={{ display: "flex", gap: "5px" }}>
                <span style={{ fontWeight: "bolder" }}>
                  {currentEmail.attachments?.length} {currentEmail.attachments.length > 1 ? "attachments" : "attachment"}
                </span>
                <span>
                  • Scanned by Jet-Mailer
                </span>
                <img src="https://ssl.gstatic.com/ui/v1/icons/mail/saferwithgoogle/info_outline_grey700_16px_1x.png" 
                 style={{ width : "15px"  , objectFit : "contain" }}
                alt="" />
              </div>
            </>
          }

          <div className={styles.allAttachments}>
            {currentEmail.attachments?.map((attachment) => (
              <div onClick={() => setSelectedAttachment(attachment)} >
                <Attachement attachment={attachment} />
              </div>
            ))}
          </div>






          <div className={styles.actionBar}>
            <button className={styles.reply}>↩ Reply</button>
            <button className={styles.forward}>⤴ Forward</button>
            <button className={styles.smiley}>😊</button>
          </div>
        </div>






      </>
    );
  }

}

export default PreviewMail;
