export interface AuthUser {
    id: number;
    name: string;
}

function state() {
    return {
        isAuthenticated: true,
        user: null as AuthUser | null,
    };
}

export type AuthState = ReturnType<typeof state>;

export default state;
