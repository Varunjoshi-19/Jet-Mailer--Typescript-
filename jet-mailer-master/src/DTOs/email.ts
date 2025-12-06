export interface SendEmailRequestBody {
  senderDetails: string;        
  recieverDetails: string[];    
  subject: string;
  mailBodyContent: string;
  messageSchedule: number;       
  category: string;
  type : "Pending" | "Sent" | "Failed" | "Draft"
  attachments : string[];
}

export interface ApiResponse {
    message: string;
    success: boolean;
    data?: any;
}