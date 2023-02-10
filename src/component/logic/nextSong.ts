/**
 * get the next track from the playlist list
 *
 * @param {String} playlist Playlist containing all tracks
 * @param {Number} currentId Current track index
 * @param {Boolean} missingPreviewSkip Skip tracks without preview url
 * @returns The index of the next track or -1 if no suitable tracks are available
 */
function getNextTrack(playlist, currentId, missingPreviewSkip) {
  currentId += 1
  if (currentId >= playlist.length) {
    return -1;
  }
  if (missingPreviewSkip && playlist[currentId].track.preview_url === null) {
    return getNextTrack(playlist, currentId, missingPreviewSkip);
  } else {
    return currentId;
  }
}

/**
 * Return true if there is a suitable track in the playlist
 * @param {String} playlist Playlist containing all tracks
 * @param {Number} currentId Current track index
 * @param {Boolean} missingPreviewSkip Skip tracks without preview url
 */
function hasNextTrack(playlist, currentId, missingPreviewSkip) {
  return getNextTrack(playlist, currentId, missingPreviewSkip) < 0
}

export { getNextTrack, hasNextTrack };
