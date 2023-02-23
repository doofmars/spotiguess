import * as React from "react";
import Switch from "react-switch";

type ConfigProps = {
  options: {
    // Number of rounds to play
    rounds: number
    // sound volume
    volume: number
    // instantly show if a player has voted
    showVotes: boolean
    // show score while playing
    showScore: boolean
    // skip songs without preview
    missingPreviewSkip: boolean
  }
  setRounds: (rounds: number) => void
  // setVolume: Function
  setShowVotes: (showVotes: boolean) => void
  setShowScore: (showScore: boolean) => void
  // setMissingPreviewSkip: Function
}

export default class Config extends React.Component<ConfigProps> {
  render() {
    return (
      <form className="config">
        <div className="form-group row">
          <label className="col-sm-6 col-form-label text-right">Number of rounds</label>
          <div className="col-sm-6">
            <input type="number" className="form-control"
                   value={this.props.options.rounds}
                   onChange={(e) => this.props.setRounds(Number(e.currentTarget.value))}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-6 col-form-label text-right">Show who has voted</label>
          <div className="col-sm-6">
            <Switch onChange={(checked) => this.props.setShowVotes(checked)} checked={this.props.options.showVotes}
                    uncheckedIcon={false} checkedIcon={false}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-6 col-form-label text-right">Show score while playing</label>
          <div className="col-sm-6">
            <Switch onChange={(checked) => this.props.setShowScore(checked)} checked={this.props.options.showScore}
                    uncheckedIcon={false} checkedIcon={false}/>
          </div>
        </div>
      </form>
    );
  }
}
