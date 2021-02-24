import { Role } from './role';

export interface User {
    id: number;
    name: string;
    connected: boolean;
    role: Role;
}
