import { Router } from "express";
import { autoInjectable } from "tsyringe";
import AccountRoute from "./normal-routes/accountRoute";
import UserRoute from "./protected-routes/userRoute";
import EmailRoute from "./protected-routes/emailRoute";


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



        this.router.use("/account", this.accountRoute.getRoutes());
        this.router.use("/user", this.userRoute.getRoutes());
        this.router.use("/mail", this.emailRoute.getRoutes());
        return this.router;
    }
}

export default Routers;
