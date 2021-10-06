import { space } from 'src/boot/space';

interface Meta {
    name: string;
    value: any;
}
interface Site {
    name: string;
}

export async function findSiteInfo() {
    const metas = await space.emit('meta:index', 'site:*');

    const site: any = {};

    if (!metas) return site;

    metas.forEach((meta: Meta) => {
        site[meta.name.replace('site:', '')] = meta.value;
    });

    return site as Site;
}

export async function updateSiteInfo(site: any) {
    const metas = Object.entries(site).map(([name, value]) => ({
        name: `site:${name}`,
        value,
    }));

    await space.emit('meta:update-all', metas);
}
