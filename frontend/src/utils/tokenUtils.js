export const isTokenExpired = (token) => {

    if (!token) return true;

    try {

        // Decode payload part of JWT
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Current time in seconds
        const currentTime = Date.now() / 1000;

        // expired?
        return payload.exp < currentTime;

    } catch (error) {

        return true;
    }
};