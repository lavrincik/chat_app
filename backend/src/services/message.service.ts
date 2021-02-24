import { getRepository } from "typeorm";
import { Message } from '../entities/message.entity';
import { Chat } from "../entities/chat.entity";
import { User } from "../entities/user.entity";
import { MessageState } from '../entities/messageState';
import { IMessageState } from '../types/messageState.type';
import { Flag } from "../types/messageFlag.type";

class MessageService {
  public getMessageWithChat = async (messageId: number) => {
    const message = await getRepository(Message).findOne({
      relations: ['chat'],
      where: { id: messageId }
    });
    return message;
  }

  public getMessagesWithUsers = async (chatId: number, limit: number, offset: number) => {
    const messages = await getRepository(Message)
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.user', 'user')
      .innerJoinAndSelect('message.states', 'states')
      .innerJoinAndSelect('states.user', 'statesUser')
      .innerJoin('message.chat', 'chat')
      .where('chat.id = :chatId', { chatId })
      .orderBy('message.timestamp', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();
    
    return messages;
  }

  public createMessage = async (text: string, timestamp: Date, chat: Chat, user: User): Promise<Message> => {
    const message = new Message(text, timestamp, chat, user);
    const messageRepository = getRepository(Message);
    await messageRepository.save(message);

    const users = await getRepository(User)
      .createQueryBuilder('user')
      .innerJoin('user.chats', 'chat')
      .where('chat.id = :chatId', { chatId: chat.id })
      .andWhere('NOT user.id = :userId', { userId: user.id })
      .getMany();
    
    let messageStates: MessageState[] = [];
    const messageStateRepository = getRepository(MessageState);
    for (const user of users) {
      const messageState = new MessageState(user, message);
      messageStates.push(messageState);
    }
    await messageStateRepository.save(messageStates);

    message.states = messageStates;
    await messageRepository.save(message);
    return message;
  }

  public setMessageState = async (userId: number, messageId: number, state: IMessageState): Promise<void> => {
    const messageStateRepository = getRepository(MessageState)
    const messageState = await messageStateRepository
      .createQueryBuilder('state')
      .innerJoin('state.message', 'message')
      .where('message.id = :messageId', { messageId: messageId })
      .innerJoin('state.user', 'user')
      .andWhere('user.id = :userId', { userId: userId })
      .getOne();

    if (!messageState) {
      return
    };

    messageState.state = state;
    await messageStateRepository.save(messageState);
  }

  public editMessage = async (messageId: number, editedText: string) => {
    const messageRepository = getRepository(Message);
    const message = await messageRepository.findOne({
      relations: ['chat'],
      where: { id: messageId }
    });

    if (!message) return;

    message.editedText = editedText;
    message.flag = Flag.edited;
    await messageRepository.save(message);
    return message;
  }

  public deleteMessage = async (messageId: number) => {
    const messageRepository = getRepository(Message);
    const message = await messageRepository.findOne({
      relations: ['chat'],
      where: { id: messageId }
    });

    if (!message) return;

    message.flag = Flag.deleted;
    await messageRepository.save(message);
    return message;
  }
}

export default MessageService;
