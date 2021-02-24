import { IMessageState } from "./messageState.type";

export interface FrontendState {
    id: number;
    userId: number;
    name: string;
    state: IMessageState;
}