import { Permission } from './permission';

export interface Visibility {
    name: string;
    requiredPermissions: Permission[];
}
