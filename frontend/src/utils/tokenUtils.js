import axios from "axios";
import API_BASE_URL from "../config";

export const isValidToken = (token) => {

    if (!token) return false;

    try {

        // Decode payload part of JWT
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Current time in seconds
        const currentTime = Date.now() / 1000;

        const expiry = new Date(payload.exp * 1000);
        console.log("expiry time");
        console.log(expiry);

        // expired?
        return payload.exp > currentTime;

    } catch (error) {

        return false;
    }
};

export default async function validateRefreshToken(accessToken, refreshToken) {

    if (!accessToken || !isValidToken(accessToken)) {

        console.log("Access token do not exists");

        if (!refreshToken || !isValidToken(refreshToken)) {
    
             console.log("Refresh token do not exists");
            return false;
        }

        console.log("Refresh token exists");

        try {
            const response = await axios.post(
                `${API_BASE_URL}/token/refresh/`,
                {
                    refresh: refreshToken,
                }
            );

            localStorage.setItem("token", response.data.access);

            return true;

        } catch (error) {
            console.log(error);
            console.log("Error occured while refreshing token")
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");

            return false;
        }
    }

    return true;
}