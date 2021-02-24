import { IMessageState } from './iMessageState';

export interface MessageState {
    id: number;
    userId: number;
    name: string;
    state: IMessageState;
}