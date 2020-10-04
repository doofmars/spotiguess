import socket from "../api/socketConfig";

/**
 * Join a given game, only call callback if join was accepted.
 *
 * @param {String} name name of the player
 * @param {String} roomcode code vor the server 'room'
 * @param {Function} callback callback to change view has to accept the name and roomcode
 */
export default function joinGame(name, roomcode, callback) {
  socket.emit('request-join', {
    name:name,
    roomcode:roomcode,
    options:false,
    votetime:new Date()
  });
  socket.on('join-accepted', function(msg){
    if (msg === name) {
      console.log('join-accepted');
      callback(name, roomcode);
    }
  });
}
