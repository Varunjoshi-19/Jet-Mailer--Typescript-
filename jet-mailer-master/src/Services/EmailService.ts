import { autoInjectable } from "tsyringe";
import { ApiResponse, SendEmailRequestBody } from "../DTOs/email";
import IEmailService from "../Interfaces/IServices/IEmailService";
import emailModel from "../Models/emailModel";
import HelperService from "../Utils";
import mongoose from "mongoose";
import SocketConnection from "../Socket/socket";

@autoInjectable()
class EmailService implements IEmailService {


    constructor(private socketConn: SocketConnection) { }

    SendEmail = async (payload: Partial<SendEmailRequestBody>): Promise<ApiResponse> => {
        try {
            const {
                senderDetails,
                recieverDetails,
                subject,
                mailBodyContent,
                category,
                messageSchedule,
                attachments,
                type,
            } = payload;

            console.log("this is the payload", payload);

            if (type === "Sent") {
                if (
                    !recieverDetails ||
                    !senderDetails ||
                    recieverDetails.length === 0 ||
                    !subject?.trim() ||
                    !mailBodyContent?.trim()
                ) {
                    return {
                        success: false,
                        message: "Missing required email fields.",
                    };
                }
            }

            if (type === "Draft") {
                const isValidDraft = this.checksForDraft(payload);
                if (!isValidDraft) {
                    return {
                        success: false,
                        message: "Draft is empty or missing required fields.",
                    };
                }
            }

            const parsedSender = JSON.parse(senderDetails!);

            const newEmail = new emailModel({
                senderRef: {
                    id: parsedSender.id,
                    email: parsedSender.email
                },
                subject,
                mailBodyContent,
                category,
                lastUpdatedAt: Date.now(),
            });

            newEmail.sendStatus = type!;

            if (recieverDetails) {
                if (typeof recieverDetails == "string") {
                    const parsedReceiver = JSON.parse(recieverDetails);
                    newEmail.receiverRef.push({
                        id: new mongoose.Types.ObjectId(parsedReceiver.id),
                        email: parsedReceiver.email
                    });
                }
                else {
                    for (const receiver of recieverDetails) {
                        const parsedReceiver = JSON.parse(receiver);
                        newEmail.receiverRef.push({
                            id: new mongoose.Types.ObjectId(parsedReceiver.id),
                            email: parsedReceiver.email
                        });
                    }
                }
            }

            if (attachments && attachments.length > 0) {
                if (typeof attachments == "string") {
                    const parsedAttachment = JSON.parse(attachments);
                    const { fileId, fileUrl, fileName, size, contentType } = parsedAttachment;
                    newEmail.attachments.push({
                        fileId,
                        fileUrl,
                        fileName,
                        size,
                        contentType
                    })
                }
                else {
                    for (const attachment of attachments) {
                        const parsedAttachment = JSON.parse(attachment);
                        const { fileId, fileUrl, fileName, size, contentType } = parsedAttachment;
                        newEmail.attachments.push({
                            fileId,
                            fileUrl,
                            fileName,
                            size,
                            contentType
                        })
                    }
                }
            }

            if (messageSchedule && messageSchedule > Date.now()) {
                newEmail.messageSchedule = new Date(messageSchedule);
                newEmail.isScheduled = true;
                newEmail.isVisibleToSender = false;
                newEmail.sendStatus = "Pending";
            }

            await newEmail.save();

            if (recieverDetails) {
                this.socketConn.handleNotifyAllRecivers(recieverDetails, String(newEmail._id));
            }

            return {
                success: true,
                message: type == "Sent" ? "email has been sent successfully!!" : "email has been drafted!!",
            }

        } catch (error) {
            console.error("Error in SendEmail service:", error);
            return {
                success: false,
                message: "Failed to send email.",
            };
        }
    };

    FetchEmails = async (email: string) => {
        try {

            const emails = await emailModel.find({
                sendStatus: "Sent",
                "receiverRef.email": email,
                "receiverRef": { $size: 1 },
            }).populate({
                path: "senderRef.id",
                select: "email username profilePicture"
            }).sort({ createdAt: -1 }).lean();
            return {
                success: true,
                message: "emails fetch successfully!",
                data: emails
            }
        }
        catch (error) {
            console.error("Error while fetching mails :", error);
            return {
                success: false,
                message: "Failed to fetch emails.",
            }
        }
    }

    FetchDrafts = async (email: string) => {
        try {

            const emails = await emailModel.find({ "senderRef.email": email, sendStatus: "Draft" })
                .populate({
                    path: "receiverRef.id",
                    select: "email username profilePicture"
                })
                .sort({ createdAt: -1 }).lean();
            return {
                success: true,
                message: "emails fetch successfully!",
                data: emails
            }
        }
        catch (error) {
            console.error("Error while fetching mails :", error);
            return {
                success: false,
                message: "Failed to fetch emails.",
            }
        }
    }

    FetchSingleEmail = async (id: string) => {
        try {

            const email = await emailModel.findById(id).populate({
                path: "senderRef.id",
                select: "email username profilePicture"
            }).lean();
            return {
                success: true,
                message: "email fetch successfully!",
                data: email
            }
        }
        catch (error) {
            console.error("Error while fetching mail :", error);
            return {
                success: false,
                message: "Failed to fetch email.",
            }
        }
    }


    checksForDraft(payload: Partial<SendEmailRequestBody>) {
        const {
            senderDetails,
            recieverDetails,
            subject,
            mailBodyContent,
            attachments,
        } = payload;

        // senderDetails must exist and not be empty
        if (!senderDetails || senderDetails.trim() === "") return false;

        // if absolutely nothing else is filled, no valid draft
        if (!recieverDetails && !subject && !mailBodyContent && !attachments) {
            return false;
        }

        // otherwise it's a valid draft
        return true;
    }

}


export default EmailService;