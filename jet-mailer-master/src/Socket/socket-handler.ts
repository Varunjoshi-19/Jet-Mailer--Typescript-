import { Socket, Server } from "socket.io";
import { autoInjectable } from "tsyringe";
import { availableUsers, socketToUserId, userIdToSocketId } from "../Cache/cache";



@autoInjectable()
class SocketHandler {

    initSocketHandler(socket: Socket, socketModel: Server) {
        socket.on("connectionDetails", (data) => {
            this.handleSaveConnectionDetails(socket, data);

        })
    }

    handleSaveConnectionDetails(socket: Socket, data: { email: string, userId: string }) {
        const { email, userId } = data;
        const alreadyHasUser = availableUsers.has(socket.id);
        if (alreadyHasUser) {
            socketToUserId.delete(socket.id);
            userIdToSocketId.delete(userId);
            availableUsers.delete(userId);
        }

        availableUsers.set(userId, { socketId: socket.id, email: email });
        socketToUserId.set(socket.id, { email: email, userId: userId });
        userIdToSocketId.set(userId, { email: email, socketId: socket.id });

    }

    handleWhenUserDisconnects(socketId: string) {
        const userId: string = socketToUserId?.get(socketId)?.userId!;
        socketToUserId.delete(socketId);
        userIdToSocketId.delete(userId);
        availableUsers.delete(userId);
    }

}


export default SocketHandler;