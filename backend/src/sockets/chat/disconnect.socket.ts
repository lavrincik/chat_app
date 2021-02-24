import SocketIO from 'socket.io';
import UserService from '../../services/user.service';

const disconnect = (socket: SocketIO.Socket) => {
    socket.on('disconnect', async () => {
        const userService = new UserService();
        const user = await userService.getUserBySocket(socket.id);
        if (user !== undefined) {
            await userService.deleteSocket(user.id);
        }
    });
}

export default disconnect;