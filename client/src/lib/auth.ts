const TOKEN_KEY = "snippet_token";
const USER_KEY = "snippet_user";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function setUser(username: string): void {
    localStorage.setItem(USER_KEY, username);
}

export function getUser(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_KEY);
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
    const token = getToken();
    if (!token) return false;

    // Basic JWT expiry check
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp * 1000;
        if (Date.now() > expiry) {
            clearAuth();
            return false;
        }
        return true;
    } catch {
        return false;
    }
}
