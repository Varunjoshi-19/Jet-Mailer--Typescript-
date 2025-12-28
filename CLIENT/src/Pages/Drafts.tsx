import { UseUserContext } from "@/Context/UserContext";
import { EmailsLister, TopBarIcons } from "@/Modules"
import emailApiService from "@/Services/email";
import { useEffect, useState } from "react"


const Drafts = () => {
  const { state: { user } } = UseUserContext();
  const [allDrafts, setAllDrafts] = useState([]);
  useEffect(() => {

    (async () => {
      if (!user) return;
      const result = await emailApiService.handleFetchDrafts({ email: user.email });
      if (result.success && result.data) {
        setAllDrafts(result.data);
        return;
      }

    })();


  }, [])


  return (
    <div>
      <TopBarIcons />
      <EmailsLister allMails={allDrafts} type="Draft" />
    </div>
  )
}

export default Drafts
