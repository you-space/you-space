import { space } from 'src/boot/space';

interface Meta {
    name: string;
    value: any;
}

export async function findSiteInfo() {
    const metas = await space.emit('metas:getAll', 'site:*');

    const site: Record<string, string> = {};

    metas.forEach((meta: Meta) => {
        site[meta.name.replace('site:', '')] = meta.value;
    });

    return site;
}

export async function updateSiteInfo(site: any) {
    const metas = Object.entries(site).map(([name, value]) => ({
        name: `site:${name}`,
        value,
    }));

    await space.emit('metas:updateAll', metas);
}
