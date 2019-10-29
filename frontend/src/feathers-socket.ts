import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
// @ts-ignore
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_HOST!);
const app = feathers();
app.configure(socketio(socket));

export default app;
