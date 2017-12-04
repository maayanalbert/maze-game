
// renders the view that users see after they have been logged in

import React, { Component } from 'react';
import './App.css';
import store from './store';
import { setToken } from './actions';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { plugInPassword, checkTracking } from './util/Auth.js';
import ReactInterval from 'react-interval';
import { getLogs, stopTracking } from './util/Auth.js';
import { Sketch } from './components/sketch';
import Moment from 'moment';
import 'moment-timezone';

// the p5 sketch that visulizes the logs
const sketch = (width, height, props) => {
  return function (p5) {

    // to make the sketch resizable, I passed in the inner window's width
    // and height and based the element of my skethc off of that
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
    }

    
    p5.draw = () => {
      // an example of what a time log would look like
      //"2017-11-28T01:13:40Z"

      var selectedEllipseSize = 5
      var day = startDay

      //the width of a minute on the graph
      var minStep = ((width - margin*2)/7)/(24*60)

      var time 
      var total
      var totalDiffs 
      var mean
      var standardDev
      p5.background(255)

      //draws the visualization labels and lines
      p5.stroke(217);
      var stroke_weight = 2
      p5.line(margin, actualHeight - margin - indexHeight, 
        actualWidth - margin, actualHeight - margin - indexHeight);
      for(var i = 0; i < 7; i++){
        p5.strokeWeight(stroke_weight);
        p5.line(i*(actualWidth-2*margin)/7 + margin, actualHeight - margin,
          i*(actualWidth-2*margin)/7 + margin, actualHeight - margin - 
          indexHeight - stroke_weight+2)
        p5.strokeWeight(0);
        p5.fill(217);
        p5.text(weekDays[i], 
          i*(actualWidth-2*margin)/7 + margin - p5.textWidth(weekDays[i])/2, 
          actualHeight - margin + 20)
      }

      // calculates the mean number of friends in all of the logs
      total = 0
      for(var i = 0; i < parsedLogs.length; i+=friendStep){
        total += parsedLogs[i][1]
      }
      mean = total/(parsedLogs.length/friendStep)

      // calculates the standard deviation for the logs
      totalDiffs = 0
      for(var i = 0; i < parsedLogs.length; i+=friendStep){
        var tempDiff = mean - parsedLogs[i][1]
        if(tempDiff < 0){
          tempDiff = tempDiff * -1
        }
        totalDiffs += tempDiff
      }
      standardDev = totalDiffs/(parsedLogs.length/friendStep)

      
      var run = [null, null]
      var runs = []

      // draws visualization
      for(var i = 0; i < parsedLogs.length; i+=friendStep){
        p5.strokeWeight(2)
        p5.stroke(217);
        p5.strokeCap(p5.ROUND);
        var currentLog = parsedLogs[i]
        if(i != parsedLogs.length-1){

          // draws lines in between each log to create the visualization
          var nextLog = parsedLogs[i+friendStep]
          p5.line(currentLog[0] + margin, 
            actualHeight - margin*2 - currentLog[1]* graphScale, 
            nextLog[0] + margin, 
            actualHeight - margin*2 - nextLog[1]* graphScale)

          // keeps track of runs, or sets of multiple logs in a row where the
          // number of friends are a certain amount of standard deviations above
          // the mean
          if(currentLog[1] - mean > standardDev*.3){
            if(run[0] == null){
              run[0] = i
              run[1] = 0
            }else{
              run[1] += 1
            }
            p5.fill(255, 0, 0)
            p5.strokeWeight(0)
          }else{
            if(run[0] != null && run[1] >= 5){
              runs.push(run[0])
            }
            run = [null, null]
          }
        }
      }

      //finds the beginning of each run and draws an ellipse over it
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

            // if the mouse is over the ellipse, make it bigger and display
            // the time
            if(p5.mouseX <= ellipseX + 5 && p5.mouseY <= ellipseY + 5 &&
              p5.mouseX >= ellipseX - 5 && p5.mouseY >= ellipseY - 5){
                p5.ellipse(ellipseX, ellipseY, 
                  9, 9)

              var thisTime = logs[i][0]
              var thisHour = parseInt(thisTime.slice(11,13))
              var thisMin = parseInt(thisTime.slice(14:16))

              if(thisHour > 12){
                if(thisMin < 10){
                  var message = String(thisHour - 12) + ':0' + String(thisMin) 
                  + " pm"
                }else{
                  var message = String(thisHour - 12) + ':' + String(thisMin) 
                  + " pm"
                }
              }else if(thisHour == 12){
                if(thisMin < 10){
                  var message = String(thisHour) + ':0' + 
                  String(thisMin) + " pm"
                }else{
                  var message = String(thisHour) + ':' + 
                  String(thisMin) + " pm"
                }
              }else{
                if(thisMin < 10){
                  var message = String(thisHour) + ':0' + 
                  String(thisMin) + " am"
                }else{
                  var message = String(thisHour) + ':' + 
                  String(thisMin) + " am"
                }
              }

              p5.text(message, ellipseX - p5.textWidth(message)/2, 
                ellipseY - 20)

            }
          }          
        }
      }
      p5.strokeWeight(2)

      p5.stroke(0);

    };

    // receives new inputs and updates properties accordingly
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

      // Use the time/date element of the logs to calculate the position of 
      // each of the logs on the visualization. Put these values into an array 
      // called parsedLogs.
      if(logs != []){
        for(var i = 0; i < logs.length; i++){
          currentTime = logs[i][0]
          if(i != 0){
            var lastTime = logs[i-1][0]
            if(currentTime.slice(8,10) != lastTime.slice(8,10)){
              day = (day + 1)%7
            }
          }
          time = (parseInt(currentTime.slice(11,13))*60 + 
            parseInt(currentTime.slice(14:16)))
          parsedLogs.push([(day*24*60 + time)*minStep, logs[i][1]] ) 
        }
      }      
    };

    p5.unmount = () => {
      console.log('The sketch was unmounted. Width was ' + width + 
        ', height was ' + height);
    }
  }
};

// the welcome page view

export class WelcomePage extends Component{
  constructor(props) {
    super(props);
    this.state = {fbpassword: '', logs: [], startDay: null, 
    windowWidth: '0', windowWidth: window.innerWidth, windowHeight: window.innerHeight };

    this.logout = this.logout.bind(this);
    this.handleSetPassword = this.handleSetPassword.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.upDateLogs = this.upDateLogs.bind(this);
    this.stop_Tracking = this.stop_Tracking.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  /////////////////////////////////////
  // calculates the width and height of the inner window

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

  /////////////////////////////////////

  // saves the content written in the password box
  handleSetPassword(event) {
    this.setState({fbpassword: event.target.value, value: 0 });
  }

  // tells the backend to start running the scraper and changes the view
  // to show the visualization
  startTracking(event) {
    plugInPassword(this.state.fbpassword)
    localStorage.setItem('tracking', true)
    this.setState({fbpassword: null})
    this.upDateLogs()
  }

  // changes the view to show password input
  stop_Tracking(event) {
    localStorage.setItem('tracking', false)
    stopTracking()
    this.setState({fbpassword: 'null'})
  }

  // logs the user out
  logout(){
    store.dispatch(setToken(null));
    localStorage.setItem('loggedIn', false)
    localStorage.setItem('username', null)
    localStorage.setItem('password', null)
    this.props.setLoggedOut()
  }

  renderContent(){

    // check if the user is currently tracking friends by accessing the backend
    // and then set the local storage accordingly
    checkTracking().then(function(response) {
      localStorage.setItem('tracking', response.data)
    }.bind(this))

    console.log('tracking: ' + localStorage.getItem('tracking'))

    // if the user is not tracking friend data, show the password input field
    if(eval(localStorage.getItem('tracking')) == false){
      return(
        <div>
          <h2 className="App-header-text">
            To start recording when your friends are online, 
            enter your facebook password below.
          </h2>
          <br />
          <h2 className="App-header-text">
            We will only use your password to authenticate your account and will 
            not save it.
          </h2>
          <br />
          <TextField
            hintText="Facebook Password" value={this.state.fbpassword} 
            onChange={this.handleSetPassword}/>
          <br />
          <br />
          <RaisedButton 
            primary={true} label="Start Tracking" 
            onClick={this.startTracking} />
        </div>
      )

    // if the user is tracking friend data, don't show the visualization
    }else{
      return(
        <div>
          <div style={{ width: this.state.windowWidth, 
            height: this.state.windowHeight/4 }} 
            onClick={() => { this.setState({ value: (this.state.value + 5)%256 }) }}>
            <Sketch
              sketch={sketch}
              width={this.state.windowWidth}
              height={this.state.windowHeight/4}
              sketchProps={{ logs: this.state.logs, 
              startDay: this.state.startDay, 
              actualWidth: this.state.windowWidth/1.2, 
              actualHeight: this.state.windowHeight/2}}
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
          <RaisedButton float = 'left' primary={false} label="Stop Tracking" onClick={this.stop_Tracking} />
        </div>
      )
    }  
  }

  // check the backend every few seconds for additional logs and update it
  // accordingly
  upDateLogs(){
    if(eval(localStorage.getItem('tracking')) == true){
      getLogs().then(function(response) {
        localStorage.setItem('logs', response.data[0])
        this.setState({logs: response.data.logs})
        this.setState({
          startDay: response.data.startDay
        })
      }.bind(this))
    }
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


