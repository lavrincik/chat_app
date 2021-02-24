export interface FindMessage {
    pattern: string;
    currentMessageId: number | undefined;
    noMessagesFound: boolean;
    firstMessageId: number | undefined;
    lastMessageId: number | undefined;
}