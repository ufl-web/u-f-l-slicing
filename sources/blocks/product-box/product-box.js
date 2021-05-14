$(document).ready(function(){
  $('.js-add-to-cart').on('click', function (e) {
    e.preventDefault();
    var productId = $(this).data('id');
    window.addPromoToCard(productId, 1, 'to_card')
  })
})