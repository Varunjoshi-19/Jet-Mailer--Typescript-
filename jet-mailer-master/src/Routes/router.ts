import { Router } from "express";
import { autoInjectable } from "tsyringe";
import AccountRoute from "./normal-routes/accountRoute";
import UserRoute from "./protected-routes/userRoute";
import EmailRoute from "./protected-routes/emailRoute";
import { ApiResponse } from "../DTOs/email";


@autoInjectable()
class Routers {
    private router: Router;

    constructor(
        private accountRoute: AccountRoute,
        private userRoute: UserRoute,
        private emailRoute: EmailRoute
    ) {
        this.router = Router();

    }

    getRoutes(): Router {

       this.router.get("/health" , (req ,res )  => {
         const username = req.query?.name;
         return res.status(200).json(`Hello ${username ?? "User"} from EC2 SERVER !!`);
       });

        this.router.use("/account", this.accountRoute.getRoutes());
        this.router.use("/user", this.userRoute.getRoutes());
        this.router.use("/mail", this.emailRoute.getRoutes());
        return this.router;
    }
}

export default Routers;
