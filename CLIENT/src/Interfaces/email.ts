import type { UserContext } from "./user";

export interface SendEmailPayload {

    recieverDetails: Map<string, UserContext>,
    senderDetails: { id: string, email: string };
    mailBodyContent: string;
    subject: string;
    messageSchedule : number;
    category :  string;

}


export interface AttachmentPayload {
    fileId : string, fileUrl: string, fileName: string, contentType: string, size: number 

}
