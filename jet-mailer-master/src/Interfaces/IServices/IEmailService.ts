import { ApiResponse, SendEmailRequestBody  } from "../../DTOs/email";

interface IEmailService {

    SendEmail : (payload: Partial<SendEmailRequestBody> ,attachments : Express.Multer.File[]) => Promise<ApiResponse>
    FetchEmails : (email : string) => Promise<ApiResponse>;

}


export default IEmailService;