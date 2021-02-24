import { ChatType } from './chatType.type';
import { FrontendUser } from './frontendUser.type';

export interface ChatPatchRequest {
    id: number;
    type: ChatType;
    users: FrontendUser[];
}