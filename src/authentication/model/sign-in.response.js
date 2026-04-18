/**
 * Sign In Response
 * @summary
 * Represents a sign-in response. This is used to authenticate a user.
 */
export class SignInResponse {
    /**
     * Constructor
     * @param {string} id The id of the user.
     * @param {string} username The username of the user.
     * @param {string} token The token generated for the user.
     * @param {string} accountId The account id associated with the user.
     */
    constructor(id, username, token, accountId) {
        this.id = id;
        this.username = username;
        this.token = token;
        this.accountId = accountId;
    }
}