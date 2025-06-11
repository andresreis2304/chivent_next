export const TOKEN_KEY = 'chivent_admin_token';
export const DEV_SECRET = 'mypassword';            // 🔑 change me later

export const setToken   = () => localStorage.setItem(TOKEN_KEY, 'ok');
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const hasToken   = () =>

    typeof window !== 'undefined' && localStorage.getItem(TOKEN_KEY) === 'ok';