// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  console.log('hello world :o');
    
  $.get('/myendpoint', function(data) {
    console.log(data)
    $('#data-container').text = data;
  });

});
