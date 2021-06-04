export interface Provider {
    name: string;
    exist: boolean;
    fields: { name: string }[];
    options: string[];
}
