
var todayIP = "128.237.207.179"

var board = []
var playerPos = []
var pastPlayerPos = []
var playerDir
var myDictionary
var parsedRes

var spotSize = 40
var spotFill = 150
var spotWeight = .5
var spotStroke = 225
var margin = 200
var numRows 
var numCols

var playerFill = [57,180,221]
var playerSize = 30

var leftKey = 37
var rightKey = 39
var upKey = 38
var downKey = 40

var goonPositions = []
var pastGoonPositions = []
var goonFill = [213,62,83]
var goonSize = 20

var gameOver = false

var goonMoveInterval = 1000

var score = 0


var arrowKeys = [[upKey,'up'],[rightKey, 'right'],
[downKey,'down'],[leftKey, 'left']]

function preload() {
   var url = 'http://'+todayIP +':9595/getgame';
   httpDo(url,
     {
       method: 'GET',
       // Other Request options, like special headers for apis
     },
     function(res) {
       parsedRes = parseRes(res);
       board = eval(parsedRes.get('board'))
       playerPos = [eval(parsedRes.get('playerX')), eval(parsedRes.get('playerY'))]
       numRows = board.length
       numCols = board[0].length
       goonPositions = [[eval(parsedRes.get('goonX1')), eval(parsedRes.get('goonY1'))],
                        [eval(parsedRes.get('goonX2')), eval(parsedRes.get('goonY2'))]]
      pastGoonPositions = goonPositions
      pastPlayerPos = playerPos
      score = eval(parsedRes.get('score'))

     });
}

function setup() { 
    createCanvas(900, 700)
    myDictionary = createNumberDict('p5', 42);
}

function draw() {
    getBoard()
    fill(50)
    textSize(50)
    if(gameOver == false){
      background(255, 255, 255)
      drawBoard()
      drawPlayer()
      drawGoons()
    // print(goonPositions[0])
      if(frameCount%10 == 0){
        moveGoons()
      }
    drawScore()
    }
    else{
      textSize(50)
      fill(225, 10)
      rect(margin, margin, (spotSize*board[0].length), (spotSize*board.length))
      fill(50)
      text('Game Over', 
          (spotSize*board[0].length)/2 - textWidth('Game Over')/2 + margin, 
          (spotSize*board.length)/2 + margin)
    }

}

function getBoard(){
    var url = 'http://' + todayIP + ':9595/nochanges';
   httpDo(url,
     {
       method: 'GET',
       // Other Request options, like special headers for apis
     },
     function(res) {
       parsedRes = parseRes(res);
       board = eval(parsedRes.get('board'))
       playerPos = [eval(parsedRes.get('playerX')), eval(parsedRes.get('playerY'))]
       numRows = board.length
       numCols = board[0].length
       goonPositions = [[eval(parsedRes.get('goonX1')), eval(parsedRes.get('goonY1'))],
                        [eval(parsedRes.get('goonX2')), eval(parsedRes.get('goonY2'))]]
      score = eval(parsedRes.get('score'))

     });
}

function drawScore(){
      fill(0)
      textSize(20)
      text('Score: ' + String(score), 760, 250)
}

function drawGoons(){

  for(var i = 0; i < goonPositions.length; i++){
    goonPos = goonPositions[i]

    xPos = (goonPos[0]+.5)*spotSize + margin
    yPos = (goonPos[1]+.5)*spotSize + margin

    stroke(spotStroke)
    strokeWeight(spotWeight)
    fill(goonFill[0], goonFill[1], goonFill[2])
    ellipse(xPos, yPos, goonSize, goonSize)

  }

}

function drawBoard(){
  for(var row = 0; row < numRows; row++){
    for (var col = 0; col < numCols; col++){
      currentSpot = board[row][col]
      if(currentSpot[2]){
        strokeWeight(0)
        fill(spotFill)
      }else{
        stroke(spotStroke)
        strokeWeight(spotWeight)        
        fill(255)
      }
      rect(margin + spotSize*col, margin + spotSize * row,
        spotSize, spotSize)
    }
  }
}

function drawPlayer(){
  xPos = (playerPos[0]+.5)*spotSize + margin
  yPos = (playerPos[1]+.5)*spotSize + margin
  
  stroke(spotStroke)
  strokeWeight(spotWeight)
  fill(playerFill[0], playerFill[1], playerFill[2])
  ellipse(xPos, yPos, playerSize, playerSize)
}

function parseRes(res){
    splitRes = split(res, '"')
    var newRes = createStringDict()
    for(var i = 1; i < splitRes.length; i++){
      currentRes = splitRes[i]
        if(currentRes[0] == ':'){
          tempRes = ''
          for(var j = 1; j < currentRes.length -1; j++){
            tempRes += currentRes[j]
          }
          currentRes = tempRes
          newRes.set(splitRes[i-1],currentRes)
        }
    }    
    return newRes
}

function keyPressed(){
  for(var keyDir = 0; keyDir < arrowKeys.length; keyDir++){
    if(keyCode == arrowKeys[keyDir][0]){
      // movePlayer(arrowKeys[keyDir][1])
    }
  }
}

function movePlayer(dir){
   var url = 'http://' + todayIP + ':9595/move';
   httpPost(url, 'json', {dir},
     function(res) {
       playerPos = [res.playerX, res.playerY]
       gameOver = res.over
       board = res.board
       goonPositions = [[res.goonX1, res.goonY1],
                        [res.goonX2, res.goonY2]]
       score = res.score
     }); 
}

function moveGoons(){
    var url = 'http://'+ todayIP +':9595/goons';

    httpDo(url,
     {
       method: 'GET',
       // Other Request options, like special headers for apis
     },
     function(res) {
      parsedRes = parseRes(res);
      gameOver = eval(parsedRes.get('over'))
      goonPositions = [[eval(parsedRes.get('goonX1')), eval(parsedRes.get('goonY1'))],
                       [eval(parsedRes.get('goonX2')), eval(parsedRes.get('goonY2'))]]

     });

}

// function slide(current, target){
//   return 
// }
