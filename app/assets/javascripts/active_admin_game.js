var formatText = function() {
  var formatted_title = "";
  return formatted_title;
}

var drawGame = function(game) {
  var layer = new Layer();
  var rectangle = new Rectangle(new Point(0, 0), new Point(150, 100));
  var rectangle_path = new Path.Rectangle(rectangle);

  game_title = formatText(game.title)

  var game_text = new PointText({
    point: [0, 80],
    content: game_title,
    fillColor: 'black',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 25
  });

  game_text.fitBounds(rectangle_path.bounds);

  rectangle_path.fillColor = '#e9e9ff';

  // Add the paths to the layer:
  layer.addChild(rectangle_path);
  layer.addChild(game_text);

}

var drawStep = function(step) {
  var layer = new Layer();
  var rectangle = new Rectangle(new Point(0, 0), new Point(150, 100));
  var rectangle_path = new Path.Rectangle(rectangle);

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

  // Add the paths to the layer:
  layer.addChild(rectangle_path);
  layer.addChild(step_text);

}


var panAndZoom = {
    oldZoom: 0.0,
    changeZoom: function(oldZoom, delta) {
      var factor;
      factor = 1.05;
      if (delta < 0) {
        return oldZoom * factor;
      }
      if (delta > 0) {
        return oldZoom / factor;
      }
      return oldZoom;
    },
    // StableZoom.prototype.changeZoom = function(oldZoom, delta, c, p) {
    //   var a, beta, newZoom, pc;
    //   newZoom = StableZoom.__super__.changeZoom.call(this, oldZoom, delta);
    //   beta = oldZoom / newZoom;
    //   pc = p.subtract(c);
    //   a = p.subtract(pc.multiply(beta)).subtract(c);
    //   return [newZoom, a];
    // };
    //
    // return StableZoom;
    changeCenter: function(oldCenter, deltaX, deltaY, factor) {
      var offset;
      offset = new paper.Point(deltaX, -deltaY);
      offset = offset.multiply(factor);
      return oldCenter.add(offset);
    }
}


$(function() {

  var current_path = $(location).attr('pathname');
  var pan_view = false;
  var drag_item = null;

  if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
    var current_game_id = current_path.split( '/' )[3];
    var jsonURL = "/games/" + current_game_id + ".json";

    paper.install(window);
    $.getJSON( jsonURL, function (data){
        paper.setup('network_canvas');

        drawGame(data);

        // draw the steps for this game
        // $.each(data.steps, function(index, step) {
        //   drawStep(step);
        // });

        paper.view.update();

        paper.view.on("mousedown", function(event) {

          pan_item = null;

          if(event.shiftKey) {

            view.center = panAndZoom.changeCenter(view.center, event.deltaX, event.deltaY, event.deltaFactor);
            event.preventDefault();

          } else if(event.altKey) {

            view.zoom = panAndZoom.changeZoom(view.zoom, event.deltaY);
            //mousePosition = new paper.Point(event.offsetX, event.offsetY)

          } else {

            var hitOptions = { fill: true, stroke: true, segments: true, tolerance: 0, bounds: true };
            var hitResult = paper.project.hitTest(event.point, hitOptions);

            if (hitResult) {
          		if (hitResult.type == 'fill') {
                console.log(hitResult.item);
                drag_item = hitResult.item.layer;
          		}
          	} else {
              pan_view = true;
            }

          }
        });

        paper.view.on("mousemove", function(event) {

          // handler for mousemovent events
          if(pan_view === true) {

            // pan the view around
            paper.view.center = panAndZoom.changeCenter(view.center, event.delta.x, event.delta.y, 0.6);

          } else if(drag_item) {

            // drag an item around
            drag_item.position = panAndZoom.changeCenter(drag_item.position, event.delta.x, -event.delta.y, 1.0);

          } else {

            // show items as "selected" when we hover on them
            paper.project.deselectAll();
          	if(event.target) {
              if(typeof event.target.content === "undefined") {
                // show selected for a rectange path
                event.target.selected = true;
              } else {
                // if this is text then show the rectangle path as selected
                event.target.layer.firstChild.selected = true;
              }
            }

          }
        });

        paper.view.on("mouseup", function(event) {
          // reset any dragging/panning that may have occured
          pan_view = false;
          drag_item = null;
        });
    });
  }
});
