$(document).ready(function() {
  //Character count for textarea
  $('textarea').keyup(function() {
    const characterCount = 140 - $(this).val().length,
      current = $('#maximum');
    current.text(characterCount);
    if (characterCount > 0) {
    current.removeClass("characterError");
    } else {
    current.addClass("characterError");
    }
  });

});
