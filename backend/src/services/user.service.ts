import { User } from '../entities/user.entity';
import { getRepository } from "typeorm";

class UserService {
  public getUserById = async (userId: number): Promise<User | undefined> => {
    const user = await getRepository(User).findOne({
      where: { id: userId }
    });
    return user;
  }

  public getUserBySocket = async (socketId: string): Promise<User | undefined> => {
    const user = await getRepository(User).findOne({
      where: { socketId }
    });
    return user;
  }
  
  public refreshUsers = async (users: User[]) => {
    await getRepository(User).save(users);
  }

  public addSocket = async (socketId: string, userId: number) => {
    const user = await this.getUserById(userId);
    if (user) {
      user.socketId = socketId;
      await getRepository(User).save(user);
    }
  }

  public deleteSocket = async (userId: number) => {
    const user = await this.getUserById(userId);
    if (user) {
      user.socketId = null;
      await getRepository(User).save(user);
    }
  }
}

export default UserService;
