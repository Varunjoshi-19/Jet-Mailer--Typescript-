import React, { useEffect, useState } from "react";
import styles from "@/wwwroot/CSS/leftsidebar.module.css";
import ComposeEmailPrompt from "@/Modules/Compose-Mail/index";
import { leftbarUtils } from "@/Utils/Items";
import { useNavigate } from "react-router-dom";
import { UseGlobalContext } from "@/Context/GlobalContext";

interface BarIconsProps {
  url: string;
  name: string;
  count: number;
  navigate: string;
  selected: boolean;
}

const LeftSidebar: React.FC = () => {

  const [composeEmailPrompt, setComposeEmailPrompt] = useState<boolean>(false);
  const { BarIcons } = leftbarUtils;

  const { allMails } = UseGlobalContext();

  const [barIcons, setBarIcons] = useState<BarIconsProps[]>(BarIcons);
  const navigate = useNavigate();

  useEffect(() => {

    (() => {

      setBarIcons(prev => {

        return prev.map(each => {
          if (each.name == "Inbox") {
            each.count = allMails.length;
          }
          return each;
        })

      })

    })();

  }, [allMails]);


  const handleNavigation = (currentName: string, url: string) => {
    setBarIcons((prev) =>
      prev.map((each) => {
        if (each.name === currentName) {
          return { ...each, selected: true };
        } else {
          return { ...each, selected: false };
        }
      })
    );

    navigate(url); // make sure this is from useNavigate()
  };




  return (
    <>
      {composeEmailPrompt && <ComposeEmailPrompt toogleCloseAndOpen={setComposeEmailPrompt} />}
      <div className={styles.sidebar}>
        <div onClick={() => setComposeEmailPrompt(true)} className={styles.compose}>
          <img
            width="18"
            src="https://www.gstatic.com/images/icons/material/system_gm/1x/create_black_24dp.png"
            alt="Compose"
          />
          <span>Compose</span>
        </div>


        {barIcons.map((each, index) => {
          return (
            <div key={`${each.url + index}`} onClick={() => handleNavigation(each.name, each.navigate)}
              className={` ${each.selected ? styles.activeIcon : styles.menuItem}`}>

              <div className={styles.iconAndName}>
                <img
                  width="16"
                  src={each.url}
                  alt={each.name}
                />
                <span>{each.name}</span>
              </div>
              <div className={styles.count}>{each.count}</div>
            </div>
          )
        })}


        <div className={styles.labels}>
          <span>Labels</span>
          <img
            width="16"
            src="https://ssl.gstatic.com/ui/v1/icons/mail/gm3/1x/add_large_baseline_nv700_20dp.png"
            alt="Add Label"
          />
        </div>

        <div className={styles.upgrade}>
          <svg
            viewBox="0 -960 960 960"
            height="16"
            width="16"
            focusable="false"
          >
            <path d="M387-412l35-114l-92-74H444l36-112l36,112H630l-93,74l35,114l-92-71l-93,71ZM240-40V-349q-38-42-59-96T160-560q0-134 93-227t227-93t227,93t93,227q0,61-21,115t-59,96V-40L480-120L240-40ZM480-320q100,0 170-70t70-170T650-730T480-800T310-730T240-560t70,170t170,70ZM320-159l160-41l160,41V-283q-35,20-75.5,31.5T480-240t-84.5-11.5T320-283v124Zm160-62Z"></path>
          </svg>
          <span>Upgrade</span>
          <svg
            height="16"
            width="16"
            viewBox="0 -960 960 960"
            focusable="false"
          >
            <path d="M647-440H160v-80H647L423-744l57-56L800-480L480-160l-57-56L647-440Z"></path>
          </svg>
        </div>

      </div>

    </>
  );
};

export default LeftSidebar;
