/**
 * Get all possible voting options from tracks
 *
 * @param {List} playlist Playlist containing all tracks
 */
export default function getVotingOptions(playlist) {
  var set = new Set();
  playlist.forEach(function callback(track) {
    set.add(track.added_by.id);
  });
  return Array.from(set);
}
