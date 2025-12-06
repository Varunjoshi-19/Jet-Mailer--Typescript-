import userModel, { IUserDocument } from "../Models/userModel";

class UserRepository {

    async findByGoogleId(googleId: string): Promise<IUserDocument | null> {
        return userModel.findOne({ googleId });
    }

    async create(userData: Partial<IUserDocument>): Promise<IUserDocument> {
        const user = new userModel(userData);
        return user.save();
    }

    async updateLastLogin(userId: string): Promise<IUserDocument | null> {
        return userModel.findByIdAndUpdate(
            userId,
            { lastLoginAt: new Date() },
            { new: true }
        );
    }

    async findByEmail(email: string): Promise<IUserDocument | null> {
        return userModel.findOne({ email });
    }
}

export default UserRepository;
