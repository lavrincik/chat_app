import { FrontendUser } from './frontendUser.type';
import { FrontendMessage } from './frontendMessage.type';
import { ChatType } from './chatType.type';

export interface FrontendChat {
    id: number;
    users: FrontendUser[];
    messages: FrontendMessage[];
    type: ChatType;
    appContext?: string;
    unreadMessages: number
}