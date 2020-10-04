import React from 'react';
import PropTypes from 'prop-types';
import Song from './Song.js';
import { HostContext } from './HostContextProvider.js'
import nextSong from './../logic/nextSong.js'


export default class Game extends React.Component {
  static contextType = HostContext;
  static propTypes = {
    viewChangeEvent: PropTypes.func.isRequired,
    finishGame: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props);
    if (context.state.playlistItems.length === 0) {
      this.props.viewChangeEvent('error', 'The selected playlst has no tracks');
    }
    let itemsId = nextSong(context.state.playlistItems, 0, context.state.missingPreviewSkip);
    if (itemsId < 0) {
      this.props.viewChangeEvent('error', 'The selected playlst has suitable tracks to your configuration');
    }
    this.state = {
      itemsId: itemsId,
      songData: context.state.playlistItems[itemsId]
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.context.nextRound();
      if (this.context.state.round >= this.context.state.roundEnd) {
        this.props.finishGame();
      }
      let itemsId = nextSong(
        this.context.state.playlistItems,
        this.state.itemsId + 1,
        this.context.state.missingPreviewSkip);

      this.setState({
        itemsId: itemsId,
        songData: this.context.state.playlistItems[itemsId],
        showResult: false,
        countdown: 20,
        audio: new Audio(this.context.state.playlistItems[itemsId].track.preview_url)
      });
    }, 30_000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="game container">
        <Song songData={this.state.songData} />
        <div className="container">
          <div className="row">
            <div className="col play players">
            </div>
            <div className="col-sm">
              <button className="sbtn sbtn-green mb-1 float-right" id="next">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
