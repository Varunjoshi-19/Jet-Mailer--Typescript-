const fallbackUrl = "http://localhost:4000";
const BACKEND_URL = import.meta.env.BACKEND_URL || fallbackUrl;

const BASE_URL = `${BACKEND_URL}/api`;

const ApiEndPoints = {
    googleLoginUrl: `${BASE_URL}/account/login`,
    fetchUsers: `${BASE_URL}/user/fetch-users`,
    sendEmail: `${BASE_URL}/mail/send-mail`,
    fetchAllEmails: `${BASE_URL}/mail/fetch-emails`,
    fetchSingleEmail: `${BASE_URL}/mail/fetch-single-email`,
    fetchDrafts: `${BASE_URL}/mail/fetch-drafts`,
    updateDraft: `${BASE_URL}/mail/update-draft`,
    appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    appwriteEndPoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
    appwriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID
};

export { ApiEndPoints, BACKEND_URL };
