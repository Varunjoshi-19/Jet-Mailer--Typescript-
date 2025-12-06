import { ApiEndPoints } from "@/Config/endPoints";
import type { UserContext } from "@/Interfaces/user";

class UserApiHandler {

    handleFetchUsers = async (typedText: string): Promise<UserContext[]> => {
        try {
            const response = await fetch(`${ApiEndPoints.fetchUsers}?email=${typedText}`);
            const result = await response.json();
            return result.users;
        } catch (error) {
            throw error;
        }
    }

}

const userApiHandler = new UserApiHandler();
export default userApiHandler;