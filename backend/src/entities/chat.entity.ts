import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToMany, JoinTable } from "typeorm";
import { Message } from "./message.entity";
import { ChatType } from '../types/chatType.type';
import { User } from "./user.entity";

@Entity()
export class Chat {
  constructor(chatType: ChatType, appContext?: string, users?: User[]) {
    this.type = chatType;
    this.appContext = appContext;
    this.users = users;
  }

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public type: ChatType;

  @Column({
    nullable: true
  })
  public appContext?: string;

  @OneToMany(_type => Message, message => message.chat)
  public messages?: Message[]; 

  @ManyToMany(_type => User, user => user.chats)
  @JoinTable()
  public users?: User[];
}