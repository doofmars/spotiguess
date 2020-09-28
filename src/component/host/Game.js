import React from 'react';
import PropTypes from 'prop-types';
import Song from './Song.js';
import { HostContext } from './HostContextProvider.js'

export default class Game extends React.Component {
  static contextType = HostContext;

  constructor(props, context) {
    super(props);
    if (context.state.playlistItems.length === 0) {
      this.props.viewChangeEvent('error');
    }
    this.state = {
      songData: context.state.playlistItems[0]
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="game container">
        <Song songData={this.state.songData} />
        <div class="container">
          <div class="row">
            <div class="col play players">
            </div>
            <div class="col-sm">
              <button class="sbtn sbtn-green mb-1 float-right" id="next">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  viewChangeEvent: PropTypes.func.isRequired,
  finishGame: PropTypes.func.isRequired
};
