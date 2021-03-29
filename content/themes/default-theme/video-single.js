module.exports = {
    async render(machine, video) {
        const links = [
            {
                name: 'Home',
                href: '/'
            }
        ]
        return machine.render(machine.getThemePath( 'pages', 'video-single.edge'), {
            pageTitle: 'Video single',
            video: video,
            links
        })
    }
}