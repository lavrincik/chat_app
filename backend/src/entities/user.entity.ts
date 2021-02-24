import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Role } from '../types/role.type';
import { Chat } from './chat.entity';

@Entity()
export class User {
  constructor(id: number, name: string, role: Role, chats?: Chat[]) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.chats = chats;
  }

  @PrimaryColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public role: Role;

  @Column({
    type: 'varchar',
    length: '255',
    nullable: true
  })
  public socketId?: string | null;

  @ManyToMany(() => Chat, chat => chat.users)
  public chats?: Chat[];
}
