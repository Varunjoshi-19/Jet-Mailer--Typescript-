import { ApiResponse, EmailDto } from "../../DTOs/email";

interface IEmailService {

    SendEmail : (payload: Partial<EmailDto> ,attachments : Express.Multer.File[]) => Promise<ApiResponse>
    FetchEmails : (email : string) => Promise<ApiResponse>;

}


export default IEmailService;