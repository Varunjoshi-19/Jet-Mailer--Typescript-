const NewMessageIconActions = {
    CLOSE: "CLOSE",
    EXPAND: "EXPAND",
    MINIMIZE: "MINIMIZE"
}


export interface NewMessagePromptProps {
    toogleCloseAndOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


export interface ApiResponsePayload {
    success: boolean;
    message: string;
    data?: any;
}


export { NewMessageIconActions };