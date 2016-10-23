$(document).ready(function(){
  var format = null;
  var capturer = null;

  var Group = function Group(text, imagePath){
    this.text = text;
    this.imagePath = imagePath;
  }

  function interpret(input) {
    var groups = input.split("<group>");
    // currently working on only 1 group

    var group = groups[1];
    var groupData = group.split("<text>")[1].split("<image>");
    var textAndImage = new Group(groupData[0], groupData[1]);
    return textAndImage;
  }
  

//////////////////////////// Drawing on canvas/////////////////////////////////////////////
/*
Steps:
0. On The page, enter the text and image path in format : <group><text>Hadoop<image>../resources/Architect_Female_Green.png
Select the format between FFMPEG and WEBM. That will create the Capture Object

This method:
1. Clear and fill the canvas 1280x720 with white color (sets the background in videos to white)
2. Start the capturer
3. Draw Text at x=10, y=150 (hardcoded for now)
4. Draw image at x=10, y=20 (hardcoded for now)

The code is hardcoded to print only 1 GroupObject  one after the other
*/

  function animateOnCanvas(textAndImageData){
    console.log(textAndImageData);
    var canvas = document.querySelector('#myCanvas');
    canvas.style.backgroundColor = 'white';
    
    capturer.start();

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Position of text in canvas
    var textStartX = 10,
        textStartY = 150;

    // Position of image in canvas
    var imageStartX = 10,
        imageStartY = 20,
        imageWidth = 100,
        imageHeight = 100;

    drawText(textAndImageData.text, canvas, textStartX, textStartY);
    drawImage(textAndImageData.imagePath, canvas, imageStartX, imageStartY, imageWidth, imageHeight);

  }

  function drawImage(imgPath, canvas, xPos, yPos,
                     imgWidth, imgHeight){
    var ctx = canvas.getContext("2d");

    var img = new Image();
    img.src = imgPath;
    img._x = xPos;
    img._y = yPos;
    var times = 1;
    var i = 0;

    (function loop() {

      draw(ctx, img, imgWidth, imgHeight);   
      
      while(i < times){  
        requestAnimationFrame(loop);
        i+=1;
      }
      capturer.capture(canvas);

    })();

  }

  function draw(ctx, img, imgWidth, imgHeight){
    ctx.drawImage(img, img._x, img._y, imgWidth, imgHeight);

  }

  
// draw text
function drawText(txt, canvas, x, y){

  // get the canvas to to 2D drawing on 
  var ctx = canvas.getContext("2d");

  // set font properties and letter style
  ctx.font = "20px Monaco, Consolas, Lucida Console, monospace"; 
  ctx.lineWidth = 1 ; ctx.lineJoin = "round"; ctx.globalAlpha = 1.0;
  ctx.strokeStyle  = "blue";
 
  // set the speed of the animation
  var speed = 8,
      dashLen = 200, dashOffset = 200, 
      i = 0;

  // method to be called by requestAnimation
  (function loop() {
  
    ctx.fillStyle = "blue";
    // create a long dash mask
    ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); 
    // reduce dash length
    dashOffset -= speed;                                       
    // stroke letter - draw the letter  
    ctx.strokeText(txt[i], x, y);                              

    // animate
    if (dashOffset > 0) {
       requestAnimationFrame(loop);                               
      
    }
    else {
      // fill final letter
      ctx.fillText(txt[i], x, y);  
      // prep next char                             
      dashOffset = dashLen;      
      // update x position for next character                                
      x += ctx.measureText(txt[i++]).width + ctx.lineWidth ;    
     
      if (i < txt.length) {
        requestAnimationFrame(loop);

      }
    }
    // capture canvas
    capturer.capture(canvas);

  })();
  
}  
  
////////////////////////////////////////HTML Elements Handling ////////////////////////////////////////

$("#animate").click(function(){
    $('#element').empty();
    animateOnCanvas(interpret($('#input').val()));
   });

$("#save").click(function(){
   capturer.stop();
   capturer.save();
   });

$('input:radio[name="format"]').change(function(){

    console.log($(this).val());
    format = $(this).val();
    capturer = new CCapture( { format: format, framerate: 20});

  });
});
