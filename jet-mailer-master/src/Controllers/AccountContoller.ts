import e, { Request, RequestHandler, Response } from "express";
import { autoInjectable } from "tsyringe";
import AcccountService from "../Services/AccountService";
import { HttpError } from "../Customs";

@autoInjectable()
class AccountController {

    constructor(private accountService: AcccountService) { }


    handleUserLogin: RequestHandler = async (req: Request, res: Response): Promise<Response> => {
        console.log("hit received!!");
        try {
            const user = await this.accountService.UserLogin(req.body);

            return res.status(200).json({
                message: "User login successful",
                user,
            });

        } catch (error: unknown) {
            console.error("Error during user login:", error);
            if (error instanceof HttpError) return res.status(error.status).json({ message: error.message });
            return res.status(500).json({ message: "Unknown server error" });
        }


    }

    handleFetchUsers: RequestHandler = async (req: Request, res: Response): Promise<Response> => {

        try {
            let email: string = "";
            if (!req.query.email || typeof req.query.email != "string") {
                return res.status(404).json({ message: "email text required!!" });
            }
            email = req.query.email;
            console.log("email", email);
            const users = await this.accountService.FetchUsers(email);
            const message = users && users.length > 0
                ? `Total users found: ${users.length}`
                : "No users found!";

            return res.status(200).json({ message: message, users: users });

        } catch (error: unknown) {
            console.error("Error during user login:", error);
            if (error instanceof HttpError) return res.status(error.status).json({ message: error.message });
            return res.status(500).json({ message: "Unknown server error" });
        }
    }


}

export default AccountController;