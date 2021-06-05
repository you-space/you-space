import axios from "axios";
import lodash from "lodash";

export default class Provider {
    public static options = ["import"];
    public static entityName = "video-youtube";
    public static fields = [
        {
            name: "apiKey",
            label: "Api key",
        },
        {
            name: "channelId",
            label: "Channel id",
        },
    ];

    public config: any;
    public service: any;

    public maxResults = 50;
    public api = axios.create({
        baseURL: "https://www.googleapis.com/youtube/v3",
    });

    public videos = [];

    public async getUploadPlaylistId() {
        const request = await this.api
            .get("channels", {
                params: {
                    key: this.config.apiKey,
                    id: this.config.channelId,
                    part: "contentDetails",
                },
            })
            .catch((err) => this.service.logger.child(err.response).error(err.message));

        const channel = lodash.get(request, "data.items[0]", null);

        if (!channel) {
            throw new Error("you-tube channel not found");
        }

        const uploadPlaylistId = lodash.get(
            channel,
            "contentDetails.relatedPlaylists.uploads"
        );

        return uploadPlaylistId;
    }

    public async import() {
        await this.fetchVideos();

        await this.service.createMany(this.videos);

        return this.videos;
    }

    public async fetchVideos(pageToken?: string) {
        const playlistId = await this.getUploadPlaylistId();

        const requestPlaylistItems = await this.api.get("playlistItems", {
            params: {
                part: "contentDetails",
                key: this.config.apiKey,
                playlistId,
                pageToken,
                maxResults: this.maxResults,
            },
        });

        const items = lodash.get(requestPlaylistItems, "data.items", []);

        const nextPageToken = lodash.get(
            requestPlaylistItems,
            "data.nextPageToken",
            null
        );

        const videoIds = items
            .map((i: any) => lodash.get(i, "contentDetails.videoId", null))
            .filter((i: any) => i !== null);

        const requestVideos = await this.api.get("videos", {
            params: {
                key: this.config.apiKey,
                part: "statistics, snippet",
                id: videoIds.join(),
            },
        });

        const videos = lodash.get(requestVideos, "data.items", []);
        const data = videos.map((i: any) => ({
            id: i.id,
            data: i,
        }));

        this.videos = this.videos.concat(data);

        if (nextPageToken) {
            // await this.fetchVideos(nextPageToken)
        }
    }

    serialize(data: any) {
        const viewsCount = lodash.get(data, "statistics.viewCount", 0);
        const standardThumb = lodash.get(
            data,
            "snippet.thumbnails.standard.url",
            null
        );
        const defaultThumb = lodash.get(
            data,
            "snippet.thumbnails.default.url",
            null
        );
        return {
            videoId: lodash.get(data, "id", null),
            title: lodash.get(data, "snippet.title", null),
            src: `https://www.youtube.com/embed/${lodash.get(
                data,
                "id",
                null
            )}`,
            description: lodash.get(data, "snippet.description", null),
            viewsCount: Number(viewsCount),
            thumbnailSrc: standardThumb || defaultThumb,
            originLink: `https://www.youtube.com/watch?v=${lodash.get(
                data,
                "id",
                null
            )}`,
            publishedAt: lodash.get(data, "snippet.publishedAt", null),
        };
    }
}
