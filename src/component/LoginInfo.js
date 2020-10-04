import React from 'react';
import './LoginInfo.css';
import PropTypes from 'prop-types';
import 'react-slidedown/lib/slidedown.css'
import {SlideDown} from 'react-slidedown'
import joinGame from "./socket/joinGame";

export default class LoginInfo extends React.Component {
  static propTypes = {
    votingViewChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      warning: '',
      warning_visible: false,
      name: '',
      roomcode: ''
    };
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  join = () => {
    let roomcode = this.state.roomcode.toUpperCase();
    if (! /^[a-z][-a-z _0-9]{0,15}$/i.test(this.state.name)) {
      this.setState({
        warning_visible: true,
        warning: 'Bad username, only chars, numbers or one of "-_ ". Must start with a char and not longer than 15'
      });
      return;
    }
    if (! /^[A-Z]{5}$/.test(roomcode)) {
      this.setState({
        warning_visible: true,
        warning: 'Bad code, must be 5 characters'
      });
      return;
    }
    this.setState({
      warning_visible: false,
    });
    joinGame(this.state.name, roomcode, this.props.votingViewChange)
  }

  render() {
    let visibility = "hidden";
    if (this.state.warning_visible) {
      visibility = "visible";
    }

    return (
      <SlideDown className="my-dropdown-slidedown" closed={this.props.hidden}>
        <div id="join-info">
          <input id="name" name="name" maxLength="15" type="text" className="form-control mb-1" placeholder="Name"
            onChange={(value) => this.onChange(value)} value={this.state.name} />
          <input id="roomcode" name="roomcode" type="text" className="form-control mb-1"
            maxLength="5" placeholder="Roomkey" style={{'textTransform': 'uppercase'}}
            onChange={(value) => this.onChange(value)} value={this.state.roomcode} />
          <button className="sbtn sbtn-green mb-1 float-right" id="join-accept" type="button"
            onClick={this.join}>
            Join
          </button>
        </div>
        <div className="join-waring">
          <p id="bad-message" className="text-danger"
            style={{'visibility': visibility}}>{this.state.warning}</p>
        </div>
      </SlideDown>
    );
  }
}
