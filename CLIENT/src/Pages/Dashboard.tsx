import React, { useEffect, useState } from "react";
import styles from "@/wwwroot/CSS/dashboard.module.css";
import { UseUserContext } from "@/Context/UserContext";
import emailApiService from "@/Services/email";
import { UseGlobalContext } from "@/Context/GlobalContext";
import type { PPSUOption } from "@/Interfaces/IDashboard/inbox";
import { inboxUtilsItems } from "@/Utils/Items";
import { EmailsLister, TopBarIcons } from "@/Modules";


const Dashboard: React.FC = () => {
  const { ppsuIcons } = inboxUtilsItems;

  const { state: { user } } = UseUserContext();
  const { allMails, setAllMails } = UseGlobalContext();

  const [ppsus, setPpsus] = useState<PPSUOption[]>(ppsuIcons);

  const handlePPSUClick = (index: number) => {
    setPpsus((prev) =>
      prev.map((pps, i) => ({
        ...pps,
        select: i === index,
      }))
    );
  };




  useEffect(() => {

    (async () => {
      if (!user) return;
      const result = await emailApiService.handleFetchAllEmails({ email: user.email });
      if (!result.success) return;

      if (result.success && result.data) {
        setAllMails(result.data);
        const totalMails = result.data.length;
        setPpsus(prev => {
          return prev.map(each => {
            if (each.optionName == "Primary") {
              each.totalMailCount = totalMails;
              each.lastMail = result.data[0]?.subject;
            }

            return each;
          })
        })
        console.log("all fetched mails", result.data);
      }
    })();

  }, [])




  return (
    <>
      <TopBarIcons />
      <div className={styles.inboxAndPPSUContainer}>
        <div className={styles.ppsuwrapper}>
          {ppsus.map((pps, index) => (
            <div
              key={index}
              className={`${styles.tab} ${pps.select ? styles.active : ""}`}
              onClick={() => handlePPSUClick(index)}
            >
              <img width={16} src={pps.select ? pps.activeImageUrl : pps.imageUrl} alt="" />
              <span>{pps.optionName}</span>
              <span className={styles.latestMail}>{pps.lastMail?.substring(0, 30)}...</span>
              {pps.totalMailCount > 0 && <span
                className={styles.newMail}
                style={{ backgroundColor: pps.newMailColor }}
              >
                {pps.totalMailCount} new
              </span>}
            </div>
          ))}
        </div>

        <EmailsLister allMails={allMails} type="inbox" />

      </div>
    </>
  );
};

export default Dashboard;
