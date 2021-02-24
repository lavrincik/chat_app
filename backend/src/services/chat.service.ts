import { User } from '../entities/user.entity';
import { getRepository, Brackets } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import { ChatType } from '../types/chatType.type';
import MessageService from './message.service';
import { Role } from '../types/role.type';
import { IMessageState } from '../types/messageState.type';

class ChatService {
  public getChatById = async (chatId: number): Promise<Chat | undefined> => {
    const chat = await getRepository(Chat).findOne({
      relations: ['users'],
      where: { id: chatId }
    });
    return chat;
  }

  public getChatsWithUsers = async (user: User)=> {
    const chats = await getRepository(Chat)
      .createQueryBuilder('chat')
      .innerJoin('chat.users', 'user1')
      .where('user1.id = :userId1', { userId1: user.id })
      .innerJoinAndSelect('chat.users', 'user2')
      .andWhere('NOT user2.id  = :userId2', { userId2: user.id })
      .andWhere('NOT chat.type = :type', { type: ChatType.closed })
      .getMany();

    const unreadChatIds = await getRepository(Chat)
      .createQueryBuilder('chat')
      .innerJoin('chat.users', 'user1')
      .where('user1.id = :userId1', { userId1: user.id })
      .innerJoin('chat.users', 'user2')
      .andWhere('NOT user2.id  = :userId2', { userId2: user.id })
      .andWhere('NOT chat.type = :type', { type: ChatType.closed })
      .innerJoin('chat.messages', 'message')
      .innerJoin('message.user', 'messageUser')
      .andWhere('NOT messageUser.id = :userId3', { userId3: user.id })
      .innerJoin('message.states', 'messageState')
      .innerJoin('messageState.user', 'messageStateUser')
      .andWhere('messageState.user = :userId4', { userId4: user.id })
      .andWhere(new Brackets(qb => {
        qb.where("messageState.state = :sent", { sent: IMessageState.sent })
          .orWhere("messageState.state = :delivered", { delivered: IMessageState.delivered })
      }))
      .groupBy("chat.id")
      .select('chat.id', 'id')
      .addSelect('COUNT("message.id")', 'unread')
      .getRawMany();

    const unreadChats = [];
    for (const chat of chats) {
      const unreadChatId = unreadChatIds.find((_unreadChatId) => {
        return _unreadChatId.id == chat.id;
      })
      unreadChats.push({
        ...chat,
        unreadMessages: unreadChatId ? parseInt(unreadChatId.unread) : 0 
      })
    }
    return unreadChats;
  }

  public refreshEmployeeChats = async (): Promise<void> => {
    const users = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.chats', 'chat')
      .leftJoinAndSelect('chat.users', 'user1')
      .where('user.role = :role', { role: Role.employee })
      .getMany();
    
    let chats: Chat[] = [];
    for (const user1 of users) {
      for (const user2 of users) {
        if (user1 === user2) {
          continue;
        }

        if (!user1.chats) {
          continue;
        }

        if (user1.chats.length == 0) {
          if (!this.employeeChatCreated(user1, user2, chats)) {
            chats.push(new Chat(ChatType.employee, undefined, [user1, user2]));
          }
          continue;
        }

        const user1User2Chat = user1.chats.find((_chat: Chat) => {
          if (!_chat.users) {
            return false;
          }
          return _chat.users?.some((_user: User) => _user.id == user2.id)
            && _chat.users.length == 2;
        });

        if (!user1User2Chat) {
          chats.push(new Chat(ChatType.employee, undefined, [user1, user2]));
        }
      }
    }

    await getRepository(Chat).save(chats);
  }

  private employeeChatCreated = (user1: User, user2: User, chats: Chat[]) => {
    const chat = chats.find((chat: Chat) => {
      return chat.users?.length == 2
        && chat.users?.some((_user: User) => _user.id == user1.id) 
        && chat.users?.some((_user: User) => _user.id == user2.id);
    });

    return chat ? true : false;
  }

  public createUnassignedChat = async (
      user: User, 
      appContext: string, 
      messageText?: string,
      messageTimestamp?: Date): Promise<Chat> => {
    const users = await getRepository(User).find({
      where: { role: 'employee' }
    });

    users.push(user);

    const chat = new Chat(ChatType.unassigned, appContext, users);
    await getRepository(Chat).save(chat);
    if (messageText && messageTimestamp) {
     await new MessageService().createMessage(messageText, messageTimestamp, chat, user);
    }
    return chat;
  }

  public setChat = async (id: number, type?: ChatType, users?: User[]) => {
    const chatRepository = getRepository(Chat);
    const chat = await chatRepository.findOne({
      relations: ['users'],
      where: { id }
    });

    if (!chat) {
      return;
    }

    if (type) {
      chat.type = type;
    }
    
    if (users) {
      chat.users = users;
    }

    await chatRepository.save(chat);
    return chat;
  }

  public getChatsNotClosed = async (userId: number) => {
    const chats = await getRepository(Chat)
      .createQueryBuilder('chat')
      .innerJoin('chat.users', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('NOT chat.type = :type', { type: ChatType.closed })
      .getMany()

    return chats;
  }
}

export default ChatService;
