import { Role } from './role';

export interface ThisUser {
    id: number;
    name: string;
    role: Role;
}