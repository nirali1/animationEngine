$(document).ready(function(){

// function Animation(name, duration){
//   this.name = name;
//   this.duration = duration;
//   this.getInfo = function(){
//     return this.name + ' ' + this.duration;
//   };
// }
  function interpret(input) {
    var lines = input.split("$$");
    jQuery.each(lines, function(key, value) {
      createElements(key, value);
    });
    
  }

  function animate(collection){
    collection.eq(0).fadeIn(1000, function(){
            (collection=collection.slice(1)).length 
            && animate(collection)
        });
  }

  function createElements(key, line){
    
      var $div_child = $("<div>", {id: "div_"+key, class: "line"});
      $("#element").append($div_child);

      $div_child.text(line).hide();
  }
  
   
$("#animate").click(function(){
    $('#element').empty();
    interpret($('#text').val());
    animate($('.line'));
   });

    

});