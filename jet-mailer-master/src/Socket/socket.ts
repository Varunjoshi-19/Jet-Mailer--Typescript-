import { Server as httpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { autoInjectable, singleton } from "tsyringe";
import { availableUsers, socketToUserId, userIdToSocketId } from "../Cache/cache";
import SocketHandler from "./socket-handler";

@singleton()
@autoInjectable()
class SocketConnection {

    private httpModel: httpServer | null;
    private socketModel: SocketServer | null;

    constructor(private socketHandler: SocketHandler) {
        this.httpModel = null;
        this.socketModel = null;
    }

    establishConnection(http: httpServer) {
        this.httpModel = http;

        this.socketModel = new SocketServer(this.httpModel, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,

            },
            maxHttpBufferSize: 1e8,

        });

        this.socketModel.on("connection", (socket: Socket) => {
            console.log("new connection", socket.id);
            this.socketModel?.to(socket.id).emit("connDetailReq");
            this.socketHandler.initSocketHandler(socket, this.socketModel!);
        });

        this.socketModel.on("disconnect", (socket: Socket) => {
            this.socketHandler.handleWhenUserDisconnects(socket.id);
        });


    }


    handleNotifyAllRecivers = (recieverDetails: string[], email_id: string) => {
        console.log("notified users!!");
        if (recieverDetails) {
            if (typeof recieverDetails == "string") {
                const parsedReceiver = JSON.parse(recieverDetails);
                console.log("this is the avliaable users ", availableUsers, parsedReceiver.id);
                if (availableUsers.has(parsedReceiver.id)) {
                    const data = availableUsers.get(parsedReceiver.id);
                    console.log("socket id ", data?.socketId, this.socketModel);
                    this.socketModel?.to(data?.socketId!).emit("new-email-available", { email_id: email_id });
                }
            }
            else {
                for (const receiver of recieverDetails) {
                    const parsedReceiver = JSON.parse(receiver);
                    if (availableUsers.has(parsedReceiver.id)) {
                        const data = availableUsers.get(parsedReceiver.id);
                        this.socketModel?.to(data?.socketId!).emit("new-email-available", { email_id: email_id });
                    }

                }
            }
        }
    }


}

export default SocketConnection