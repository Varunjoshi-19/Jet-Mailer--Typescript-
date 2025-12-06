import { Router } from "express";
import { autoInjectable } from "tsyringe";
import AccountController from "../../Controllers/AccountContoller";



@autoInjectable()
class UserRoute {
    private router: Router;

    constructor(private accountController: AccountController) { this.router = Router(); }

    getRoutes(): Router {

        this.router.get("/fetch-users", this.accountController.handleFetchUsers.bind(this.accountController));




        return this.router;
    }
}

export default UserRoute;
