  /**
   * Helper to retrieve an item
   *
   * @params get the next item from the items list
   * @return an item or null if no more items in list
   */
  export default function getNextItem(playlist, currentId, missingPreviewSkip) {
    if (currentId >= playlist.length) {
      return -1;
    }
    if (missingPreviewSkip && playlist[currentId].track.preview_url === null) {
      return getNextItem(playlist, currentId + 1, missingPreviewSkip);
    } else {
      return currentId;
    }
  }
