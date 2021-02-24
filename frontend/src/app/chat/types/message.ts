import { User } from './user';
import { MessageState } from './messageState';
import { Flag } from './messageFlag';

export interface Message {
    id?: number;
    text: string;
    timestamp: Date;
    chatId: number;
    user: User;
    states: MessageState[];
    sent: boolean;
    flag: Flag;
    editedText?: string;
    open?: boolean;
    found?: boolean;
}
