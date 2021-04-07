export interface Origin {
    id: number;
    name: string;
    type: string;
    videosCount: number;
    metadata: {
        totalVideos: number;
    };
}
