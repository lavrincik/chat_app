import { FrontendUser } from './frontendUser.type';
import { FrontendState } from './frontendState.type';
import { Flag } from './messageFlag.type';

export type FrontendMessage = {
    id: number;
    text: string;
    timestamp: Date;
    chatId: number;
    user: FrontendUser;
    states: FrontendState[];
    sent: boolean;
    flag: Flag;
    editedText?: string;
}
