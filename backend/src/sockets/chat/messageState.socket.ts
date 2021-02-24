import SocketIO from 'socket.io';
import MessageService from '../../services/message.service';
import { IMessageState } from '../../types/messageState.type';
import ChatService from '../../services/chat.service';

const messageState = (socket: SocketIO.Socket) => {
    socket.on('messageState', async (userId: number, messageId: number, state: IMessageState) => {
        const messageService = new MessageService();
        const message = await messageService.getMessageWithChat(messageId);

        if (!message) {
            return;
        }

        await messageService.setMessageState(userId, messageId, state);

        const chat = await new ChatService().getChatById(message.chat.id);

        if (!chat) {
            return;
        }

        socket.emit('messageState', userId, messageId, state);
        socket.to(message.chat.id.toString())
            .emit('messageState', userId, messageId, state);
    });
}

export default messageState;
