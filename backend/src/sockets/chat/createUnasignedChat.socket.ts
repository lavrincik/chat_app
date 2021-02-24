import SocketIO from 'socket.io';
import UserService from '../../services/user.service';
import ChatService from '../../services/chat.service';
import { FrontendChat } from '../../types/frontendChat.type';
import { User } from '../../entities/user.entity';

const createUnassignedChat = (socket: SocketIO.Socket, namespace: SocketIO.Namespace) => {
    socket.on('createUnassignedChat', async (
        userId: number, 
        appContext: string,
        unasignedChatCreated: (chat: FrontendChat) => void,
    ) => { 
        const user = await new UserService().getUserById(userId);

        if (!user) {
            return;
        }

        const chatService = new ChatService();
        const chats = await chatService.getChatsNotClosed(userId);

        for (const chat of chats) {
            if (chat.appContext === appContext) {
                return;
            }
        }

        const unassignedChat = await chatService.createUnassignedChat(user, appContext);

        const clientChat: FrontendChat = {
          ...unassignedChat,
          users: unassignedChat.users ? unassignedChat.users.map((_user: User) => {
            const logexEmployeeName = 'Logex employee';
            return {
              id: _user.id,
              name: _user.id != userId ? logexEmployeeName : _user.name,
              connected: _user.socketId ? true : false,
              role: _user.role
            }
          }) : [],
          messages: [],
          unreadMessages: 0
        };

        const employeeChat: FrontendChat = {
            ...unassignedChat,
            users: unassignedChat.users ? unassignedChat.users.map((_user: User) => {
                return {
                  id: _user.id,
                  name: _user.name,
                  connected: _user.socketId ? true : false,
                  role: _user.role
                }
              }) : [],
            messages: [],
            unreadMessages: 0
        }
    
        if (!unassignedChat.users) {
            return
        }

        for (const user of unassignedChat.users) {
            if (!user.socketId) {
                continue
            }
            namespace.sockets[user.socketId].join(unassignedChat.id.toString());
        }

        unasignedChatCreated(clientChat);
        socket.emit('createUnassignedChat', employeeChat);
    });
}

export default createUnassignedChat;