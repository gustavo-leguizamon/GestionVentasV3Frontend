var products = [];

$(function(){
  $('#open-cart').click(function(){
    openCart();
  });

  $('.closebtn').click(function(){
    closeCart();
  });
  
  $('.btn-sell a').click(buy);
});

function openCart() {
  $('#cart').css('width', '450px');
  
  $('#fill').css('width', '100%');
  $('#fill').css('height', '100%');
  $('#fill').css('background-color', 'rgba(0,0,0,0.4)');
  $('#fill').bind('click', function(){
    closeCart();
  });
}

function closeCart() {
  $('#cart').css('width', '0px');
  
  $('#fill').css('background-color', 'rgba(0,0,0,0.0)');
  setTimeout(
    function() 
    {
      hideFill();
    }, 500);
  $('#fill').unbind('click');
}

function hideFill() {
  $('#fill').css('width', '0');
  $('#fill').css('height', '0');
}

function restoreSelectedProducts(){
  var selectedProducts = getSelectedProducts();
  resetSelectedProducts();
  $.each(selectedProducts, function(index, product){
    for(i = 0; i < product.cantidad; i++){
      addProduct(product.productoId);
    }
  });
}

function restoreCart(){
  var selectedProducts = getSelectedProducts();
  products = selectedProducts;
  resetSelectedProducts();
  $.each(selectedProducts, function(index, product){
    var count = product.cantidad;
    for(i = 0; i < count; i++){
      addProduct(product.productoId);
    }
  });
}

function incrementAmount(productID){
  let elements = '.amount-' + productID;
  let value = parseInt($($(elements)[0]).text());
  $(elements).html(value + 1);
}

function decrementAmount(productID){
  let elements = '.amount-' + productID;
  let value = parseInt($($(elements)[0]).text());
  if(value > 0){
    $(elements).html(value - 1);
  }
}

function resetAmount(productID){
  let elements = '.amount-' + productID;
  $(elements).html(0);
}

function updateSummary(){
  var selectedProducts = getSelectedProducts();
  var value = 0;
  $.each(selectedProducts, function(index, product){
    value += product.precio * product.cantidad;
  });

  if(selectedProducts.length > 0){
    $('.cart-summary').removeClass('cart-summary-empty')
    $('.btn-sell').removeClass('disabled');
    $('.cart-header').removeClass('hide');
  }
  else{
    $('.cart-summary').addClass('cart-summary-empty')
    $('.btn-sell').addClass('disabled');
    $('.cart-header').addClass('hide');
  }

  $('.count').html(selectedProducts.length);
  $('.summary').html(currencyFormat(value));
}

function updateCartProduct(product) {
  var total = product.cantidad * product.precio;
  $('#cart-item-price-total-' + product.productoId).html(currencyFormat(total));
}

function addProduct(productID){
  var selectedProducts = getSelectedProducts();
  var selected = selectedProducts.find(x => x.productoId == productID);
  if (selected){
    selected.cantidad = selected.cantidad + 1;
    // updateSummary();
    updateCartProduct(selected);

    selectedProducts = selectedProducts.remove("productoId", parseInt(productID));
  }
  else{
    selected = products.find(x => x.productoId == productID)
    selected.cantidad = 1;
    
    var cartList = $('.cart-list');
    var newProduct = `<li id="item-${selected.productoId}" class="cart-item">
                        <div class="cart-item-img">
                          <img class="img-fluid" src="${selected.imagen}" />
                        </div>
                        <div class="cart-item-title">
                          <span class="cart-item-name truncate">${selected.nombre}</span>
                          <span class="cart-item-amount">Cantidad: <span class="amount-${selected.productoId}">0</span></span>
                        </div>
                        <div class="cart-item-price">
                          <span>$</span><span id="cart-item-price-total-${selected.productoId}">${currencyFormat(selected.precio)}</span>
                        </div>
                        <div class="cart-item-remove">
                          <a href="javascript:void(0)" onclick="removeEntireProduct(${selected.productoId})">
                            <i class="fas fa-trash"></i>
                          </a>
                        </div>
                      </li>`;
    cartList.append(newProduct);
  }

  selectedProducts.push(selected);
  setSelectedProducts(selectedProducts);
  incrementAmount(productID);
  updateSummary();
}

function removeProduct(productID){
  var selectedProducts = getSelectedProducts();
  var selected = selectedProducts.find(x => x.productoId == productID);
  selected.cantidad = selected.cantidad - 1;

  if(selected.cantidad === 0){
    selectedProducts = selectedProducts.remove("productoId", parseInt(productID));
    $('#item-' + selected.productoId).remove();
    setSelectedProducts(selectedProducts);
  }

  updateSummary();
}

function removeEntireProduct(productID){
  var selectedProducts = getSelectedProducts();
  selectedProducts = selectedProducts.remove("productoId", parseInt(productID));
  $('#item-' + productID).remove();

  setSelectedProducts(selectedProducts);
  resetAmount(productID);
  updateSummary();
}

async function cleanCart(){
  var selectedProducts = getSelectedProducts();
  var confirmClean = false;
  await Swal.fire({
    title: `Limpiar carrito?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'No'
  }).then((result) => {
    confirmClean = result.value;
  });

  if(confirmClean){
    $.each(selectedProducts, function(index, product){
      removeEntireProduct(product.productoId);
    });
  }
}

function buy(){
  var showLoading = Swal.fire({
    title: `Confirmando compra...`,
    showConfirmButton: false,
    backdrop: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });

  var selectedProducts = getSelectedProducts();
  if(selectedProducts.length === 0){
    notify('No hay productos seleccionados', 'warning');
    return;
  }

  var totalPrice = $($('.summary')[0]).text().replace(',', '.');

  var sale = {
    "clienteId": CLIENT_LOGGED.clienteId,
    "totalPrice": parseFloat(totalPrice),
    "carrito": {
      "productos": []
    }
  };

  $.each(selectedProducts, function(index, product){
    sale.carrito.productos.push({productoId: product.productoId, cantidad: product.cantidad});
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
    .catch(async function(error){
      await notify('Error al realizar la compra', 'error');
    })
    .then(async function(response){
      resetSelectedProducts();
      console.log('Success:', response);
      await notify('Se realizó la compra', 'success');
      location.reload(true);
    })
    then(function(){
      showLoading.close();
    });
}