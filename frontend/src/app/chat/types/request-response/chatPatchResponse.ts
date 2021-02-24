import { ChatType } from '../chatType';
import { User } from '../user';

export interface ChatPatchResponse {
    id: number;
    type: ChatType;
    users?: User[];
}