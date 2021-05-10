function state() {
    return {
        authenticated: false,
        token: null,
    };
}

export type AppState = ReturnType<typeof state>;

export default state;
