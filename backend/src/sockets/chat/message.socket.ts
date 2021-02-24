import SocketIO from 'socket.io';
import UserService from '../../services/user.service';
import ChatService from '../../services/chat.service';
import MessageService from '../../services/message.service';
import { FrontendMessage } from '../../types/frontendMessage.type';
import { FrontendState } from '../../types/frontendState.type';
import { Role } from '../../types/role.type';

const message = (socket: SocketIO.Socket, namespace: SocketIO.Namespace) => {
  socket.on('message', async (
    userId: number, 
    text: string, 
    timestamp: Date, 
    chatId: number, 
    messageSent: (message: any) => void
  ) => {
    const userService = new UserService();
    const user = await userService.getUserById(userId);
    const chat = await new ChatService().getChatById(chatId);
    
    if (!user || !chat) {
      return;
    }

    const message = await new MessageService().createMessage(text, timestamp, chat, user);

    if (!message.states) {
      return;
    }

    const messageStates: FrontendState[] = [];
    for (const messageState of message.states) {
      messageStates.push({
        id: messageState.id,
        userId: messageState.user.id,
        name: messageState.user.name,
        state: messageState.state
      });
    }

    const employeeFrontendMessage: FrontendMessage = {
      id: message.id,
      text: message.text,
      timestamp: message.timestamp,
      chatId: message.chat.id,
      user: {
        id: message.user.id,
        name: message.user.name,
        connected: message.user.socketId ? true : false,
        role: message.user.role
      },
      states: messageStates,
      sent: true,
      flag: message.flag,
      editedText: message.editedText
    };

    const logexEmployeeName = 'Logex employee';

    const clientFrontendMessage: FrontendMessage = {
      ...employeeFrontendMessage,
      user: {
        ...employeeFrontendMessage.user,
        name: logexEmployeeName
      }
    };

    const sockets = namespace.sockets;

    for (const key in sockets) {
      let chatSocket = sockets[key];

      const socketUser = await userService.getUserBySocket(chatSocket.id);

      switch(socketUser?.role) {
        case Role.client:
          if (socketUser?.id == user.id) {
            messageSent(clientFrontendMessage);
          } else {
            socket.to(chatSocket.id).emit('message', clientFrontendMessage);
          }
          break;
        case Role.employee:
          if (socketUser?.id == user.id) {
            messageSent(employeeFrontendMessage);
          } else {
            socket.to(chatSocket.id).emit('message', employeeFrontendMessage);
          }
          break;
      }
    }
  });
}

export default message;