import SocketIO from 'socket.io';
import MessageService from '../../services/message.service';

const deleteMessage = (socket: SocketIO.Socket) => {
    socket.on('deleteMessage', async (
      messageId: number,
      messageDeleted: () => void,
    ) => { 
        const message = await new MessageService().deleteMessage(messageId);

        if (!message) {
            return;
        }

        messageDeleted();
        socket.to(message.chat.id.toString()).emit('deleteMessage', messageId);
    });
}

export default deleteMessage;