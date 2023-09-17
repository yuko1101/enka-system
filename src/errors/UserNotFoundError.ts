import EnkaNetworkError from "./EnkaNetworkError";

/**
 * @extends {EnkaNetworkError}
 */
class UserNotFoundError extends EnkaNetworkError {
    /**
     * @param message
     * @param statusCode
     * @param statusMessage
     */
    constructor(message: string, statusCode: number, statusMessage: string) {
        super(message, statusCode, statusMessage);
        this.name = "UserNotFoundError";
    }
}

export default UserNotFoundError;