import { User } from './user';
import { Message } from './message';
import { ChatType } from './chatType';

export interface Chat {
    id?: number;
    users: User[];
    messages: Message[];
    type: ChatType;
    appContext?: string;
    unreadMessages: number;
    allMessagesReceived: boolean;
    windowOpen: boolean;
    windowColapsed: boolean;
    windowHidden: boolean;
}
