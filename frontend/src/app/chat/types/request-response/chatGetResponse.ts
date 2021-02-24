import { User } from '../user';
import { ChatType } from '../chatType';

export type ChatsGetResponse = {
    id: number;
    users: User[];
    type: ChatType;
    appContext: string;
    unreadMessages: number;
} [];
