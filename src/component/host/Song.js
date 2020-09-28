import React from 'react';
import './Song.css';
import artistList from './../logic/artistList.js';

export default class Song extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        showResult: false,
        countdown: 20,
      }
    }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ countdown: this.state.countdown - 1 });
      if (this.state.countdown === 0) {
        this.setState({showResult: true})
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    let track = this.props.songData.track;
    let addedBy = this.props.songData.added_by.id;
    let showResult = this.state.showResult;
    let resultPanel;
    if (!showResult) {
      resultPanel = <div id="countdown">
                      <div id="countdown-number">{this.state.countdown}</div>
                      <svg>
                        <circle r="36" cx="40" cy="40"></circle>
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
