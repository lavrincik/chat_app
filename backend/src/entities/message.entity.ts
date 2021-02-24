import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from './user.entity';
import { MessageState } from './messageState';
import { Flag } from '../types/messageFlag.type';

@Entity()
export class Message {
  constructor(text: string, timestamp: Date, chat: Chat, user: User, states?: MessageState[]) {
    this.text = text;
    this.timestamp = timestamp;
    this.chat = chat;
    this.user = user;
    this.states = states;
    this.flag = Flag.none;
  }

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: "timestamp"})
  public timestamp: Date;

  @Column()
  public text: string;

  @Column({
    nullable: true
  })
  public editedText?: string;

  @Column()
  public flag: Flag;

  @OneToMany(() => MessageState, messageState => messageState.message)
  public states?: MessageState[];

  @ManyToOne(() => Chat, chat => chat.messages)
  public chat: Chat;

  @ManyToOne(() => User)
  public user: User; 
}