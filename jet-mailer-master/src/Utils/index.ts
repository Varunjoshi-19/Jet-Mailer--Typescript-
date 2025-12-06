import { Client, ID, InputFile, Storage } from "node-appwrite";
import { Readable } from "stream";
import DbConnections from "../Databases/connection";
import { AppConfig } from "../Config/appConfig";
import { autoInjectable } from "tsyringe";

@autoInjectable()
class HelperService {


    handleUploadFile = async (file: Express.Multer.File) => {

        const connection = new DbConnections();
        const client: Client = connection.GetAppWriteConnection();
        const storage = new Storage(client);
        const fileObject = new InputFile(
            Readable.from(file.buffer),
            file.originalname,
            Buffer.byteLength(file.buffer)
        );


        try {
            const result = await storage.createFile(
                AppConfig.bucketId,
                ID.unique(),
                fileObject
            );


            const fileUrl = `${AppConfig.appwriteEndPoint}/storage/buckets/${AppConfig.bucketId}/files/${result.$id}/view?project=${AppConfig.appwriteProjectId}`;

            return {
                imageUrl: fileUrl,
                fileId: result.$id,
                success: true
            };
        } catch (error) {
            console.error("Upload error:", error);
            return {
                message: "Failed to upload file",
                success: false
            };
        }


    }

   


}

export default HelperService;
