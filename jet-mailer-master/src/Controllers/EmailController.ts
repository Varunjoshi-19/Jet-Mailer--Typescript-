import { Request, RequestHandler, Response } from "express";
import EmailService from "../Services/EmailService";
import { HttpError } from "../Customs";
import { ApiResponse, } from "../DTOs/email";
import { autoInjectable } from "tsyringe";


@autoInjectable()
class EmailController {

    constructor(private emailService: EmailService) { }

    handleSendEmail: RequestHandler = async (req: Request, res: Response): Promise<Response> => {
        try {
            const payload = req.body;


            const result: ApiResponse = await this.emailService.SendEmail(payload);

            if (!result.success) {
                return res.status(400).json({ message: result.message, sendStatus: result.success });
            }

            return res.status(200).json({
                message: result.message,
                sendStatus: result.success
            });
        } catch (error: unknown) {
            console.error("Error during sending mail:", error);

            if (error instanceof HttpError) {
                return res.status(error.status).json({ message: error.message, sendStatus: false });
            }

            return res.status(500).json({ message: "Unknown server error", sendStatus: false });
        }
    };


    handleFetchEmails: RequestHandler = async (req: Request, res: Response): Promise<Response> => {

        try {
            let email: string = "";
            if (!req.query.email || typeof req.query.email != "string") {
                return res.status(404).json({ message: "email text required!!" });
            }
            email = req.query.email;
            const result = await this.emailService.FetchEmails(email);
            if (!result.success) {
                return res.status(400).json({ message: result.message, sendStatus: result.success });
            }

            return res.status(200).json({
                message: result.message,
                sendStatus: result.success,
                data: result.data
            });

        } catch (error: unknown) {
            console.error("Error during Fetching email:", error);

            if (error instanceof HttpError) {
                return res.status(error.status).json({ message: error.message, sendStatus: false });
            }

            return res.status(500).json({ message: "Unknown server error", sendStatus: false });
        }

    }


    handleFetchSingleEmail: RequestHandler = async (req: Request, res: Response): Promise<Response> => {

        try {
            let mail_id: string = "";
            if (!req.query.id || typeof req.query.id != "string") {
                return res.status(404).json({ message: "email text required!!" });
            }
            mail_id = req.query.id;
            const result = await this.emailService.FetchSingleEmail(mail_id);
            if (!result.success) {
                return res.status(400).json({ message: result.message, sendStatus: result.success });
            }

            return res.status(200).json({
                message: result.message,
                sendStatus: result.success,
                data: result.data
            });

        } catch (error: unknown) {
            console.error("Error during Fetching email:", error);

            if (error instanceof HttpError) {
                return res.status(error.status).json({ message: error.message, sendStatus: false });
            }

            return res.status(500).json({ message: "Unknown server error", sendStatus: false });
        }

    }

    handleFetchDrafts: RequestHandler = async (req: Request, res: Response): Promise<Response> => {
        try {
            let email: string = "";
            if (!req.query.email || typeof req.query.email != "string") {
                return res.status(404).json({ message: "email text required!!" });
            }
            email = req.query.email;
            const result = await this.emailService.FetchDrafts(email);
            if (!result.success) {
                return res.status(400).json({ message: result.message, sendStatus: result.success });
            }

            return res.status(200).json({
                message: result.message,
                sendStatus: result.success,
                data: result.data
            });

        } catch (error: unknown) {
            console.error("Error during Fetching email:", error);

            if (error instanceof HttpError) {
                return res.status(error.status).json({ message: error.message, sendStatus: false });
            }

            return res.status(500).json({ message: "Unknown server error", sendStatus: false });
        }
    }





}


export default EmailController;