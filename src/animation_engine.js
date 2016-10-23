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
  
//////////////////////////// Using jquery Animation/////////////////////////////////////////////
  function createElements(key, line){
    
      var $div_child = $("<div>", {id: "div_"+key, class: "line"});
      $("#element").append($div_child);

      $div_child.text(line).hide();
  }

  function animate(collection){
    collection.eq(0).fadeIn(1000, function(){
            (collection=collection.slice(1)).length 
            && animate(collection)
        });
  }

//////////////////////////// Drawing on canvas/////////////////////////////////////////////


  function animateOnCanvas(textAndImageData){
    console.log(textAndImageData);
    var canvas = document.querySelector('#myCanvas');
    canvas.style.backgroundColor = 'white';
    
    capturer.start();

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var textStartX = 10,
        textStartY = 150;

    var imageStartX = 10,
        imageStartY = 20,
        imageWidth = 100,
        imageHeight = 100;

    drawText(textAndImageData.text, canvas, textStartX, textStartY);
    drawImage(textAndImageData.imagePath, canvas, imageStartX, imageStartY, imageWidth, imageHeight);

  }
  // drawImage
  function drawImage(imgPath, canvas, xPos, yPos,
                     imgWidth, imgHeight) {
    var ctx = canvas.getContext("2d");

    var img = new Image();
    img.src = imgPath;

    //schedule animation for the next available frame
    requestAnimationFrame(
        //wrap animate in a anonymous function to 
        //match the callback signature 
        function(timestamp){
          ctx.drawImage(img, xPos, yPos, imgWidth, imgHeight);
          
        }
    );
    capturer.capture(canvas);
  
}
  
// draw text
function drawText(txt, canvas, x, y){
  
  var ctx = canvas.getContext("2d");

  ctx.font = "20px Monaco, Consolas, Lucida Console, monospace"; 
  ctx.lineWidth = 1 ; ctx.lineJoin = "round"; ctx.globalAlpha = 1.0;
  ctx.strokeStyle  = "blue";
 

  var speed = 4,
      dashLen = 200, dashOffset = 200, 
      i = 0;

  (function loop() {
  
    ctx.fillStyle = "blue";
    ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
    dashOffset -= speed;                                         // reduce dash length
    ctx.strokeText(txt[i], x, y);                              // stroke letter

    if (dashOffset > 0) {
       requestAnimationFrame(loop);                               // animate
      
    }
    else {
      ctx.fillText(txt[i], x, y);                               // fill final letter
      dashOffset = dashLen;                                      // prep next char
      x += ctx.measureText(txt[i++]).width + ctx.lineWidth ;    // update x for next character
     
      if (i < txt.length) {
        requestAnimationFrame(loop);

      }
    }
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
    capturer = new CCapture( { format: format});

  });
});
