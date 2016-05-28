var formatText = function(raw_string) {
  var formatted_text = "";
  var start_position = 0;
  var end_position = 0;
  var unused_text_position = null;

  // first cap any string at 128 chars
  if(raw_string.length > 128) {
    raw_string = raw_string.slice(0, 128) + "..."
  }

  // now loop through and split into new lines where characters are greater
  // than 20, taking spaces into account for the line breaks.
  for(var i = 0; i <= parseInt(raw_string.length / 20); i++) {
    if(unused_text_position === null) {
      start_position = i * 20;
    } else {
      start_position = unused_text_position;
    }

    if( i == parseInt(raw_string.length / 20)) {
      end_position = raw_string.length - 1;
    } else {
      end_position = start_position + 19;
    }

    last_space_position = start_position + raw_string.slice(start_position, end_position).lastIndexOf(" ")
    if(last_space_position < end_position) {
      unused_text_position = last_space_position;
    } else {
      unused_text_position = null;
    }

    formatted_text += raw_string.slice(start_position, last_space_position).trim() + "\n"
  }

  // make sure to add on any unused text at the end
  if(unused_text_position) {
    formatted_text += raw_string.slice(unused_text_position, raw_string.length).trim()
  }

  return formatted_text;
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

  status_message = formatText(step.status_message)

  var step_text = new PointText({
    point: [0, 80],
    content: status_message,
    fillColor: 'black',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 25
  });

  step_text.fitBounds(rectangle_path.bounds);

  rectangle_path.fillColor = '#e9e9ff';
  rectangle_path.strokeColor = 'red';
  rectangle_path.strokeWidth = 0;

  // Add the paths to the layer:
  layer.addChild(rectangle_path);
  layer.addChild(step_text);

  layer.status_message = step.status_message;
}

var drawConnection = function(origin, destination) {

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
  var currently_selected_item = null;

  if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
    var current_game_id = current_path.split( '/' )[3];
    var jsonURL = "/games/" + current_game_id + ".json";

    paper.install(window);
    $.getJSON( jsonURL, function (data){
        paper.setup('network_canvas');

        drawGame(data.game);

        //draw the steps for this game
        $.each(data.steps, function(index, step) {
          drawStep(step);
        });

        paper.view.update();

        paper.view.on("mousedown", function(event) {

          if(event.altKey) {

            view.zoom = panAndZoom.changeZoom(view.zoom, event.deltaY);
            //mousePosition = new paper.Point(event.offsetX, event.offsetY)

          } else {

            var hitOptions = { fill: true, stroke: true, segments: true, tolerance: 0, bounds: true };
            var hitResult = paper.project.hitTest(event.point, hitOptions);

            if (hitResult) {
          		if (hitResult.type == 'fill') {
                if(event.modifiers.shift) {
                  console.log("shift clicking item");
                  var layer = hitResult.item.layer;
                  path = new Path();
                  path.add(event.point);
                  path.strokeColor = 'black';

                } else {
                  // remove red border from currently selected item
                  if(currently_selected_item) {
                    currently_selected_item.firstChild.strokeWidth = 0;
                  }

                  // add red border to new currently selected item
                  currently_selected_item = hitResult.item.layer;
                  hitResult.item.layer.firstChild.strokeWidth = 3;

                  // update the form with the details for this item
                  console.log(currently_selected_item.status_message)
                  $("textarea#status_message").val(currently_selected_item.status_message)

                  // set this item to be draggable
                  drag_item = hitResult.item.layer;
                }
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
