import {PlaylistOverview} from "../models/Playlist";
import * as React from "react";
import PlaylistRow from "./PlaylistRow";

type PlaylistProps = {
  playlistOverview: PlaylistOverview
  selectedPlaylistId: string
  selectPlaylist: (playlistId: string) => void
}

export default class PlaylistTable extends React.Component<PlaylistProps> {
  render() {
    return (
      <table className="table table-dark">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Image</th>
          <th scope="col">Name</th>
          <th scope="col">Owner</th>
          <th scope="col">Tracks</th>
          <th scope="col"></th>
        </tr>
        </thead>
        <tbody id="playlists">
        {this.props.playlistOverview.items.map((playlist, index) => {
          return (
            <PlaylistRow
              playlistOverview={playlist}
              selectedPlaylistId={this.props.selectedPlaylistId}
              selectPlaylist={this.props.selectPlaylist}
              index={index} key={index}/>
          );
        })}
        </tbody>
      </table>
    );
  }
}
