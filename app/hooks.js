var nm = require('./modules/namespace');

$('.remove-hook').on('click', function( e ){
  var $this = $(this);

  $.ajax({
    type: 'delete',
    url: $this.attr('href')
  }).done(function(){
    $this.parent().remove();
  });

  return false;
});

$('.test-hook').on('click', function( e ){

  $.post( $(this).attr('href'), function( data ){
    console.log(data);
  });

  return false;
});

