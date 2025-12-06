import { Client, Storage } from "appwrite";
import { ApiEndPoints } from "./endPoints";
const { appwriteEndPoint, appwriteProjectId } = ApiEndPoints;
const client = new Client()
    .setEndpoint(appwriteEndPoint)
    .setProject(appwriteProjectId)

export const storage = new Storage(client);