module.exports = {
  src: {
    type: 'string',
  },
  title: {
    type: 'string',
    map: 'snippet.title',
  },
  description: {
    type: 'string',
    map: 'snippet.description',
  },
  thumbnail: {
    type: 'object',
    serialize: ({ snippet }) => ({
      src: snippet.thumbnails.high.url,
      alt: snippet.title,
    }),
  },
  publishedAt: {
    type: 'date',
    map: 'snippet.publishedAt',
  },
  tags: {
    type: 'date',
    map: 'snippet.tags',
    serialize: ({ snippet }) => snippet.tags || [],
  },
  viewCount: {
    type: 'number',
    map: 'statistics.viewCount',
  },
  likeCount: {
    type: 'number',
    map: 'statistics.likeCount',
  },
  duration: {
    type: 'string',
    map: 'contentDetails.duration',
  },
}
