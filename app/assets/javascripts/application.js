// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require modernizr-2.8.3
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(function() {
//   $(":submit").prop('disabled', true);
  $(":checkbox").change(function(e) {
      var checkbox_elements = $(":checkbox");
      var is_invalid = true;
      for (var i = 0; i < checkbox_elements.length; i++ ) {
        if (checkbox_elements[i].checked==true) {
          is_invalid = false;
        }
      }
      $(":submit").prop('disabled', is_invalid);
    });
})

