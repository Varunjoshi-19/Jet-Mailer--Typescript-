import { Router } from "express";
import { autoInjectable } from "tsyringe";
import AccountController from "../../Controllers/AccountContoller";
import { HttpError } from "../../Customs";



@autoInjectable()
class AccountRoute {
    private router: Router;

    constructor(private accountController: AccountController) { this.router = Router(); }

    getRoutes(): Router {
        this.router.get("/hit", (req, res) => {

            try {
                throw new HttpError("Test error here with 404 status", 404);
            } catch (error) {
                if (error instanceof HttpError) {
                    return res.status(error.status).json({ message: error.message })
                }
                throw new Error("Server internal error !!");
            }
        })

        this.router.post("/login", this.accountController.handleUserLogin.bind(this.accountController));
        return this.router;
    }
}

export default AccountRoute;
