import mongoose from "mongoose";

interface IUser {
    googleId: string;
    username: string;
    email: string;
    profilePicture?: string;
    locale?: string;
    verifiedEmail?: boolean;
    lastLoginAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IUserDocument extends IUser, Document { };

const UserSchema = new mongoose.Schema<IUserDocument>({

    googleId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePicture: {
        type: String,
        default: null
    },
    locale: {
        type: String,
        default: null
    },
    verifiedEmail: {
        type: Boolean,
        default: false,
    },
    lastLoginAt: {
        type: Date,
        default: Date.now(),
    },
}, { timestamps: true });




const userModel = mongoose.model<IUserDocument>("User", UserSchema);
export default userModel;
export { IUserDocument }