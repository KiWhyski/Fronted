import httpInstance from "@/shared/services/http.instance.js";

/**
 * Service class to call authentication APIs
 * @summary
 * This class is responsible to call authentication APIs.
 * It contains methods to call sign-in and sign-up APIs.
 */
export class AuthenticationService
{
    /**
     * Method to call sign-in API
     * @param signInRequest {SignInRequest} - Request object to sign-in
     * @returns {Promise<httpInstance.AxiosResponse<SignInResponse>>} - Response from the API
     *
     */
    signIn(signInRequest) {
        console.log("🚀 signInRequest", signInRequest);
        return httpInstance.post(import.meta.env.VITE_AUTH_SIGNIN_ENDPOINT, signInRequest);
    }

    /**
     * Method to call sign-up API
     * @param signUpRequest {SignUpRequest} - Request object to sign-up
     * @returns {Promise<httpInstance.AxiosResponse<SignUpResponse>>} - Response from the API
     */
    signUp(signUpRequest) {
        return httpInstance.post(import.meta.env.VITE_AUTH_SIGNUP_ENDPOINT, signUpRequest);
    }

    async sendRecoveryCode(username) {
        return httpInstance.post(import.meta.env.VITE_SEND_RECOVERY_CODE_ENDPOINT, { username });
    }

    async verifyRecoveryCode(username, recoveryCode) {
        try {
            const response = await httpInstance.post(import.meta.env.VITE_VERIFY_RECOVERY_CODE_ENDPOINT, {
                username,
                recoveryCode
            });
            return response.data;
        } catch (error) {
            console.error('Backend error:', error.response?.data || error.message);
            throw error;
        }
    }

    async resetPassword(username, newPassword) {
        try {
            const response = await httpInstance.post(import.meta.env.VITE_RESET_PASSWORD_ENDPOINT, {
                username,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Backend error:', error.response?.data || error.message);
            throw error;
        }
    }
}