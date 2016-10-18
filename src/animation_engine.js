$(document).ready(function(){
  // var capturer = new CCapture( { format: 'jpg'});
  var capturer = new CCapture( { format: 'webm'});

  function interpret(input) {
    var lines = input.split("$$");
    jQuery.each(lines, function(key, value) {
      createElements(key, value);
    });
    
  }

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
  function animateOnCanvas(collections){
    console.log(collections);
    var line = collections.eq(1).text();
    var canvas = document.querySelector('#myCanvas');
    canvas.style.backgroundColor = 'white';
    
    capturer.start();
    
    draw(line, canvas, capturer);
 
  }
 

  function draw(txt, canvas, capturer){
    
    var ctx = canvas.getContext("2d"), speed = 4,
     dashLen = 200, dashOffset = 200, 
     x = 30, i = 0;

    ctx.font = "20px Monaco, Consolas, Lucida Console, monospace"; 
    ctx.lineWidth = 1 ; ctx.lineJoin = "round"; ctx.globalAlpha = 1.0;
    ctx.strokeStyle = ctx.fillStyle = "blue";
    ctx.clearRect(0,0, 640, 400);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 640, 400);

    (function loop() {
     // ctx.clearRect(x, 0, 60, 150);
     // ctx.fillStyle = "white";
     // ctx.fillRect(x, 0, 60, 150);
      ctx.fillStyle = "blue";
      ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
      dashOffset -= speed;                                         // reduce dash length
      ctx.strokeText(txt[i], x, 50);                               // stroke letter

      if (dashOffset > 0) {
         requestAnimationFrame(loop);             // animate
        
      }
      else {
        ctx.fillText(txt[i], x, 50);                               // fill final letter
        dashOffset = dashLen;                                      // prep next char
        x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random();
       
        if (i < txt.length) {
          requestAnimationFrame(loop);

        }
      }
      capturer.capture( canvas );

    })();
    
}  
   
$("#animate").click(function(){
    $('#element').empty();
    interpret($('#text').val());
    animateOnCanvas($('.line'));
   });

$("#save").click(function(){
   capturer.stop();
   capturer.save();
   });

    

});