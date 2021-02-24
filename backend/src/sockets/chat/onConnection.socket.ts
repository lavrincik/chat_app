import SocketIO from 'socket.io';
import UserService from '../../services/user.service';
import ChatService from '../../services/chat.service';

const onConnection = (socket: SocketIO.Socket, namespace: SocketIO.Namespace) => {
  socket.on('onConnection', async (userId: number) => {
    new UserService().addSocket(socket.id, userId);

    const chats = await new ChatService().getChatsNotClosed(userId);
    for (const chat of chats) {
      namespace.sockets[socket.id].join(chat.id.toString());
    }
  });
}

export default onConnection;
