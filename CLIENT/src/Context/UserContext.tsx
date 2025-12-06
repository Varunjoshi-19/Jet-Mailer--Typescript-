import type { UserAction, UserContext, UserContextPayload, UserState } from "@/Interfaces/user";
import React, { useCallback, useEffect, useReducer } from "react";
import { UseGlobalContext } from "./GlobalContext";


const initialState: UserState = { user: null };


const UserContext = React.createContext<UserContextPayload | undefined>(undefined);

export const UseUserContext = () => {

    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error("Context is not available!!");
    }
    return context;
}


const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case "SAVE_USER":
            return { ...state, user: action.payload };
        case "REMOVE_USER":
            return { ...state, user: null };
        default:
            return state;
    }
};


export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    const { socket } = UseGlobalContext();

    const handleFetchUserFromLocal = useCallback(() => {
        const currentLoggedInUser = localStorage.getItem("user-data");
        if (currentLoggedInUser) {
            const parsedUser = JSON.parse(currentLoggedInUser);
            dispatch({ type: "SAVE_USER", payload: parsedUser });
        }

    }, []);

    useEffect(() => {
        socket.on("connDetailReq", () => {
            const currentLoggedInUser = localStorage.getItem("user-data");
            if (currentLoggedInUser) {

                const parsedUser = JSON.parse(currentLoggedInUser);
                const { email, _id } = parsedUser as UserContext;
                console.log("req recevied of connection", email, _id);
                socket.emit("connectionDetails", { email: email, userId: _id });
            }

        });

    }, [socket]);

    useEffect(() => {
        handleFetchUserFromLocal();
    }, [handleFetchUserFromLocal]);




    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    )
}