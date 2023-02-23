import {PlaylistOverviewItem} from "../models/Playlist";
import * as React from "react";
import Image from "react-bootstrap/Image";

type PlaylistRowProps = {
  index: number
  key: number
  selectedPlaylistId: string
  playlistOverview: PlaylistOverviewItem
  selectPlaylist: (playlistId: string) => void
}

export default class PlaylistRow extends React.Component<PlaylistRowProps> {
  render() {
    return (
      <tr id={this.props.index.toString()}
          className={this.props.selectedPlaylistId === this.props.playlistOverview.id ? 'selected' : null}>
        <th scope="row">{this.props.index + 1}</th>
        <td><Image width="150" height="150" thumbnail src={this.props.playlistOverview.images[0].url}/></td>
        <td>{this.props.playlistOverview.name}</td>
        <td>{this.props.playlistOverview.owner.display_name}</td>
        <td>{this.props.playlistOverview.tracks.total}</td>
        <td>
          <button className="sbtn sbtn-green" id={this.props.playlistOverview.id} value={this.props.index} type="button"
                  onClick={() => {
                    this.props.selectPlaylist(this.props.playlistOverview.id)
                  }}>
            Select
          </button>
        </td>
      </tr>
    )
  }
}
