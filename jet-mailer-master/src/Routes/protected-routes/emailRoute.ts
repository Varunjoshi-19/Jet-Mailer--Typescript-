import { Router } from "express";
import { autoInjectable } from "tsyringe";
import EmailController from "../../Controllers/EmailController";
import multer, { memoryStorage } from "multer";

const upload = multer({ storage: memoryStorage() });

@autoInjectable()
class EmailRoute {
    private router: Router;

    constructor(private emailController: EmailController) { this.router = Router(); }

    getRoutes(): Router {

        this.router.post("/send-mail", upload.array("attachments"), this.emailController.handleSendEmail.bind(this.emailController));
        this.router.get("/fetch-emails", this.emailController.handleFetchEmails.bind(this.emailController));
        this.router.get("/fetch-single-email", this.emailController.handleFetchSingleEmail.bind(this.emailController));
        this.router.get("/fetch-drafts", this.emailController.handleFetchDrafts.bind(this.emailController));

        return this.router;
    }
}

export default EmailRoute;
