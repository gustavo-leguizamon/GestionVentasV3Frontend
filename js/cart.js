$(function(){
  $('#open-cart').click(function(){
    openCart();
  });

  $('.closebtn').click(function(){
    closeCart();
  });
});

function openCart() {
  $('#cart').css('width', '450px');
  
  // $('#relleno').css('width', '100%');
  // $('#relleno').css('height', '100%');
  // $('#relleno').css('background-color', 'rgba(0,0,0,0.4)');
  // $('#relleno').bind('click', function(){
  //   closeCart();
  // });
}

function closeCart() {
  $('#cart').css('width', '0px');
  
  // $('#relleno').css('background-color', 'rgba(0,0,0,0.0)');
  // setTimeout(
  //   function() 
  //   {
  //     hideRelleno();
  //   }, 500);
  // $('#relleno').unbind('click');
}

// function hideRelleno() {
//   $('#relleno').css('width', '0');
//   $('#relleno').css('height', '0');
// }


function incrementAmount(productID){
  let id = '#amount-' + productID;
  let value = parseInt($(id).val());
  $(id).val(value + 1);
}

function updateSummary(product){
  var summary = parseFloat($('.summary').html().replace(',', '.'));
  var value = product.precio + summary;
  $('.summary').html(value);
}

function addProduct(productID){
  var selected = selectedProducts.find(x => x.productoId == productID);
  if (selected){
    selected.cantidad = selected.cantidad + 1;
    updateSummary(selected);
  }
  else{
    var product = products.find(x => x.productoId == productID)
    product.cantidad = 1;
    selectedProducts.push(product);
    
    var cartList = $('.cart-list');
    var newProduct = `<li class="cart-item">
                    <div class="cart-item-img">
                      <img class="img-fluid" src="${product.imagen}" />
                    </div>
                    <div class="cart-item-name">
                      <span class="truncate">${product.nombre}</span>
                    </div>
                    <div class="cart-item-price">
                      <span>$${product.precio}</span>
                    </div>
                    <div class="cart-item-remove">
                      <a href="#">
                        <i class="fas fa-trash"></i>
                      </a>
                    </div>
                  </li>`;
    cartList.append(newProduct);
    
    $('.count').html(selectedProducts.length);
    updateSummary(product);
  }
}