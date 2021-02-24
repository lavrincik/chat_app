import SocketIO from 'socket.io';
import MessageService from '../../services/message.service';

const editMessage = (socket: SocketIO.Socket) => {
    socket.on('editMessage', async (
      messageId: number,
      editedText: string,
      messageEdited: () => void,
    ) => { 
        const message = await new MessageService().editMessage(messageId, editedText);

        if (!message) {
            return;
        }

        messageEdited();
        socket.to(message.chat.id.toString()).emit('editMessage', messageId, editedText);
    });
}

export default editMessage;