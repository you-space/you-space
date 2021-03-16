export interface ExampleStateInterface {
  authenticated: boolean;
  token: string | null;
}

function state(): ExampleStateInterface {
    return {
        authenticated: false,
        token: null
    };
}

export default state;
