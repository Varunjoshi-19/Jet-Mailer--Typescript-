import { UserDto } from "../../DTOs/user";
import { IUserDocument } from "../../Models/userModel";

interface IAccountService {

    UserLogin: (userData: UserDto) => Promise<IUserDocument>;
    FetchUsers: (currentEmailText: string) => Promise<IUserDocument[]>;

}


export default IAccountService;