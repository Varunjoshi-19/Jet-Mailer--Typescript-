import dotenv from "dotenv";
dotenv.config();

const fallbackUrls = {
    fallbackPort: 4000,
    fallbackMongoUrl: "mongodb://root:varun@127.0.0.1:27017/jetMailer?authSource=admin"
}

const AppConfig = {
    mongodbUrl: process.env.MONGODB_URI! || fallbackUrls.fallbackMongoUrl,
    serverPort: process.env.PORT! || fallbackUrls.fallbackPort,
    appwriteEndPoint: process.env.VITE_APPWRITE_ENDPOINT!,
    appwriteProjectId: process.env.VITE_APPWRITE_PROJECT_ID!,
    bucketId: process.env.VITE_APPWRITE_BUCKET_ID!
}


export { fallbackUrls, AppConfig } 