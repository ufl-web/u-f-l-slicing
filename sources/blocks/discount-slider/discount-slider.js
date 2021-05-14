$(document).ready(function () {
  if($('.js-discount-slider').length){
    $('.js-discount-slider').slick({
      rows:0,
      nextArrow: '.js-discount-slider-next',
      prevArrow: '.js-discount-slider-prev',
      dots: true,
      arrows: true,
      dotsClass: 'discount-slider__dots',
      slide: '.discount-slider__item',
    });
  }
});