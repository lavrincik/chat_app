import express from 'express';
import ChatController from '../controllers/chat.controller';

const chatsRouter = express.Router();
const chatController = new ChatController();

chatsRouter.get('/chats/:userId', chatController.getChats);
chatsRouter.patch('/chat/:chatId', chatController.patchChat);

export default chatsRouter;