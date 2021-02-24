import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Message } from "./message.entity";
import { IMessageState } from '../types/messageState.type';

@Entity()
export class MessageState {
    constructor(user: User, message: Message) {
        this.state = IMessageState.sent;
        this.user = user;
        this.message = message;
    }

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public state: IMessageState;

    @ManyToOne(() => User)
    public user: User;

    @ManyToOne(() => Message, message => message.states)
    public message: Message;
}