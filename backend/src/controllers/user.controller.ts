import { Request, Response } from 'express';
import UserService from '../services/user.service';
import ChatService from '../services/chat.service';

class UserController {
  public refreshUsers = async (req: Request, res: Response) => {
    const users = req.body;

    if (!users) {
      return res.status(400).send({
        message: "No users provided."
      });
    }

    await new UserService().refreshUsers(users);
    const chatService = new ChatService();
    await chatService.refreshEmployeeChats();

    return res.send();
  }
}

export default UserController;