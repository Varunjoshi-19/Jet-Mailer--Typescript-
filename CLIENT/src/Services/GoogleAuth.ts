import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "@/Config/firebase";
import { ApiEndPoints } from '@/Config/endPoints';

export const GoogleAuthentication = async () => {

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (!result.user || result.user == undefined) {
        return { data: null, success: false };
    }

    const token = await result.user.getIdToken();

    const userData = {
        googleId: result.user.uid,
        username: result.user.displayName || "",
        email: result.user.email || "",
        profilePicture: result.user.photoURL || undefined,
        locale: undefined,
        verifiedEmail: result.user.emailVerified,
        token

    };

    return {
        data: userData,
        success: true
    }
}

export const SaveGoogleCredentails = async (data: any) => {

    try {


        const res = await fetch(ApiEndPoints.googleLoginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            return {
                data: result.user,
                success: true,
                message: "Logged in successfully!"
            }
        }

        return {
            data: null,
            success: false,
            message: "failed to login!"
        }


    } catch (error: any) {
        return {
            data: null,
            success: false,
            message: error.message
        }

    }


}