export interface Provider {
    name: string;
    exist: boolean;
    fields: { name: string }[];
    options: string[];
}
export interface Origin {
    id: number;
    name: string;
    providerName: string;
    active: boolean;
    config: Record<string, string>;
    provider: Provider;
    updatedAt: string;
    createdAt: string;
}
