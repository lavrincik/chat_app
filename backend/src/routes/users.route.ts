import express from 'express';
import UserController from '../controllers/user.controller';

const usersRouter = express.Router();
const userController = new UserController();

usersRouter.post('/users', userController.refreshUsers);

export default usersRouter;