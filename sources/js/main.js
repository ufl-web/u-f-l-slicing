var jQuery = require('jquery');
console.log(window);
window.jQuery = jQuery;
window.$ = jQuery;
require('./bootstrap.min');
require('jquery-datetimepicker');
require('sidr/dist/jquery.sidr.js'); /*temp*/
require('slick-carousel'); /*temp*/
require('select2'); /*temp*/
require('responsive-tabs'); /*temp*/
require('../blocks/main-menu/main-menu');

$(document).ready(function(){

  $('.dropdown').on('show.bs.dropdown', function(e){
    $('.dropdown-menu', this).toggleClass('main-menu__submenu--opened');
  });
  $('.dropdown').on('hide.bs.dropdown', function(e){
    $('.dropdown-menu', this).toggleClass('main-menu__submenu--opened');
  });
  if($('.discount-package').length){
    require.ensure(['../blocks/discount-package/discount-package'], function () {
      require('../blocks/discount-package/discount-package');
    })
  }
  if($('.discount-slider').length){
    require.ensure(['../blocks/discount-slider/discount-slider'], function () {
      require('../blocks/discount-slider/discount-slider');
    })
  }

  require('../blocks/product-box/product-box');


});

