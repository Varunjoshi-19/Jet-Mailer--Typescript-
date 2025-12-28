import React from "react";
import { FcGoogle } from "react-icons/fc";
import styles from "@/wwwroot/CSS/login.module.css";
import { GoogleAuthentication, SaveGoogleCredentails } from "@/Services/GoogleAuth";
import { UseUserContext } from "@/Context/UserContext";

const Login: React.FC = () => {

    const { dispatch } = UseUserContext();

    const handleGoogleLogin = async () => {
        const info = await GoogleAuthentication();
        const { data, success } = info;


        if (!success || !data) return;

        const { token, ...remData } = data;

        const result = await SaveGoogleCredentails(remData);
        if (!result.success) {
            return;
        }

        const dataUser = result.data;
        dispatch({ type: "SAVE_USER", payload: dataUser });
        localStorage.setItem("user-data", JSON.stringify(dataUser));



    }

    return (
        <div className={styles.container}>
            <div className={styles.circleTop}></div>
            <div className={styles.circleBottom}></div>

            <div className={styles.circleTopRight}></div>
            <div className={styles.circleBottomLeft}></div>


            <div className={styles.card}>
                <h1 className={styles.title}>Welcome To</h1>
                <h2 >JET MAILER</h2>
                <p className={styles.subtitle}>Sign in to continue to your inbox</p>
                <button onClick={handleGoogleLogin} className={styles.button}>
                    <FcGoogle size={28} className="animate-bounce" />
                    <span className={styles.buttonText}>Login with Google</span>
                </button>
            </div>
        </div>
    );
};

export default Login;
