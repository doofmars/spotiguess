/**
 * Generates a room code string containing only uppercase letters
 * @return {string} The generated string
 */
export default function generateRoomCode() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  if (process.env.NODE_ENV === "development") {
    return "AAAAA";
  }
  return text;
}
