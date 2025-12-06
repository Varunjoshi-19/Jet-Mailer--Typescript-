interface socketDetails {
    email: string;
    socketId: string;
}
interface socketToUserPayload {
    email: string;
    userId: string;
}

interface userToSocketIdPayload {
    email: string;
    socketId: string;
}
const availableUsers = new Map<string, socketDetails>();
const socketToUserId = new Map<string, socketToUserPayload>();
const userIdToSocketId = new Map<string, userToSocketIdPayload>();

export { availableUsers, socketToUserId, userIdToSocketId };