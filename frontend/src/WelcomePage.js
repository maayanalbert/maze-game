import React, { Component } from 'react';
import './App.css';
import { getData } from './util/Auth.js';
import store from './store';
import { setToken } from './actions';
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
    let actualWidth = props.actualWidth
    let actualHeight = props.actualHeight
    let startDay = props.startDay;
    let logs = props.logs;
    let maxLogs = 1008
    let parsedLogs = []
    let fakeFriends = []
    let margin = 50
    let indexHeight = 20
    let graphScale = 6
    let friendStep = 1
    let weekDays = ['Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat', 'Sun']
    p5.setup = () => {
      p5.strokeCap(p5.SQUARE);
      for(var i = 0; i < 1008; i++){
        fakeFriends.push(p5.random(0, 10))
      }
    }

    p5.draw = () => {
      console.log(actualHeight)
      // console.log(logs)
      //"2017-11-28T01:13:40Z"
      var selectedEllipseSize = 5
      var day = startDay
      var minStep = ((width - margin*2)/7)/(24*60)
      var time 
      var total
      var totalDiffs 
      var mean
      var standardDev
      p5.background(255)
      p5.stroke(217);
      var stroke_weight = 2
      p5.line(margin, actualHeight - margin - indexHeight, 
        actualWidth - margin, actualHeight - margin - indexHeight);
      for(var i = 0; i < 7; i++){
        p5.strokeWeight(stroke_weight);
        p5.line(i*(actualWidth-2*margin)/7 + margin, actualHeight - margin,
          i*(actualWidth-2*margin)/7 + margin, actualHeight - margin - indexHeight-stroke_weight+2)
        p5.strokeWeight(0);
        p5.fill(217);
        p5.text(weekDays[i], 
          i*(actualWidth-2*margin)/7 + margin - p5.textWidth(weekDays[i])/2, 
          actualHeight - margin + 20)
      }


      ////////////////////////////////////////////////

      total = 0
      for(var i = 0; i < parsedLogs.length; i+=friendStep){
        total += parsedLogs[i][1]
      }
      mean = total/(parsedLogs.length/friendStep)

      totalDiffs = 0
      for(var i = 0; i < parsedLogs.length; i+=friendStep){
        var tempDiff = mean - parsedLogs[i][1]
        if(tempDiff < 0){
          tempDiff = tempDiff * -1
        }
        totalDiffs += tempDiff
      }

      standardDev = totalDiffs/(parsedLogs.length/friendStep)

      console.log(mean, standardDev)


      //////////////////////////////////////////////////

      var run = [null, null]
      var runs = []

      for(var i = 0; i < parsedLogs.length; i+=friendStep){
        p5.strokeWeight(2)
        p5.stroke(217);
        p5.strokeCap(p5.ROUND);
        var currentLog = parsedLogs[i]
        if(i != parsedLogs.length-1){
          var nextLog = parsedLogs[i+friendStep]
          p5.line(currentLog[0] + margin, actualHeight - margin*2 - currentLog[1]* graphScale,
          nextLog[0] + margin, actualHeight - margin*2 - nextLog[1]* graphScale)
          if(currentLog[1] - mean > standardDev){
            if(run[0] == null){
              run[0] = i
              run[1] = 0
            }else{
              run[1] += 1
            }
            p5.fill(255, 0, 0)
            p5.strokeWeight(0)
            // p5.ellipse(currentLog[0] + margin, actualHeight - margin*2 - currentLog[1]* graphScale,
            //             2, 2)
          }else{
            if(run[0] != null && run[1] >= 2){
              console.log('run: ' + run)
              runs.push(run[0])
            }
            run = [null, null]
          }
        }
      }


      // console.log(runs)
      for(var i = 0; i < parsedLogs.length; i+=friendStep){
        p5.strokeWeight(0)
        p5.fill(22, 170, 197)
        for(var j = 0; j < runs.length; j++){
          if(i == runs[j]){
            var ellipseX = parsedLogs[i][0] + margin
            var ellipseY = actualHeight - margin*2 - parsedLogs[i][1]* graphScale
            p5.ellipse(ellipseX, 
                    ellipseY,
                    6, 6)

            if(p5.mouseX <= ellipseX + 5 && p5.mouseY <= ellipseY + 5 &&
              p5.mouseX >= ellipseX - 5 && p5.mouseY >= ellipseY - 5){
                p5.ellipse(ellipseX, ellipseY, 
                  9, 9)

            var thisTime = logs[i][0]
            var thisHour = parseInt(thisTime.slice(11,13))
            var thisMin = parseInt(thisTime.slice(14:16))

            if(thisHour > 12){
              if(thisMin < 10){
                var message = String(thisHour - 12) + ':0' + String(thisMin) + " pm"
              }else{
                var message = String(thisHour - 12) + ':' + String(thisMin) + " pm"
              }
            }else if(thisHour == 12){
              if(thisMin < 10){
                var message = String(thisHour) + ':0' + String(thisMin) + " pm"
              }else{
                var message = String(thisHour) + ':' + String(thisMin) + " pm"
              }
            }else{
              if(thisMin < 10){
                var message = String(thisHour) + ':0' + String(thisMin) + " am"
              }else{
                var message = String(thisHour) + ':' + String(thisMin) + " am"
              }
            }

            p5.text(message, ellipseX - p5.textWidth(message)/2, ellipseY - 20)

            }
          }          
        }
      }
      p5.strokeWeight(2)

      p5.stroke(0);

    };

    // p5.highlightCircle = (x, y, size) => {
    //   this.x = x
    //   this.y = y 
    //   this.size = size
    //   this.grow = () =>{
    //     if(this.size < 15){
    //       this.size += 1
    //     }
    //   }
    //   this.shrink = () =>{
    //     if(this.size > 5){
    //       this.size -= 1
    //     }
    //   }
    // }

    p5.receiveProps = (nextProps) => {
      parsedLogs = []
      startDay = nextProps.startDay;
      logs = nextProps.logs; 
      actualHeight = nextProps.actualHeight;
      actualWidth = nextProps.actualWidth;
      var day = startDay
      var minStep = ((actualWidth- margin*2)/7)/(24*60)
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
    this.state = {fbpassword: '', logs: [], startDay: null, 
    windowWidth: '0', windowWidth: window.innerWidth, windowHeight: window.innerHeight };

    this.logout = this.logout.bind(this);
    this.handleSetPassword = this.handleSetPassword.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.upDateLogs = this.upDateLogs.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  getDataFromAPI() {
    getData().then(function(response) {
      alert(response.data.phil)
    })
  }

  //////////////////////////////////

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  }

  ////////////////////////////////////////


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
      <div style={{ width: this.state.windowWidth, height: this.state.windowHeight/4 }} onClick={() => { this.setState({ value: (this.state.value + 5)%256 }) }}>
      <Sketch
          sketch={sketch}
          width={this.state.windowWidth}
          height={this.state.windowHeight/4}
          sketchProps={{ logs: this.state.logs, startDay: this.state.startDay, 
            actualWidth: this.state.windowWidth/1.2, actualHeight: this.state.windowHeight/2}}
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
      <ReactInterval timeout={180} enabled={eval(localStorage.getItem('tracking'))}
        callback={this.upDateLogs} />
      </div>
    );
  }
}


export default WelcomePage;


