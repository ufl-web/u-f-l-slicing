// require('sidr/dist/jquery.sidr.js');

function applySidr(){
  if(window.innerWidth <= 768){
    require.ensure('sidr/dist/jquery.sidr.js', function (require) {
      require('sidr/dist/jquery.sidr.js');
      $('.js-menu-toggle').sidr();
      $('.js-mobile-menu-close').sidr('close')
    })
  }
}
$.ready.then(function () {
  applySidr();
  if(window.innerWidth > 768) {
    $(window).on('resize', function (e) {
      applySidr();
    })
  }

})
