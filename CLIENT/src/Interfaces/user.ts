export interface UserContext {
    _id: string;
    googleId: string;
    username: string;
    email: string;
    profilePicture?: string;
    locale?: string;
    verifiedEmail?: boolean;
}


export interface SelectedEmailsForMail {
    _id : string;
    email: string;
    profilePicture: string;
}

export type UserState = {
    user: UserContext | null;
};

export type UserAction =
    | { type: "SAVE_USER"; payload: UserContext }
    | { type: "REMOVE_USER" };

export interface UserContextPayload {
    state: UserState;
    dispatch: React.Dispatch<UserAction>;
}


