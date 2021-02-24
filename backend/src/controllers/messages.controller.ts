import { Request, Response } from "express";
import MessageService from '../services/message.service';
import UserService from '../services/user.service';
import { Message } from '../entities/message.entity';
import { FrontendMessage } from '../types/frontendMessage.type';
import { FrontendState } from '../types/frontendState.type';
import { Role } from "../types/role.type";
import ChatService from '../services/chat.service';
import { ChatType } from "../types/chatType.type";
import { User } from "../entities/user.entity";
import { Chat } from '../entities/chat.entity';

class MessageController {  
  public getMessages = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { limit, offset, userId } = req.query;

    if (!chatId) {
        return res.status(400).send({
          message: "No chat id provided."
        });
    }

    if (!limit) {
        return res.status(400).send({
          message: "No limit value provided."
        });
    }

    if (!offset) {
        return res.status(400).send({
          message: "No offset value provided."
        });
    }

    if (!userId) {
      return res.status(400).send({
        message: "No user id provided."
      });
    }

    const user = await new UserService().getUserById(userId);

    if (!user) {
      return res.status(404).send();
    }

    const chatService = new ChatService();
    const chat = await chatService.getChatById(parseInt(chatId));

    if (!chat) {
      return res.status(404).send();
    }

    const frontendMessages = await this.getFrontendMessages(chat, user, limit, offset);

    return res.send(frontendMessages);
  }

  private getFrontendMessages = async (chat: Chat, user: User, limit: number, offset: number) => {
    const messageService = new MessageService();
    const messages = await messageService.getMessagesWithUsers(chat.id, limit, offset);
    const frontendMessages = this.parseFrontendMessages(messages, chat.id);

    switch(user.role) {
      case Role.employee:
        return frontendMessages;

      case Role.client:
        const clientMessages = frontendMessages.map((message: FrontendMessage) => {
          const logexEmployeeName = 'Logex employee';
          let states: FrontendState[] = [];

          switch(chat.type) {
            case ChatType.unassigned:
              states = message.states.map((state: FrontendState) => {
                return {
                  ...state,
                  name: state.userId == user.id ? message.user.name : logexEmployeeName
                }
              }).filter((state: FrontendState) => {
                return state.userId == user.id;
              });
              break;
            case ChatType.open:
            case ChatType.closed:
              states = message.states.map((state: FrontendState) => {
                return {
                  ...state,
                  name: state.userId == user.id ? user.name : logexEmployeeName
                }
              }).filter((state: FrontendState) => {
                return chat.users?.some((user: User) => {
                  return user.id == state.userId; 
                });
              });
          }

          return {
            ...message,
            user: {
              ...message.user,
              name: message.user.id == user.id ? user.name : logexEmployeeName
            },
            states
          }
        });
        return clientMessages;
    }
  }

  private parseFrontendMessages = (messages: Message[], chatId: number) => {
    let frontendMessages: FrontendMessage[] = [];
    for (const message of messages) {
      const user = {
        name: message.user.name,
        id: message.user.id,
        connected: message.user.socketId ? true : false,
        role: message.user.role
      }

      let messageStates = [];
      if (message.states) {
        for (const messageState of message.states) {
          messageStates.push({
            id: messageState.id,
            userId: messageState.user.id,
            name: messageState.user.name,
            state: messageState.state
          });
        }
      }
      
      frontendMessages.push({
        id: message.id,
        timestamp: message.timestamp,
        text: message.text,
        chatId: chatId,
        user,
        states: messageStates,
        sent: true,
        flag: message.flag,
        editedText: message.editedText
      });
    }

    return frontendMessages;
  }
}

export default MessageController;