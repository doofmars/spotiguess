import {PlaylistItem} from "../host/Playlist";
import axios from "axios";

/**
 * Get all possible voting options from tracks
 *
 * @param {Array} playlist Playlist containing all tracks
 * @param access_token
 * @param successHandler
 * @param errorHandler
 */
export default function getVotingOptions(playlist: Array<PlaylistItem>, access_token, successHandler, errorHandler) {
  let requests = []
  const urls = new Set<string>();
  playlist.forEach(track => {
    if (!urls.has(track.added_by.href)) {
      requests.push(axios.get(track.added_by.href,
        {headers: {
            'Authorization': 'Bearer ' + access_token
          }}))
      urls.add(track.added_by.href)
    }
  });
  axios.all(requests).then(responses => {
    const map = new Map<string, string>();
    responses.forEach(response => {
      map.set(response.data.id, response.data.display_name)
    })
    successHandler(map)
  }).catch(errors => {
    console.log(errors);
    errorHandler()
  })
}
