export default function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  // Clear hash location from url to prevent access key leaking
  window.history.replaceState(null, null, ' ');
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}
