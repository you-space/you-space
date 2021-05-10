import { api } from 'src/boot/axios';
import { Origin } from 'src/types';

export async function saveOrigin(originId: number, origin: Partial<Origin>) {
    return api.patch(`admin/origins/${originId}`, origin);
}
