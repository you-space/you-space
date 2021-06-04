function state() {
    return {
        authenticated: false,
        token: null as string | null,
    };
}

export type UserState = ReturnType<typeof state>;

export default state;
