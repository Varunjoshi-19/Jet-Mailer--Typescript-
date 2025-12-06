import mongoose, { Document } from "mongoose";

export interface IEmail extends Document {
    subject: string;
    mailBodyContent: string;
    seenStatus: boolean;
    category: string;
    starred: boolean;
    snoozed: boolean;
    isScheduled: boolean;
    messageSchedule?: Date;
    isVisibleToSender: boolean;
    sendStatus: "Pending" | "Sent" | "Failed" | "Draft";
    createdAt: Date;
    lastUpdatedAt: Date;
    senderRef: {
        id: mongoose.Types.ObjectId;
        email: string;
    };
    receiverRef: {
        id: mongoose.Types.ObjectId;
        email: string;
    }[];

    attachments: [
        { fileId : string, fileUrl: string, fileName: string, size: number, contentType: string }
    ]
}

const EmailSchema = new mongoose.Schema<IEmail>(
    {
        senderRef: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            email: { type: String, required: true },
        },
        receiverRef: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                
                },
                email: { type: String},
            }
        ],
        attachments: [
            {
                 fileId : String,
                fileUrl: String,
                fileName: String,
                size: Number,
                contentType: String
            }
        ],
        subject: { type: String,  trim: true },
        mailBodyContent: { type: String },
        seenStatus: { type: Boolean, default: false },
        category: { type: String, default: "Primary" },
        starred: { type: Boolean, default: false },
        snoozed: { type: Boolean, default: false },
        isScheduled: { type: Boolean, default: false },
        messageSchedule: {
            type: Date,
            default: Date.now
        },
        isVisibleToSender: { type: Boolean, default: true },
        sendStatus: {
            type: String,
            enum: ["Pending", "Sent", "Failed", "Draft"],
            default: "Sent",
        },
    },

    {
        timestamps: { createdAt: "createdAt", updatedAt: "lastUpdatedAt" },
        versionKey: false,
    }
);

export const EmailModel = mongoose.model<IEmail>("Email", EmailSchema);



const emailModel: mongoose.Model<IEmail> = mongoose.model<IEmail>("Email", EmailSchema);
export default emailModel;