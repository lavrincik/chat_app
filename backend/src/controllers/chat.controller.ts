import { Request, Response } from 'express';
import UserService from '../services/user.service';
import ChatService from "../services/chat.service";
import { User } from '../entities/user.entity';
import { ChatType } from '../types/chatType.type';
import { Role } from '../types/role.type';
import { ChatPatchRequest } from '../types/chatPatchRequest.type';

class ChatController {  
  public getChats = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).send({
        message: "No user id provided."
      });
    }

    const user = await new UserService().getUserById(parseInt(userId));

    if (!user) {
      return res.status(404).send();
    }

    switch(user.role) {
      case Role.client: 
        this.getClientChats(res, user);
        break;
      case Role.employee:
        this.getEmployeeChats(res, user);
        break;
      default:
        return res.status(400).send({
          message: "Wrong user role."
        });
    }  
  }

  private getClientChats = async (res: Response, user: User) => {
    const chats = await new ChatService().getChatsWithUsers(user);

    const clientChats = chats.map((chatWithSocketId) => {
      return {
        ...chatWithSocketId,
        users: chatWithSocketId.users ? chatWithSocketId.users.map((user: User) => {
          const logexEmployeeName = 'Logex employee';
          return {
            id: user.id,
            name: logexEmployeeName,
            connected: user.socketId ? true : false,
            role: user.role
          }
        }) : [],
        unreadMessages: chatWithSocketId.type === ChatType.unassigned ? 0 : chatWithSocketId.unreadMessages
      }
    });

    return res.send(clientChats);
  }

  private getEmployeeChats = async (res: Response, user: User) => {
    const chats = await new ChatService().getChatsWithUsers(user);

    const employeeChats = chats.map((chatWithSocketId) => {
      return {
        ...chatWithSocketId,
        users: chatWithSocketId.users ? chatWithSocketId.users.map((user: User) => {
          return {
            id: user.id,
            name: user.name,
            connected: user.socketId ? true : false,
            role: user.role
          }
        }) : [],
        unreadMessages: chatWithSocketId.type === ChatType.unassigned ? 0 : chatWithSocketId.unreadMessages
      };
    });

    return res.send(employeeChats);
  }

  public patchChat = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { type, users } = req.body;

    const id = parseInt(chatId);

    if (!id) {
      return res.status(400).send({
        message: "No chat id provided."
      });
    }

    if (!users) {
      return res.status(400).send({
        message: "No users provided."
      });
    }

    const chatService = new ChatService();
    const unassignedChat = await chatService.getChatById(id);

    if (!unassignedChat) {
      return res.status(404).send();
    }

    const chat = await chatService.setChat(id, type, users);
    if (!chat) {
      return res.status(404).send();
    }

    const chatPatchRequest: ChatPatchRequest = {
      id: chat.id,
      type: chat.type,
      users: chat.users ? chat.users.map((user: User) => {
        return {
          id: user.id,
          name: user.name,
          role: user.role,
          connected: user.socketId ? true : false
        }
      }) : []
    }

    return res.send(chatPatchRequest);
  }
}

export default ChatController;