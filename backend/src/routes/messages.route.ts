import express from 'express';
import MessageController from '../controllers/messages.controller';

const messagesRouter = express.Router();
const messageController = new MessageController();

messagesRouter.get('/messages/:chatId', messageController.getMessages);

export default messagesRouter;