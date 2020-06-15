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

function decrementAmount(productID){
  let id = '#amount-' + productID;
  let value = parseInt($(id).val());
  $(id).val(value - 1);
}

function updateSummary(){
  var value = 0;
  $.each(selectedProducts, function(index, product){
    value += product.precio * product.cantidad;
  });
  $('.count').html(selectedProducts.length);
  $('.summary').html(currencyFormat(value));
}

function updateCartProduct(product) {
  var total = product.cantidad * product.precio;
  $('#cart-item-price-total-' + product.productoId).html(currencyFormat(total));
}

function addProduct(productID){
  var selected = selectedProducts.find(x => x.productoId == productID);
  if (selected){
    selected.cantidad = selected.cantidad + 1;
    updateSummary();
    updateCartProduct(selected);
  }
  else{
    var product = products.find(x => x.productoId == productID)
    product.cantidad = 1;
    selectedProducts.push(product);
    
    var cartList = $('.cart-list');
    var newProduct = `<li id="item-${product.productoId}" class="cart-item">
                    <div class="cart-item-img">
                      <img class="img-fluid" src="${product.imagen}" />
                    </div>
                    <div class="cart-item-name">
                      <span class="truncate">${product.nombre}</span>
                    </div>
                    <div class="cart-item-price">
                      <span>$</span><span id="cart-item-price-total-${product.productoId}">${currencyFormat(product.precio)}</span>
                    </div>
                    <div class="cart-item-remove">
                      <a href="#">
                        <i class="fas fa-trash"></i>
                      </a>
                    </div>
                  </li>`;
    cartList.append(newProduct);
    
    updateSummary();
  }
}

function removeProduct(productID){
  var selected = selectedProducts.find(x => x.productoId == productID);
  selected.cantidad = selected.cantidad - 1;

  if(selected.cantidad === 0){
    selectedProducts = selectedProducts.remove("productoId", parseInt(productID));
    $('#item-' + selected.productoId).remove();
  }

  updateSummary();
}

function buy(){
  if(selectedProducts.length === 0){
    alert('No hay productos seleccionados');
    return;
  }

  var sale = {
    "clienteId": CLIENT_LOGGED.clienteId,
    "carrito": {
      "productos": []
    }
  };

  $.each(selectedProducts, function(index, product){
    sale.carrito.productos.push({productoId: product.productoId});
  });

  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sale), // data can be `string` or {object}!
    mode: 'cors'
  };

  fetch(API_SALE, options)
    .then(function (response) {
      return response.json();
    })
    .catch(function(error){
      alert('Error al realizar la compra');
    })
    .then(function(response){
      console.log('Success:', response);
      alert('Se realizó la compra');
      location.reload(true);
    });
}