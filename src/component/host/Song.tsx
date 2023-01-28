import * as React from 'react';
import * as PropTypes from 'prop-types';
import './Song.css';
import artistList from '../logic/artistList';
import {HostContext} from './HostContextProvider'
import {Playlist, PlaylistItem} from "./Playlist";

type IProps = {
  songData: PlaylistItem;
  showResult: boolean;
  updateShowResults: Function;
}

type IState = {
  countdown: number;
  audio: any;
  playlists: Playlist;
  animate: any
  view: string; message: string; hash: null
}

export default class Song extends React.Component<IProps, IState> {
  static propTypes = {
    songData: PropTypes.object.isRequired
  }

  state: IState
  private timer: NodeJS.Timeout;

  constructor(props) {
    super(props);
    let audio = new Audio(this.props.songData.track.preview_url);
    audio.volume = this.context.state.volume;
    this.setState({
      countdown: 20,
      audio: audio
    })
  }

  context!: React.ContextType<typeof HostContext>

  componentDidMount() {
    this.state.audio.play()
    this.timer = setInterval(() => {
      this.setState({ countdown: this.state.countdown - 1 });
      if (this.state.countdown === 0) {
        this.props.updateShowResults(true)
      }
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.songData.track.id !== prevProps.songData.track.id) {
      clearInterval(this.timer);
      this.state.audio.pause()
      this.props.updateShowResults(false)
      this.setState({
        countdown: 20
      });
      this.timer = setInterval(() => {
        this.setState({ countdown: this.state.countdown - 1 });
        if (this.state.countdown === 0) {
          this.props.updateShowResults(true)
        }
      }, 1000);
      let audio = this.state.audio
      audio.src = this.props.songData.track.preview_url;
      audio.volume = this.context.state.volume
      this.setState({
        audio: audio
      })
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
    let showResult = this.props.showResult;
    let resultPanel;
    if (!showResult) {
      //TODO: find out what animate does here?!?
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
        <img width={track.album.images[0].width}
             height={track.album.images[0].height}
             src={track.album.images[0].url}
             alt={track.album.name}></img>
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

