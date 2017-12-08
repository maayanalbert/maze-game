
var redColor

function preload() {
   var url = 'http://128.237.223.180:9595/red';
   httpDo(url,
     {
       method: 'GET',
       // Other Request options, like special headers for apis
     },
     function(res) {
       redColor = parseRes(res);
     });
}

function setup() {  
    createCanvas(300, 300)
    // redColor = redColor[0]
    // redColor = redColor.split("[");
}

function updateRed(){
    var url = 'http://128.237.223.180:9595/red';
    httpDo(url,
     {
       method: 'GET',
       // Other Request options, like special headers for apis
     },
     function(res) {
       redColor = parseRes(res);
     });
}

function draw() {
    updateRed()
    background(255, 255, 255)
    fill(0, 0, 0)
    text('client1, click to make redder', 50, 50)
    fill(redColor, 0, 0)
    print(redColor)
    ellipse(100, 100, 50, 50)

}

function parseRes(res){
    var result = ''
    for(var i = 1; i < res.length-1; i++){
        result += res[i]
    }
    return eval(result)
}

function mousePressed(){
   var url = 'http://128.237.223.180:9595/redder';
   httpDo(url,
     {
       method: 'POST',
       // Other Request options, like special headers for apis
     },
     function(res) {
       redColor = parseRes(res);
     });

}
