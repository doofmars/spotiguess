/**
 * Get all possible voting options from tracks
 *
 * @param {Array} playlist Playlist containing all tracks
 */
export default function getVotingOptions(playlist): Array<string> {
  const set = new Set<string>();
  playlist.forEach(function callback(track) {
    set.add(track.added_by.id);
  });
  return Array.from(set);
}
