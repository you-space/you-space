function state() {
    return { version: '', name: '' };
}

export type AppState = ReturnType<typeof state>;

export default state;
