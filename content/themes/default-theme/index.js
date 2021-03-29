module.exports = {
    async render(machine) {
        const videos = await machine.videos()
        const links = [
            {
                name: 'Home',
                href: '/'
            }
        ]
        return machine.render(machine.getThemePath('pages', 'index.edge'), {
            pageTitle: 'Home page',
            videos: videos,
            links
        })
    }
}