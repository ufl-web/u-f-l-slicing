function countdown(container, toDate, timePartClass){
  var requestAnimationFrame = (function() {
    return window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
  }());


  function tick() {
    // get the difference
    const startDate = new Date();
    const diff = toDate - startDate;
    var parts = [];
    // math
    parts[0] = Math.floor(diff / (1000 * 60 * 60 * 24));
    parts[1] = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    parts[2] = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    parts[3] =  Math.floor((diff % (1000 * 60)) / 1000);
    parts = parts.map(function (v) {
      return '<div class="' + timePartClass +'">' + (String(v).length === 1 ? '0' + v : v) + '</div>';
    });
    container.innerHTML = parts.join('');
    requestAnimationFrame(tick);

  }
  tick();
}
$(document).ready(function () {
  $('.discount-package__timer').each(function(){
    var toDate = Date.parse($(this).data('time-end'));
    var face = this;
    countdown(face, toDate, 'discount-package__timer-item');
  })
});
