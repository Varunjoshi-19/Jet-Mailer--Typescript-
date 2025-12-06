import { autoInjectable } from "tsyringe";
import { UserDto } from "../DTOs/user";
import userModel, { IUserDocument } from "../Models/userModel";
import { HttpError } from "../Customs";
import IAccountService from "../Interfaces/IServices/IAccountService";

@autoInjectable()
class AcccountService implements IAccountService {


    UserLogin = async (userData: UserDto): Promise<IUserDocument> => {

        try {
            const { googleId, username, email, profilePicture, locale } = userData;

            if (!googleId || !username || !email) {
                throw new HttpError("Missing required fields", 404);
            }

            let user = await userModel.findOne({ googleId });

            if (!user) {
                // Create new user
                user = new userModel({
                    googleId,
                    username,
                    email,
                    profilePicture,
                    locale,
                    verifiedEmail: true,
                });
                await user.save();
            } else {
                // Update last login time
                user.lastLoginAt = new Date();
                await user.save();
            }

            return user;
        } catch (error) {
            throw error;
        }

    }

    FetchUsers = async (currentEmailText: string): Promise<IUserDocument[]> => {
        try {
            if (!currentEmailText || typeof currentEmailText != "string") {
                throw new HttpError("Email text required!", 404);
            }
            const emailRegex = new RegExp(currentEmailText, "i");
            const users: IUserDocument[] = await userModel.find({
                email: { $regex: emailRegex }
            });

            return users;
        } catch (error) {
            throw error;
        }

    }


}


export default AcccountService;