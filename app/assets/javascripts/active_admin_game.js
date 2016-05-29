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
    fontSize: 15
  });

  rectangle_path.fillColor = '#505050';
  rectangle_path.strokeColor = '#FF7260';

  rectangle_path.translate(game.x_position, game.y_position);
  game_text.fitBounds(rectangle_path.bounds);

  // Add the paths to the layer:
  layer.addChild(rectangle_path);
  layer.addChild(game_text);
  layer.connections = [];
  layer.game_id = game.id;
  layer.title = game.title;
  layer.description = game.description;

  return layer;
}

var drawStep = function(step) {
  var layer = new Layer();
  if(step.id === 4) {
    console.log(step.x_position);
    console.log(step.y_position);
  }
  var rectangle = new Rectangle(new Point(0, 0), new Point(150, 100));
  var rectangle_path = new Path.Rectangle(rectangle);

  status_message = formatText(step.status_message)

  var step_text = new PointText({
    point: [0, 80],
    content: status_message,
    fillColor: 'black',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 15
  });

  rectangle_path.fillColor = '#129793';
  rectangle_path.strokeColor = '#FF7260';
  rectangle_path.strokeWidth = 0;

  rectangle_path.translate(step.x_position, step.y_position);
  step_text.fitBounds(rectangle_path.bounds);

  // Add the paths to the layer:
  layer.addChild(rectangle_path);
  layer.addChild(step_text);

  layer.status_message = step.status_message;
  layer.connections = [];
  layer.step_id = step.id

  return layer;
}

var drawDecision = function(decision) {
  var layer = new Layer();
  var rectangle = new Rectangle(new Point(0, 0), new Point(150, 100));
  var rectangle_path = new Path.Rectangle(rectangle);

  decision_message = formatText(decision.choice)

  var decision_text = new PointText({
    point: [0, 80],
    content: decision_message,
    fillColor: 'black',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 15
  });

  rectangle_path.fillColor = '#9BD7D5';
  rectangle_path.strokeColor = '#FF7260';
  rectangle_path.strokeWidth = 0;

  rectangle_path.translate(decision.x_position, decision.y_position);

  if(decision_message.length > 10) {
    decision_text.fitBounds(rectangle_path.bounds);
  } else {
    decision_text.translate(decision.x_position, decision.y_position);
  }

  // Add the paths to the layer:
  layer.addChild(rectangle_path);
  layer.addChild(decision_text);

  layer.choice = decision.choice;
  layer.connections = [];
  layer.decision_id = decision.id

  return layer;
}


var drawConnection = function(origin, destination) {

  var origin_point = new Point(origin.firstChild.position);
  var destination_point = new Point(destination.firstChild.position);
  var mid_point = new Point();

  // now adjust for rectangle edges
  if(origin_point.x > destination_point.x) {
    origin_point.x -= origin.firstChild.bounds.width / 2;
    destination_point.x += destination.firstChild.bounds.width / 2;
  } else {
    origin_point.x += origin.firstChild.bounds.width / 2;
    destination_point.x -= destination.firstChild.bounds.width / 2;
  }

  mid_point = new Point((origin_point.x + destination_point.x) / 2, (origin_point.y + destination_point.y) / 2);

  // create the new connection and add to the origin
  var connection_layer = new Layer();
  var new_connection = new Path.Line(origin_point, destination_point);
  //var arrow = new Path.RegularPolygon(mid_point, 3, 10);

  new_connection.strokeColor = 'black';
  new_connection.strokeWidth = 3;

  var arrow = new Point(destination_point.x - origin_point.x, destination_point.y - origin_point.y);
  arrow = arrow.normalize(20);
  var arrow_path = new Group(new Path([arrow.rotate(135), new Point(0,0), arrow.rotate(-135)]));

  arrow_path.strokeColor = 'black';
  arrow_path.strokeWidth = 3;
  arrow_path.translate(mid_point);

  origin.addChild(connection_layer);
  origin.connections.push({to: destination, layer: connection_layer})
  destination.connections.push({from: origin, layer: connection_layer})
}

var redraw_connections = function(origin) {

  var origin_point = null,
      destination_point = null;

  $.each(origin.connections, function(index, connection) {

    if(connection.to) {
      origin_point = new Point(origin.firstChild.position);
      destination_point = new Point(connection.to.firstChild.position);

    } else if(connection.from) {
      origin_point = new Point(connection.from.firstChild.position);
      destination_point = new Point(origin.firstChild.position);

    }

    // remove the original line
    connection.layer.firstChild.remove();

    // now adjust for rectangle edges
    if(origin_point.x > destination_point.x) {
      origin_point.x -= origin.firstChild.bounds.width / 2;
      destination_point.x += origin.firstChild.bounds.width / 2;
    } else {
      origin_point.x += origin.firstChild.bounds.width / 2;
      destination_point.x -= origin.firstChild.bounds.width / 2;
    }

    // redraw the original line
    var new_connection = new Path.Line(origin_point, destination_point);

    new_connection.strokeColor = 'black';
    new_connection.strokeWidth = 3;
    connection.layer.addChild(new_connection);

    // redraw the arrow
    connection.layer.firstChild.remove();
    var mid_point = new Point((origin_point.x + destination_point.x) / 2, (origin_point.y + destination_point.y) / 2);

    var arrow = new Point(destination_point.x - origin_point.x, destination_point.y - origin_point.y);
    arrow = arrow.normalize(20);

    var arrow_path = new Group(new Path([arrow.rotate(135), new Point(0,0), arrow.rotate(-135)]));
    arrow_path.strokeColor = 'black';
    arrow_path.strokeWidth = 3;
    arrow_path.translate(mid_point);

    connection.layer.addChild(arrow_path);
  });
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
    changeCenter: function(oldCenter, deltaX, deltaY, factor) {
      var offset;
      offset = new paper.Point(deltaX, deltaY);
      offset = offset.multiply(factor);
      return oldCenter.add(offset);
    }
}


$(function() {

  var current_path = $(location).attr('pathname');
  var pan_view = false;
  var zoom_view = false;
  var drag_item = null;
  var currently_selected_item = null;
  var creating_new_path = false;
  new_path = null;

  if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
    var current_game_id = current_path.split( '/' )[3];
    var jsonURL = "/games/" + current_game_id + ".json";
    var first_step, current_game, current_step, current_decision;
    paper.install(window);
    $.getJSON( jsonURL, function (data){
        paper.setup('network_canvas');

        //paper.project.activeLayer.transform( new Matrix(1,0,0,-1,view.center.x, view.center.y) );
        console.log(paper.view.size);
        console.log(paper.view.zoom);
        console.log(paper.view.center);

        paper.view.center = new Point(data.game.pan_x_position, data.game.pan_y_position)
        if(data.game.zoom !== 0) paper.view.zoom = data.game.zoom;

        console.log(paper.view.size);
        console.log(paper.view.zoom);
        console.log(paper.view.center);

        current_game = drawGame(data.game);

        //draw the steps for this game
        $.each(data.steps, function(index, step) {
          current_step = drawStep(step);

          if(step.id === data.game.first_step) {
            first_step = current_step;
          }

          $.each(step.decisions, function(index, decision) {
            current_decision = drawDecision(decision)
            // link steps and decisions
            drawConnection(current_step, current_decision)
          });

        });

        drawConnection(current_game, first_step);

        // link up decisions to next steps
        $.each(data.steps, function(index, step) {
          $.each(step.decisions, function(index, decision) {

            // find the decision display item
            $.each(paper.project.layers, function(index, layer) {
              if("decision_id" in layer) {
                if(layer.decision_id === decision.id) {
                  current_decision = layer;
                  console.log("found match");
                }
              }
            });

            // find the next step display item
            $.each(paper.project.layers, function(index, layer) {
              if("step_id" in layer) {
                if(layer.step_id === decision.next_step) {
                  current_step = layer;
                  console.log("found match");
                }
              }
            });

            // link up the decision to the next step
            drawConnection(current_decision, current_step)
          });
        });

        paper.view.update();

        paper.view.on("mousedown", function(event) {

          if(event.modifiers.alt || event.modifiers.option) {
            zoom_view = true;
            $('#network_canvas').css('cursor','zoom-in');
          } else {

            var hitOptions = { fill: true, stroke: true, segments: true, tolerance: 0, bounds: true };
            var hitResult = paper.project.hitTest(event.point, hitOptions);

            if (hitResult) {
          		if (hitResult.type == 'fill') {
                // remove red border from currently selected item
                if(currently_selected_item) {
                  currently_selected_item.firstChild.strokeWidth = 0;
                }

                // add red border to new currently selected item
                currently_selected_item = hitResult.item.layer;
                hitResult.item.layer.firstChild.strokeWidth = 3;

                // update the form with the details for this item
                if("game_id" in currently_selected_item) {
                  $("#game_form").show();
                  $("#step_form").hide();
                  $("#decision_form").hide();
                  $("p#game_id").text(currently_selected_item.game_id);
                  $("textarea#title").val(currently_selected_item.title);
                  $("textarea#description").val(currently_selected_item.description);
                } else if("step_id" in currently_selected_item) {
                  $("#game_form").hide();
                  $("#step_form").show();
                  $("#decision_form").hide();
                  $("p#step_id").text(currently_selected_item.step_id);
                  $("textarea#status_message").val(currently_selected_item.status_message);
                } else {
                  $("#game_form").hide();
                  $("#step_form").hide();
                  $("#decision_form").show();
                  $("p#decision_id").text(currently_selected_item.decision_id);
                  $("textarea#choice").val(currently_selected_item.choice);
                }


                if(event.modifiers.shift) {
                  $('#network_canvas').css('cursor','crosshair');
                  var layer = hitResult.item.layer;
                  layer.bringToFront();
                  path = new Path.Line(event.point, event.point);
                  path.strokeColor = 'black';
                  path.strokeWidth = 3;
                  layer.addChild(path);
                  creating_new_path = true;
                  new_path = path;
                } else {
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
            paper.view.center = panAndZoom.changeCenter(view.center, -event.delta.x, -event.delta.y, 1.0);

          } else if(zoom_view === true) {
            // zoom in or out
            paper.view.zoom = panAndZoom.changeZoom(view.zoom, event.delta.y);

          } else if(drag_item) {
            $('#network_canvas').css('cursor','grabbing');
            // drag an item around
            drag_item.firstChild.position = panAndZoom.changeCenter(drag_item.firstChild.position, event.delta.x, event.delta.y, 1.0);

            if(drag_item.connections.length > 0) {
              redraw_connections(drag_item);
            }
          } else if(creating_new_path === true) {
            // create a new path
            new_path.segments[new_path.segments.length-1].point = event.point;

          }else {

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

              $('#network_canvas').css('cursor','grab');
            } else {
              $('#network_canvas').css('cursor','move');
            }

          }
        });

        paper.view.on("mouseup", function(event) {
          // reset any dragging/panning/zooming that may have occured

          if (pan_view) {
            paper.view.center = new Point(parseInt(paper.view.center.x, 10), parseInt(paper.view.center.y, 10))
            pan_view = false;
          } else if (zoom_view) {
            zoom_view = false;
          } else if(creating_new_path) {
            var hitOptions = { fill: true, stroke: false, segments: false, tolerance: 0, bounds: false };
            var hitResult = paper.project.hitTest(event.point, hitOptions);

            if (hitResult) {
          		if (hitResult.type == 'fill') {
                if(currently_selected_item !== hitResult.item.parent) {

                  var connection_already_found;
                  connection_already_found = false;

                  $.each(currently_selected_item.connections, function(index, connection) {
                    if(connection.to === hitResult.item.parent) {
                      connection_already_found = true;
                    }
                  });

                  if(connection_already_found === false) {
                    drawConnection(currently_selected_item, hitResult.item.parent)
                  }
                }
              }

              $('#network_canvas').css('cursor','grab');
            } else {
              $('#network_canvas').css('cursor','move');
            }

            creating_new_path = false;
            new_path.remove();
            new_path = null;

          } else if(drag_item) {
            $('#network_canvas').css('cursor','grab');
            drag_item.firstChild.position = new Point(parseInt(drag_item.firstChild.position.x, 10), parseInt(drag_item.firstChild.position.y, 10));
            console.log(drag_item.position);
            console.log(drag_item.firstChild.position);

            drag_item = null;
          }

        });
    });
  }

  $("#save_game_layout").on("click", function() {

    var json_payload = {
      games: {
        id: null,
        x: null,
        y: null,
        pan_x: paper.view.center.x,
        pan_y: paper.view.center.y,
        zoom: paper.view.zoom,
        steps: [],
        decisions: []
      }
    };

    $.each(paper.project.layers, function(index, layer) {
      if("game_id" in layer) {
        json_payload.games.x = layer.firstChild.position.x;
        json_payload.games.y = layer.firstChild.position.y;
      } else if("step_id" in layer) {
        json_payload.games.steps.push({ id: layer.step_id, x_position: layer.firstChild.position.x, y_position: layer.firstChild.position.y})
      } else if("decision_id" in layer) {
        json_payload.games.decisions.push({ id: layer.decision_id, x_position: layer.firstChild.position.x, y_position: layer.firstChild.position.y })
      }
    });

    var current_path = $(location).attr('pathname');

    if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
      var current_game_id = current_path.split( '/' )[3];
      var jsonURL = "/games/" + current_game_id + "/game_layout";

      json_payload.games.id = current_game_id;

      $.ajax({
        url: jsonURL,
        method: "PUT",
        data: json_payload,
      }).done(function() {
        $("<div id='flashes'>" +
          "<div class='flash flash_notice'>Layout saved</div>" +
        "</div>").insertAfter("#title_bar");
        setTimeout( function(){$("#flashes").slideUp();} , 4000);
      }).error(function(error) {
        alert("error: " + error);
        console.log(error);
      });
    }
  });
});
