

// window.requestAnimFrame = (function(callback) {
//   return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
//   function(callback) {
//     window.setTimeout(callback, 1000 / 60);
//   };
// })();
//
// function drawRectangle(myRectangle, context) {
//   context.beginPath();
//   context.rect(myRectangle.x, myRectangle.y, myRectangle.width, myRectangle.height);
//   context.fillStyle = '#8ED6FF';
//   context.fill();
//   context.lineWidth = myRectangle.borderWidth;
//   context.strokeStyle = 'black';
//   context.stroke();
// }
//
// function animate(myRectangle, canvas, context, startTime) {
//   // update
//   var time = (new Date()).getTime() - startTime;
//
//   var linearSpeed = 100;
//   // pixels / second
//   var newX = linearSpeed * time / 1000;
//
//   if(newX < canvas.width - myRectangle.width - myRectangle.borderWidth / 2) {
//     myRectangle.x = newX;
//   }
//
//   // clear
//   context.clearRect(0, 0, canvas.width, canvas.height);
//
//   drawRectangle(myRectangle, context);
//
//   // request new frame
//   requestAnimFrame(function() {
//     animate(myRectangle, canvas, context, startTime);
//   });
// }
//
// $(document).ready(function() {
//   var canvas = document.getElementById("network_canvas");
//   //var canvas = $('#network_canvas');
//   console.log(canvas);
//   var context = canvas.getContext('2d');
//
//   var myRectangle = {
//     x: 0,
//     y: 75,
//     width: 100,
//     height: 50,
//     borderWidth: 5
//   };
//
//   //drawRectangle(myRectangle, context);
//
//   // wait one second before starting animation
//   // setTimeout(function() {
//   //   var startTime = (new Date()).getTime();
//   //   animate(myRectangle, canvas, context, startTime);
//   // }, 1000);
//
// });


var drawStep = function(step) {
  var group = new Group();
  var rectangle = new Rectangle(new Point(0, 0), new Point(150, 100));
  var rectangle_path = new Path.Rectangle(rectangle);
  var drag = false;
  var step_text = new PointText({
    point: [0, 80],
    content: step.status_message,
    fillColor: 'black',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 25
  });

  step_text.fitBounds(rectangle_path.bounds);

  rectangle_path.fillColor = '#e9e9ff';

  // Add the paths to the group:
  group.addChild(rectangle_path);
  group.addChild(step_text);

  rectangle_path.on('mousedown', function(event) {
      console.log(event);
      drag = false;
  });

}

$(function() {

  var current_path = $(location).attr('pathname')
  console.log(current_path.split( '/' )[2]);
  if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
    var current_game_id = current_path.split( '/' )[3];
    var jsonURL = "/games/" + current_game_id + ".json";

    paper.install(window);
    $.getJSON( jsonURL, function (data){
        paper.setup('network_canvas');
        console.log(data);
        var point_1_x = data['description'];
        var point_1_y = data['title'];

        $.each(data.steps, function(index, step) {
          if(index === 0) drawStep(step);
        });

        paper.PaperScript.load();
        paper.view.update();

        paper.view.on("mousedown", function(event) {
          console.log(event);
          // if (rectangle_path.contains(event.point)) {
          //   rectangle_path.fillColor = 'red';
          // } else {
          //   rectangle_path.fillColor = 'black';
          // }
        });
    });
  }
});
