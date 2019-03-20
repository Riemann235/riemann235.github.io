/**
 * 
 */

$('.led').each(function(i){
  var c = 50 * i;
  $(this).css({
    backgroundColor: 'hsl(' + c + ',75%,50%)',
    boxShadow: '0 0 10px hsl(' + c + ',75%,50%)'
  });
});