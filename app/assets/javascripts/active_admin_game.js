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

    if( i === parseInt(raw_string.length / 20)) {
      end_position = raw_string.length;
    } else {
      end_position = start_position + 19;
    }

    last_space_position = start_position + raw_string.slice(start_position, end_position).lastIndexOf(" ")
    if (last_space_position === -1) {
      last_space_position = end_position;
      unused_text_position = 0;
    } else if (last_space_position < end_position) {
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

  var game_title = game.title ? game.id + "\n" + formatText(game.title) : game.id

  var game_text = new PointText({
    point: [0, 80],
    content: game_title,
    fillColor: 'black',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 15
  });

  rectangle_path.fillColor = '#FFF5C3';
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
  var rectangle = new Rectangle(new Point(0, 0), new Point(150, 100));
  var rectangle_path = new Path.Rectangle(rectangle);

  var status_message = step.status_message ? step.id + "\n" + formatText(step.status_message) : step.id

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
  layer.decision_table = step.decision_table

  return layer;
}

var drawDecision = function(decision) {
  var layer = new Layer();
  var rectangle = new Rectangle(new Point(0, 0), new Point(150, 100));
  var rectangle_path = new Path.Rectangle(rectangle);

  var decision_choice = decision.choice ? decision.id + "\n" + formatText(decision.choice) : decision.id

  var decision_text = new PointText({
    point: [0, 80],
    content: decision_choice,
    fillColor: 'black',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 15
  });

  rectangle_path.fillColor = '#9BD7D5';
  rectangle_path.strokeColor = '#FF7260';
  rectangle_path.strokeWidth = 0;

  rectangle_path.translate(decision.x_position, decision.y_position);
  decision_text.fitBounds(rectangle_path.bounds);

  // Add the paths to the layer:
  layer.addChild(rectangle_path);
  layer.addChild(decision_text);

  layer.choice = decision.choice;
  layer.connections = [];
  layer.decision_id = decision.id

  return layer;
}


var drawConnection = function(origin, destination, colour) {

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

  new_connection.strokeWidth = 3;

  var arrow = new Point(destination_point.x - origin_point.x, destination_point.y - origin_point.y);
  arrow = arrow.normalize(20);
  var arrow_path = new Group(new Path([arrow.rotate(135), new Point(0,0), arrow.rotate(-135)]));
  if(colour) {
    new_connection.strokeColor = colour;
    arrow_path.strokeColor = colour;
  } else {
    new_connection.strokeColor = 'black';
    arrow_path.strokeColor = 'black';
  }
  arrow_path.strokeWidth = 3;
  arrow_path.translate(mid_point);

  origin.addChild(connection_layer);
  origin.connections.push({to: destination, layer: connection_layer, colour: new_connection.strokeColor})
  destination.connections.push({from: origin, layer: connection_layer, colour: new_connection.strokeColor})
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

    new_connection.strokeColor = connection.colour;
    new_connection.strokeWidth = 3;
    connection.layer.addChild(new_connection);

    // redraw the arrow
    connection.layer.firstChild.remove();
    var mid_point = new Point((origin_point.x + destination_point.x) / 2, (origin_point.y + destination_point.y) / 2);

    var arrow = new Point(destination_point.x - origin_point.x, destination_point.y - origin_point.y);
    arrow = arrow.normalize(20);

    var arrow_path = new Group(new Path([arrow.rotate(135), new Point(0,0), arrow.rotate(-135)]));
    arrow_path.strokeColor = connection.colour;
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

        paper.view.center = new Point(data.game.pan_x_position, data.game.pan_y_position)
        if(data.game.zoom !== 0) paper.view.zoom = data.game.zoom;

        draw_game_layout(data);
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
                  $("input#id").val(currently_selected_item.game_id);
                  $("textarea#title").val(currently_selected_item.title);
                  $("textarea#description").val(currently_selected_item.description);
                } else if("step_id" in currently_selected_item) {
                  $("#game_form").hide();
                  $("#step_form").show();
                  $("#decision_form").hide();
                  $("input#id").val(currently_selected_item.step_id);
                  $("p#step_id").text(currently_selected_item.step_id);
                  $("textarea#status_message").val(currently_selected_item.status_message);

                  // remove any existing children
                  $("#decisions_and_outcomes_table").children().remove();

                  $.each(currently_selected_item.decision_table, function(index, decision_row) {
                    var table_row = "";
                    table_row = '<td class="outcome_step_id" id="outcome_step_id_' + decision_row.id + '"><p>' + decision_row.step + '</p>';
                    table_row += '<input hidden class="hidden_outcome_id" id="hidden_outcome_id_' + decision_row.id + '" value="' + decision_row.id + '"/></td>';

                    var decision_option_values, outcome_step_option_values, colour_option_values;
                    decision_option_values = "";
                    outcome_step_option_values = "";
                    color_option_values = "";

                    $.each(paper.project.layers, function(index, layer) {
                      if("decision_id" in layer) {
                        if(decision_row.decision_ids && decision_row.decision_ids.includes(layer.decision_id)) {
                          decision_option_values += "<option value=" + layer.decision_id + " selected>" + layer.decision_id + "</option>"
                        } else {
                          decision_option_values += "<option value=" + layer.decision_id + ">" + layer.decision_id + "</option>"
                        }
                      } else if("step_id" in layer) {
                        if(decision_row.outcome === layer.step_id) {
                          outcome_step_option_values += "<option value=" + layer.step_id + " selected>" + layer.step_id + "</option>"
                        } else {
                          outcome_step_option_values += "<option value=" + layer.step_id + ">" + layer.step_id + "</option>"
                        }
                      }
                    });

                    $.each(["#000000", "#FF0000", "#00FF00", "#0000FF"], function(index, colour) {
                      if(colour === decision_row.colour) {
                        color_option_values += "<option value=" + colour + " selected>" + colour + "</option>"
                      } else {
                        color_option_values += "<option value=" + colour + ">" + colour + "</option>"
                      }
                    });

                    table_row += '<td class="outcome_decision_ids" id="outcome_decision_ids_' + decision_row.id + '"><select class="chosen" multiple style="width: 100%;">' + decision_option_values + '</select></td>';
                    table_row += '<td class="outcome_next_step_id" id="outcome_next_step_id_' + decision_row.id + '"><select class="chosen" style="width: 100%;">' + outcome_step_option_values + '</select></td>';
                    table_row += '<td class="outcome_colour" id="outcome_colour_' + decision_row.id + '"><select class="chosen" style="width: 100%;">' + color_option_values + '</select></td>';
                    table_row += '<td><button class="update_outcome" id="update_outcome_' + decision_row.id + '">Update Outcome</button><button id="delete_outcome_' + decision_row.id + '">Delete Outcome</button></td>';

                    $("#decisions_and_outcomes_table").append('<tr>' + table_row + '</tr>');
                    $("#update_outcome_" + decision_row.id).on("click", function(event) {
                      update_outcome_handler(event);
                    });
                    $("#delete_outcome_" + decision_row.id).on("click", function(event) {
                      delete_outcome_handler(event);
                    });
                  });

                  $(".chosen").chosen({ allow_single_deselect: true });


                } else {
                  $("#game_form").hide();
                  $("#step_form").hide();
                  $("#decision_form").show();
                  $("input#id").val(currently_selected_item.decision_id);
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
            drag_item.children[1].fitBounds(drag_item.firstChild.bounds);

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
                    addNewConnection(currently_selected_item, hitResult.item.parent)
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

            drag_item = null;
          }

        });

        // add keyboard handling
        if(paper.tools.length === 0) {
          tool = paper.tools.push(new Tool());

          tool.onKeyUp = function(event) {
          	// When a key is released, set the content of the text item:

          };
        }

    });
  }

  $("#save_game_layout").on("click", function() {
    save_game_layout();
  });

  $("#remove_item").on("click", function () {
    if(currently_selected_item) {
      if("game_id" in currently_selected_item) {
        alert("You cannot delete the game itself!  Cancelling delete.")
      } else {
        var confirm_delete = confirm("Are you sure you want to delete this step and all it's connections?");
        if (confirm_delete == true) {
            delete_item(currently_selected_item);
        }
      }
    }
  });

  $("#add_new_step").on("click", function() {
    var json_payload = {
      games: {
        id: null,
        item_type: "step"
      }
    };

    var current_path = $(location).attr('pathname');

    if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
      var current_game_id = current_path.split( '/' )[3];
      var jsonURL = "/games/" + current_game_id + "/add_layout_item";

      json_payload.games.id = current_game_id;

      $.ajax({
        url: jsonURL,
        method: "POST",
        data: json_payload,
      }).done(function(data) {
        // set the new step as currently selected
        data.step.x_position = paper.view.center.x;
        data.step.y_position = paper.view.center.y;

        currently_selected_item = drawStep(data.step);
        currently_selected_item.layer.firstChild.strokeWidth = 3;

        // show the form for this step
        $("#game_form").hide();
        $("#step_form").show();
        $("#decision_form").hide();
        $("input#id").val(currently_selected_item.step_id);
        $("p#step_id").text(currently_selected_item.step_id);
        $("textarea#status_message").val(currently_selected_item.status_message);

        $("<div id='flashes'>" +
          "<div class='flash flash_notice'>Layout item added</div>" +
        "</div>").insertAfter("#title_bar");
        setTimeout( function(){$("#flashes").slideUp();} , 4000);
      }).error(function(error) {
        alert("error: " + error);
        console.log(error);
      });
    }
  });

  $("#add_new_decision").on("click", function() {
    var json_payload = {
      games: {
        id: null,
        item_type: "decision"
      }
    };

    var current_path = $(location).attr('pathname');

    if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
      var current_game_id = current_path.split( '/' )[3];
      var jsonURL = "/games/" + current_game_id + "/add_layout_item";

      json_payload.games.id = current_game_id;

      $.ajax({
        url: jsonURL,
        method: "POST",
        data: json_payload,
      }).done(function(data) {

        // set the new step as currently selected
        data.decision.x_position = paper.view.center.x;
        data.decision.y_position = paper.view.center.y;

        if(currently_selected_item) {
          currently_selected_item.firstChild.strokeWidth = 0;
        }

        currently_selected_item = drawDecision(data.decision);
        currently_selected_item = currently_selected_item.firstChild.layer;

        currently_selected_item.firstChild.strokeWidth = 3;

        // show the form for this step
        $("#game_form").hide();
        $("#step_form").hide();
        $("#decision_form").show();
        $("input#id").val(currently_selected_item.decision_id);
        $("p#decision_id").text(currently_selected_item.decision_id);
        $("textarea#choice").val(currently_selected_item.choice);

        $("<div id='flashes'>" +
          "<div class='flash flash_notice'>Layout item added</div>" +
        "</div>").insertAfter("#title_bar");
        setTimeout( function(){$("#flashes").slideUp();} , 4000);
      }).error(function(error) {
        alert("error: " + error);
        console.log(error);
      });
    }
  });

  $("#add_outcome").on("click", function(event) {
    event.preventDefault();

    var next_id = new Date().getTime();

    var table_row = "";
    table_row = '<td class="outcome_step_id" id="outcome_step_id_' + next_id + '"><p>' + currently_selected_item.step_id + '</p>';
    table_row += '<input hidden class="hidden_outcome_id" id="hidden_outcome_id_' + next_id + '" value="' + next_id + '"/></td>';

    var decision_option_values, outcome_step_option_values, color_option_values;
    decision_option_values = "";
    outcome_step_option_values = "";
    color_option_values = "";

    $.each(paper.project.layers, function(index, layer) {
      if("decision_id" in layer) {
        decision_option_values += "<option value=" + layer.decision_id + ">" + layer.decision_id + "</option>"
      } else if("step_id" in layer) {
        outcome_step_option_values += "<option value=" + layer.step_id + ">" + layer.step_id + "</option>"
      }
    });

    $.each(["#000000", "#FF0000", "#00FF00", "#0000FF"], function(index, colour) {
      color_option_values += "<option value=" + colour + ">" + colour + "</option>"
    });

    table_row += ('<td class="outcome_decision_ids" id="outcome_decision_ids_' + next_id + '"><select class="chosen" multiple style="width: 100%;">' + decision_option_values + '</select></td>')
    table_row += ('<td class="outcome_next_step_id" id="outcome_next_step_id_' + next_id + '"><select class="chosen" style="width: 100%;">' + outcome_step_option_values + '</select></td>');
    table_row += '<td class="outcome_colour" id="outcome_colour_' + next_id + '"><select class="chosen" style="width: 100%;">' + color_option_values + '</select></td>';
    table_row += ('<td><button class="update_outcome" id="update_outcome_' + next_id + '">Update Outcome</button><button id="delete_outcome_' + next_id + '">Remove Outcome</button></td>');
    $("#decisions_and_outcomes_table").append("<tr>" + table_row + "</tr>")
    $(".chosen").chosen({ allow_single_deselect: true });
    $("#update_outcome_" + next_id).on("click", function(event) {
      update_outcome_handler(event);
    });
    $("#delete_outcome_" + next_id).on("click", function(event) {
      delete_outcome_handler(event);
    });
  });

  function update_outcome_handler(event) {
    event.preventDefault();
    console.log("update outcome clicked");

    var json_payload = {
      games: {
        id: null,
        first_step: null,
        steps: [],
        decisions: [],
        outcomes: []
      }
    };
    var decision_ids = []

    $(event.currentTarget).parents("tr").find(".outcome_decision_ids").find("option:selected").each(function(index, decision) {
      decision_ids.push($(decision).val())
    });

    json_payload.games.outcomes.push({
      id: $(event.currentTarget).parents("tr").find("input:hidden").val(),
      step: currently_selected_item.step_id,
      decision_ids: decision_ids,
      outcome: $(event.currentTarget).parents("tr").find(".outcome_next_step_id").find("option:selected").val(),
      colour: $(event.currentTarget).parents("tr").find(".outcome_colour").find("option:selected").val()
    });

    var current_path = $(location).attr('pathname');

    if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
      var current_game_id = current_path.split( '/' )[3];
      var jsonURL = "/games/" + current_game_id + "/game_connections";

      json_payload.games.id = current_game_id;

      $.each(paper.project.layers, function(index, layer) {
        if("game_id" in layer) {
          json_payload.games.first_step = layer.first_step
        }
      });

      $.ajax({
        url: jsonURL,
        method: "POST",
        data: json_payload,
      }).done(function(result) {
        var current_step, outcome_step, current_decision, connection_already_found;

        // update the id of the hidden field so we can update in future to the correct
        // record
        if(result) {
          $(event.currentTarget).parents("tr").find("input:hidden").val(result.outcomes.id);
        }


        $.each(paper.project.layers, function(index, layer) {
          if("step_id" in layer) {
            if(layer.step_id === json_payload.games.outcomes[0].step) {
              current_step = layer;
            }
            console.log(typeof json_payload.games.outcomes[0].outcome);
            if(layer.step_id === parseInt(json_payload.games.outcomes[0].outcome, 10)) {
              outcome_step = layer;
              console.log(outcome_step);
            }
          }
        });

        $.each(json_payload.games.outcomes[0].decision_ids, function(index, decision) {
          // find the decision display item
          $.each(paper.project.layers, function(index, layer) {
            if("decision_id" in layer) {
              if(layer.decision_id === parseInt(decision,10)) {
                current_decision = layer;
                connection_already_found = false;
                $.each(current_step.connections, function(index, connection) {
                  if(connection.to === current_decision) {
                    connection_already_found = true;
                  }
                });

                if(connection_already_found === false) {
                  drawConnection(current_step, current_decision, "#000000")
                }

                connection_already_found = false;
                $.each(current_decision.connections, function(index, connection) {
                  if(connection.to === outcome_step) {
                    connection_already_found = true;
                    // make sure colour is up to date and redraw
                    connection.colour = json_payload.games.outcomes[0].colour;
                    redraw_connections(current_decision)
                  }
                });

                if(connection_already_found === false) {
                  console.log("not found, so drawConnection(current_decision, outcome_step)");
                  drawConnection(current_decision, outcome_step, "#000000")
                }
                paper.view.update();
              }
            }
          });
        });

        $("<div id='flashes'>" +
          "<div class='flash flash_notice'>Connection updated</div>" +
        "</div>").insertAfter("#title_bar");
        setTimeout( function(){$("#flashes").slideUp();} , 4000);
      }).error(function(error) {
        alert("error: " + error);
        console.log(error);
      });
    }

  };

  function delete_outcome_handler(event) {
    event.preventDefault();
    console.log("delete outcome clicked");

    var json_payload = {
      games: {
        id: null,
        first_step: null,
        steps: [],
        decisions: [],
        outcomes: []
      }
    };

    json_payload.games.outcomes.push({id: $(event.currentTarget).parents("tr").find("input:hidden").val()});

    var current_path = $(location).attr('pathname');

    if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
      var current_game_id = current_path.split( '/' )[3];
      var jsonURL = "/games/" + current_game_id + "/game_connections";

      json_payload.games.id = current_game_id;

      $.ajax({
        url: jsonURL,
        method: "DELETE",
        data: json_payload,
      }).done(function() {
        var decision_ids, current_step, outcome_step, current_decision;

        decision_ids = [];

        $(event.currentTarget).parents("tr").find(".outcome_decision_ids").find("option:selected").each(function(index, decision) {
          decision_ids.push($(decision).val())
        });

        $.each(decision_ids, function(index, decision) {

          $.each(currently_selected_item.connections, function(index, connection) {
            if("to" in connection) {
              if(connection.to.decision_id === parseInt(decision, 10)) {
                current_decision = connection.to;
                connection.layer.remove();

                $.each(current_decision.connections, function(index, decision_connection) {

                  if("to" in decision_connection) {
                    var outcome_id = parseInt($(event.currentTarget).parents("tr").find(".outcome_next_step_id").find("option:selected").val(),10);
                    if(decision_connection.to.step_id === outcome_id) {
                      decision_connection.layer.remove();
                    }
                  }
                  if("from" in decision_connection) {
                    if(decision_connection.from.step_id === parseInt(decision, 10)) {
                      decision_connection.layer.remove();
                    }
                  }
                });
              }
            }
          });

        });

        paper.view.update();

        // remove the form control
        $(event.currentTarget).parents("tr").remove();

        $("<div id='flashes'>" +
          "<div class='flash flash_notice'>Connection updated</div>" +
        "</div>").insertAfter("#title_bar");
        setTimeout( function(){$("#flashes").slideUp();} , 4000);
      }).error(function(error) {
        alert("error: " + error);
        console.log(error);
      });
    }

  };


  function draw_game_layout(data) {
    var current_game,
      current_step,
      first_step,
      decisions,
      current_decision,
      outcome_step,　
      default_step;

    current_game = drawGame(data.game);

    //draw the steps for this game
    $.each(data.steps, function(index, step) {
      current_step = drawStep(step);

      if(step.id === data.game.first_step) {
        drawConnection(current_game, current_step, "#000000");
      }
    });

    decisions = []
    $.each(data.decisions, function(index, decision) {
      decisions.push(drawDecision(decision))
    });

    // loop through again and add connections between steps
    $.each(data.steps, function(index, step) {

      if(step.default_step) {
        // find the default step

        $.each(paper.project.layers, function(index, layer) {
          if("step_id" in layer) {
            if(step.id === layer.step_id) {
              current_step = layer;
            } else if(layer.step_id === step.default_step) {
              default_step = layer;
            }
          }
        });

        drawConnection(current_step, default_step, "#000000")
      }
    });

    // link up steps up to decisions to outcomes
    $.each(data.steps, function(index, step) {

      if(step.decision_table.length > 0) {
        $.each(step.decision_table, function(index, decision_row) {
          // find the step and outcome display itema
          $.each(paper.project.layers, function(index, layer) {
            if("step_id" in layer) {
              if(layer.step_id === decision_row.step) {
                current_step = layer;
              }
              if(layer.step_id === decision_row.outcome) {
                outcome_step = layer;
              }
            }
          });

          $.each(decision_row.decision_ids, function(index, decision) {
            // find the decision display item
            $.each(paper.project.layers, function(index, layer) {
              if("decision_id" in layer) {
                if(layer.decision_id === decision) {
                  current_decision = layer;
                  drawConnection(current_step, current_decision, "#000000")
                  drawConnection(current_decision, outcome_step, decision_row.colour)
                }
              }
            });
          });

        });
      }
    });
  }

  var findStep = function(stepId, stepsArray) {
      for (var i = 0; i < stepsArray.length; i++) {
          if (stepsArray[i].id === stepId)
              return stepsArray[i]; // Return as soon as the step is found
      }
      return null; // The step was not found
  }

  function save_game_layout() {
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
  };

  function addNewConnection(origin, destination) {
    var json_payload = {
      games: {
        id: null,
        first_step: null,
        steps: [],
        decisions: []
      }
    };

    if("game_id" in origin && "step_id" in destination) {
      json_payload.games.first_step = destination.step_id;
    } else {
      $.each(paper.project.layers, function(index, layer) {
        if("game_id" in layer) {
          json_payload.games.first_step = layer.first_step
        }
      });
    }

    if("step_id" in origin && "step_id" in destination) {
      json_payload.games.steps.push({id: origin.step_id, default_step: destination.step_id})
    }

    var current_path = $(location).attr('pathname');

    if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
      var current_game_id = current_path.split( '/' )[3];
      var jsonURL = "/games/" + current_game_id + "/game_connections";

      json_payload.games.id = current_game_id;

      $.ajax({
        url: jsonURL,
        method: "POST",
        data: json_payload,
      }).done(function() {
        drawConnection(origin, destination, "#000000")
        $("<div id='flashes'>" +
          "<div class='flash flash_notice'>Connection updated</div>" +
        "</div>").insertAfter("#title_bar");
        setTimeout( function(){$("#flashes").slideUp();} , 4000);
      }).error(function(error) {
        alert("error: " + error);
        console.log(error);
      });
    }
  }

  function delete_item(item) {
    var json_payload = {
      games: {
        id: null,
        steps: [],
        decisions: []
      }
    };

    if("step_id" in item) {
      json_payload.games.steps.push({ id: item.step_id})
    } else if("decision_id" in item) {
      json_payload.games.decisions.push({ id: item.decision_id})
    }

    var current_path = $(location).attr('pathname');

    if(current_path.length > 3 && current_path.split( '/' )[4] === "edit") {
      var current_game_id = current_path.split( '/' )[3];
      var jsonURL = "/games/" + current_game_id + "/delete_layout_item";

      json_payload.games.id = current_game_id;

      $.ajax({
        url: jsonURL,
        method: "DELETE",
        data: json_payload,
      }).done(function(data) {

        paper.project.clear();
        draw_game_layout(data.game);

        $("<div id='flashes'>" +
          "<div class='flash flash_notice'>Deleted successfully</div>" +
        "</div>").insertAfter("#title_bar");
        setTimeout( function(){$("#flashes").slideUp();} , 4000);
      }).error(function(error) {
        alert("error: " + error);
        console.log(error);
      });
    }
  }
});
