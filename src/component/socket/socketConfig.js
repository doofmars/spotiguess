import openSocket from 'socket.io-client';

const socket = openSocket("https://spotiguess.herokuapp.com/");

export default socket;
