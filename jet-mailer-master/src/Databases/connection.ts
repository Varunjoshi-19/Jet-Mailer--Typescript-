import mongoose from "mongoose";
import { AppConfig } from "../Config/appConfig";
import { Client } from "node-appwrite";
class DbConnections {


    #appwriteClient: Client | null;

    constructor() {
        this.#appwriteClient = null
    }

    async GetMongodbConnection() {
        try {
            await mongoose.connect(AppConfig.mongodbUrl);
            console.log("✅ MongoDB connected successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(" MongoDB connection failed:", error.message);
                throw error;
            }
            throw new Error("Unknown error occurred while connecting with mongodb database!");
        }

    }

    GetAppWriteConnection() {

        if (this.#appwriteClient != null) {
            return this.#appwriteClient;

        }

        this.#appwriteClient = new Client();

        this.#appwriteClient
            .setEndpoint(AppConfig.appwriteEndPoint)
            .setProject(AppConfig.appwriteProjectId)

        return this.#appwriteClient;
    }


}


export default DbConnections;