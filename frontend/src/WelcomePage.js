import React, { Component } from 'react';
import './App.css';
import { getData } from './util/Auth.js';
import store from './store';
import { setToken } from './actions'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { plugInPassword } from './util/Auth.js';
import ReactInterval from 'react-interval';
import { getLogs } from './util/Auth.js';
import { Sketch } from './components/sketch';
import Moment from 'moment';
import 'moment-timezone';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

const sketch = (width, height, props) => {
  return function (p5) {
    let startDay = props.startDay;
    let logs = props.logs;
    let maxLogs = 1008
    let parsedLogs = []
    let fakeFriends = []
    let margin = 50
    let indexHeight = 20
    let graphScale = 3
    let friendStep = 5
    let weekDays = ['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat']
    p5.setup = () => {
      p5.strokeCap(p5.SQUARE);
      for(var i = 0; i < 1008; i++){
        fakeFriends.push(p5.random(0, 10))
      }
    }

    p5.draw = () => {
      // console.log(startDay)
      // console.log(logs)
      //"2017-11-28T01:13:40Z"
      var day = startDay
      var minStep = ((width - margin*2)/7)/(24*60)
      var time 

      p5.fill(255, 16);
      p5.stroke(217);
      var stroke_weight = 2
      p5.line(margin, height - margin - indexHeight, 
        width - margin, height - margin - indexHeight);
      for(var i = 0; i < 7; i++){
        p5.strokeWeight(stroke_weight);
        p5.line(i*(width-2*margin)/7 + margin, height - margin,
          i*(width-2*margin)/7 + margin, height - margin - indexHeight-stroke_weight+2)
        p5.strokeWeight(1);
        p5.text(weekDays[i], 
          i*(width-2*margin)/7 + margin - p5.textWidth(weekDays[i])/2, 
          height - margin + 20)
      }     

      for(var i = 0; i < 1008; i+=friendStep){
        var step = (width - margin*2)/1008
        p5.strokeWeight(2)
        p5.stroke(22, 175, 203)
        p5.strokeCap(p5.ROUND);
        p5.line(margin + step*i, height - margin*3 +fakeFriends[i]* graphScale,
        margin + step*(i + friendStep), height - margin*3 + fakeFriends[i + friendStep]* graphScale)
      }
      p5.noStroke();

      p5.rect(0, 0, width, height);
      p5.stroke(0);

    };

    p5.receiveProps = (nextProps) => {
      parsedLogs = []
      startDay = nextProps.startDay;
      logs = nextProps.logs; 
      var day = startDay
      var minStep = ((width - margin*2)/7)/(24*60)
      var currentTime
      var lastTime
      var time = 0
      if(logs != []){
      for(var i = 0; i < logs.length; i++){
        currentTime = logs[i][0]
        if(i != 0){
          var lastTime = logs[i-1][0]
          if(currentTime.slice(8,10) != lastTime.slice(8,10)){
            day = (day + 1)%7
          }
        }
        time = (parseInt(currentTime.slice(11,13))*60 + parseInt(currentTime.slice(14:16)))
        parsedLogs.push([(day*24*60 + time)*minStep, logs[i][1]] ) 
      }
      console.log(parsedLogs) 
      } 

     
    };

    p5.unmount = () => {
      console.log('The sketch was unmounted. Width was ' + width + ', height was ' + height);
    }
  }
};

export class WelcomePage extends Component{
  constructor(props) {
    super(props);
    this.state = {fbpassword: '', logs: [], startDay: null};

    this.logout = this.logout.bind(this);
    this.handleSetPassword = this.handleSetPassword.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.upDateLogs = this.upDateLogs.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
  }

  getDataFromAPI() {
    getData().then(function(response) {
      alert(response.data.phil)
    })
  }


  handleSetPassword(event) {
    this.setState({fbpassword: event.target.value, value: 0 });
  }

  startTracking(event) {
    // console.log(this.state.fbpassword)
    plugInPassword(this.state.fbpassword)
    localStorage.setItem('tracking', true)
    this.setState({fbpassword: null})
    this.upDateLogs()
    // this.setState({
    //   startDay: Moment(Date.now()).toString()
    // })
    // console.log(this.state.startDay)
  }

  stopTracking(event) {
    localStorage.setItem('tracking', false)
    this.setState({fbpassword: 'null'})
  }

  logout(){
    store.dispatch(setToken(null));
    localStorage.setItem('loggedIn', false)
    localStorage.setItem('username', null)
    localStorage.setItem('password', null)
    this.props.setLoggedOut()
  }

  renderMessage(){
   return (
    'Hi ' + String(localStorage.getItem('username')) + ', you are logged in.') 
  }

  renderContent(){
    if(eval(localStorage.getItem('tracking')) == false){
    return(
      <div>
      <h2 className="App-header-text">
      To start recording when your friends are online, enter your facebook password below.
      </h2>
      <br />
      <h2 className="App-header-text">
      We will only use your password to authenticate your account and will not save it.
      </h2>
      <br />
      <TextField
        hintText="Facebook Password" value={this.state.fbpassword} onChange={this.handleSetPassword}/>
      <br />
      <br />
      <RaisedButton primary={true} label="Start Tracking" onClick={this.startTracking} />
      </div>
    )
    }
    else{
    return(
      <div>
      <div style={{ width: '60%', height: '90pt' }} onClick={() => { this.setState({ value: (this.state.value + 5)%256 }) }}>
      <Sketch
          sketch={sketch}
          width={'60%'}
          height={'90pt'}
          sketchProps={{ logs: this.state.logs, startDay: this.state.startDay}}
        />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <RaisedButton float = 'left' primary={false} label="Stop Tracking" onClick={this.stopTracking} />
      </div>
    )
    }  
  }

  upDateLogs(){
    getLogs().then(function(response) {
      localStorage.setItem('logs', response.data[0])
      this.setState({logs: response.data.logs})
      this.setState({
        startDay: response.data.startDay
    })
    }.bind(this))
  }

  render() {
    return (
      <div>
      <br />
      {this.renderContent()}
      <ReactInterval timeout={1800} enabled={eval(localStorage.getItem('tracking'))}
        callback={this.upDateLogs} />
      </div>
    );
  }
}


export default WelcomePage;


