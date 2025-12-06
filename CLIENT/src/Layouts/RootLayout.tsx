import { Outlet } from "react-router-dom"
import Navbar from "../Components/Navbar"
import LeftSidebar from "../Components/LeftSidebar"
import RightSidebar from "../Components/RightSidebar"
import styles from "@/wwwroot/CSS/rootLayout.module.css";
import { useState } from "react";
function RootLayout() {
  const [isRightOpen, setIsRightOpen] = useState(true);

  return (
    <>
      <Navbar />

      <div className={styles.CenterItemsContainer}>
        <LeftSidebar />

        <div className={styles.OutletWrapper} style={{ width: isRightOpen ? "79%" : "82%" }} >
          <Outlet />
        </div>

        <RightSidebar isRightOpen={isRightOpen} />
      </div>


      <div className={`${styles.barToogler} ${isRightOpen ? styles.activeToogler : styles.hiddenToogler}`}
        onClick={() => setIsRightOpen(prev => !prev)}>
        <img id="arrowLeft" title="hide side panel"
          src="https://ssl.gstatic.com/ui/v1/icons/mail/gm3/2x/chevron_right_baseline_nv700_20dp.png" alt="" />
      </div>
    </>
  )
}

export default RootLayout
