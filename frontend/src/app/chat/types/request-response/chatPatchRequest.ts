import { ChatType } from '../chatType';
import { Role } from '../role';

export interface ChatPatchRequest {
    type?: ChatType;
    users?: {
        id: number;
        name: string;
        role: Role;
    }[];
}