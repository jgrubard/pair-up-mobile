import io from 'socket.io-client';
import productionUrl from './productionUrl';
const socket = io(productionUrl);
socket.connect();
export default socket;
