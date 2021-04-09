export interface Origin {
    id: number;
    name: string;
    type: string;
    videosCount: number;
    config: Record<string, unknown>;
    metadata: {
        totalVideos: number;
    };
    updatedAt: string;
    createdAt: string;
}
