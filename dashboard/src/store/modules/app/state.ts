function state() {
    return { version: '' };
}

export type AppState = ReturnType<typeof state>;

export default state;
