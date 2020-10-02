import React from 'react';
import PropTypes from 'prop-types';
import './Song.css';
import artistList from './../logic/artistList.js';
import { HostContext } from './HostContextProvider.js'

export default class Song extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      countdown: 20,
      audio: new Audio(this.props.songData.track.preview_url)
    }
  }

  static contextType = HostContext;

  componentDidMount() {
    this.state.audio.play()
    this.state.audio.volume = this.context.state.volume
    this.timer = setInterval(() => {
      this.setState({ countdown: this.state.countdown - 1 });
      if (this.state.countdown === 0) {
        this.setState({showResult: true})
      }
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.songData.track.id !== prevProps.songData.track.id) {
      clearInterval(this.timer);
      this.state.audio.pause()
      this.state.audio.src = this.props.songData.track.preview_url;
      this.setState({
        showResult: false,
        countdown: 20
      });
      this.timer = setInterval(() => {
        this.setState({ countdown: this.state.countdown - 1 });
        if (this.state.countdown === 0) {
          this.setState({showResult: true})
        }
      }, 1000);
      this.state.audio.volume = this.context.state.volume
      this.state.audio.play()
    }
  }

  componentWillUnmount() {
    this.state.audio.pause()
    clearInterval(this.timer);
  }

  render() {
    let track = this.props.songData.track;
    let addedBy = this.props.songData.added_by.id;
    let showResult = this.state.showResult;
    let resultPanel;
    if (!showResult) {
      resultPanel = <div id="countdown" key={this.props.songData.track.id}>
                      <div id="countdown-number">{this.state.countdown}</div>
                      <svg>
                        <circle r="36" cx="40" cy="40" style={this.state.animate}></circle>
                      </svg>
                    </div>
    } else {
      resultPanel = <button className="sbtn sbtn-white mb-1 btn-block" id="added-by" type="button">
                      Added by <br/> {addedBy}
                    </button>
    }
    return (
      <div id="song" className="content">
        <img width={track.album.images[0].width} height={track.album.images[0].height} src={track.album.images[0].url}></img>
        <div className="container smaller">
          <div className="row">
            <div className="col" id="song-info">
              <h2 className="white"><b className="cyan">{track.name}</b> <br/><small>by</small> <b className="olive">
                {artistList(track.artists)}</b></h2>
              <h2 className="white"><small>released on</small> <b className="magenta">{track.album.name}</b></h2>
            </div>
            <div className="col col-lg-4">
              <div className="vertical-center mx-auto">
                {resultPanel}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Song.propTypes = {
  songData: PropTypes.object.isRequired
};

