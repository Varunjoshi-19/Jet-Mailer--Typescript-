import { ApiEndPoints } from "@/Config/endPoints";
import type { ApiResponsePayload } from "@/Interfaces";


class EmailApiService {

    handleSendEmail = async (emailDataPayload: FormData): Promise<ApiResponsePayload> => {

        if (!emailDataPayload) return { success: false, message: "email data required!!" };

        try {

            const res = await fetch(ApiEndPoints.sendEmail, {
                method: 'POST',
                body: emailDataPayload
            });

            const result = await res.json();
            if (!res.ok) {
                return {

                    success: false,
                    message: result.message,
                    data: result.data
                }
            }
            return {

                success: true,
                message: result.message,
                data: null
            }

        } catch  {
            return {
                success: false,
                message: "Something went wrong failed to send message."
            }
        }


    }


    handleFetchAllEmails = async ({ email }: { email: string }): Promise<ApiResponsePayload> => {
        if (!email.trim()) return { success: false, message: "email is required!!" };

        try {
            const res = await fetch(`${ApiEndPoints.fetchAllEmails}?email=${email}`);
            const result = await res.json();
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message,
                    data: null
                }
            }
            return {
                success: true,
                message: result.message,
                data: result.data
            }

        } catch {
            return {
                success: false,
                message: "Something went wrong failed to fetch emails"
            }
        }

    }


    handleFetchSingleMail = async (mailId: string): Promise<ApiResponsePayload> => {
        if (!mailId.trim()) return { success: false, message: "mail id is required!!" };

        try {
            const res = await fetch(`${ApiEndPoints.fetchSingleEmail}?id=${mailId}`);
            const result = await res.json();
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message,
                    data: null
                }
            }
            return {
                success: true,
                message: result.message,
                data: result.data
            }

        } catch  {
            return {
                success: false,
                message: "Something went wrong failed to fetch email"
            }
        }
    }


    handleFetchDrafts = async ({ email }: { email: string }): Promise<ApiResponsePayload> => {
        if (!email.trim()) return { success: false, message: "email is required!!" };

        try {
            const res = await fetch(`${ApiEndPoints.fetchDrafts}?email=${email}`);
            const result = await res.json();
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message,
                    data: null
                }
            }
            return {
                success: true,
                message: result.message,
                data: result.data
            }

        } catch {
            return {
                success: false,
                message: "Something went wrong failed to fetch drafts"
            }
        }



    }

    handleUpdateExistingDraft = async (emailDataPayload: FormData): Promise<ApiResponsePayload> => {
        
        if (!emailDataPayload) return { success: false, message: "email data required!!" };

        try {

            const res = await fetch(ApiEndPoints.sendEmail, {
                method: 'POST',
                body: emailDataPayload
            });

            const result = await res.json();
            if (!res.ok) {
                return {

                    success: false,
                    message: result.message,
                    data: result.data
                }
            }
            return {

                success: true,
                message: result.message,
                data: null
            }

        } catch {
            return {
                success: false,
                message: "Something went wrong failed to send message."
            }
        }

    }

}


const emailApiService = new EmailApiService();
export default emailApiService;