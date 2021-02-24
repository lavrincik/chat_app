import SocketIO from 'socket.io';
import ChatService from '../../services/chat.service';
import { ChatType } from '../../types/chatType.type';
import UserService from '../../services/user.service';
import { Role } from '../../types/role.type';

const closeChat = (socket: SocketIO.Socket, namespace: SocketIO.Namespace) => {
    socket.on('closeChat', async (
        chatId: number,
        userId: number,
        chatClosed: () => void,
    ) => { 
        const userService = new UserService();
        const user = await userService.getUserById(userId);

        if (!user) {
            return;
        }

        const chat = await new ChatService().setChat(chatId, ChatType.closed);

        if (!chat) {
            return;
        }

        const sockets = namespace.sockets;

        for (const key in sockets) {
            let chatSocket = sockets[key];

            const socketUser = await userService.getUserBySocket(chatSocket.id);

            switch(socketUser?.role) {
                case Role.client:
                    if (socketUser?.id == user.id) {
                        chatClosed();
                    } else {
                        socket.to(chatSocket.id).emit('closeChat', chatId);
                    }
                    break;
                case Role.employee:
                    if (socketUser?.id == user.id) {
                        chatClosed();
                    } else {
                        socket.to(chatSocket.id).emit('closeChat', chatId);
                    }
                    break;
            }
        }
    });
}

export default closeChat;