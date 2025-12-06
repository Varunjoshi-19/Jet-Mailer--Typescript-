import React from "react";
import styles from "@/wwwroot/CSS/rightsidebar.module.css";

interface RightSidebarProps {
  isRightOpen: boolean;
}

const rightSideItems = [
  { imageUrl: "https://www.gstatic.com/companion/icon_assets/calendar_2020q4_2x.png", iconName: "Calendar" },
  { imageUrl: "https://www.gstatic.com/companion/icon_assets/keep_2020q4v3_2x.png", iconName: "Keep" },
  { imageUrl: "https://www.gstatic.com/companion/icon_assets/tasks_2021_2x.png", iconName: "Tasks" },
  { imageUrl: "https://www.gstatic.com/companion/icon_assets/contacts_2022_2x.png", iconName: "Contacts" },
  { imageUrl: "https://fonts.gstatic.com/s/i/googlematerialicons/add/v21/black-24dp/1x/gm_add_black_24dp.png", iconName: "PlusAdd" },
];

const RightSidebar: React.FC<RightSidebarProps> = ({ isRightOpen  }) => {
  return (
    <div className={`${styles.rightSideIconsContainer} ${!isRightOpen ? styles.rightHidden : ""}`}>
      <div className={styles.rightTopSideIconsContainer}>
        {rightSideItems.map((item, index) => (
          <div key={index}>
            {index === rightSideItems.length - 1 ? (
              <div style={{ width: "30px", borderTop: "1px solid rgb(34,34,34)" }}>
                <img src={item.imageUrl} alt={item.iconName} />
              </div>
            ) : (
              <img src={item.imageUrl} alt={item.iconName} />
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default RightSidebar;
