import { Role } from "./role.type";

export interface FrontendUser {
    id: number;
    name: string;
    connected: boolean;
    role: Role;
}
