import express from "express";
import http from "http";
import socketIO from "socket.io";
import message from "./chat/message.socket";
import onConnection from "./chat/onConnection.socket";
import disconnect from "./chat/disconnect.socket";
import messageState from "./chat/messageState.socket";
import closeChat from "./chat/closeChat.socket";
import deleteMessage from './chat/deleteMessage.socket';
import editMessage from "./chat/editMessage.socket";
import createUnassignedChat from './chat/createUnasignedChat.socket';

const sockets = () => {
  const app = express();
  const server = new http.Server(app);
  const io = socketIO(server);
  const chatNsp = '/chat';
  const chatIO = io.of(chatNsp);

  io.of(chatNsp).on('connection', (socket: SocketIO.Socket) => {
    closeChat(socket, chatIO);
    createUnassignedChat(socket, chatIO);
    deleteMessage(socket);
    disconnect(socket);
    editMessage(socket);
    message(socket, chatIO);
    messageState(socket);
    onConnection(socket, chatIO);
  });

  return {
    listen: (socketsPort: number) => {
      io.listen(socketsPort);
    }
  }
}

export default sockets;