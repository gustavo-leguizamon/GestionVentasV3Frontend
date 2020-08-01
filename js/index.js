initSelectedProducts();

$(function(){
  getProducts();

});

function getProducts(){
  var loading = showLoading();

  var options = {
    method: 'GET',
    headers: {},
    mode: 'cors',
    cache: 'default'
  };

  fetch(API_PRODUCT, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (productsJson) {
      products = productsJson;
      var contentProducts = $('#content-products');
      $.each(productsJson, function(index, product){
        var productHtml = `<div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
                            <div class="card">
                              <div class="card-header">
                                <img src="${product.imagen}" alt="${product.nombre}" class="card-img-top">
                              </div>
                              <div class="card-body">
                                <h3>$${currencyFormat(product.precio)}</h3>
                                <h5>${product.nombre}</h5>

                                <div class="input-group mb-3">
                                  <div class="input-group-prepend">
                                    <button class="btn btn-outline-secondary remove-product" type="button" data-productoId="${product.productoId}"><i class="fas fa-minus"></i></button>
                                  </div>
                                  <span class="form-control text-center amount-${product.productoId}">0</span>
                                  <div class="input-group-append">
                                    <button class="btn btn-outline-secondary add-product" type="button" data-productoId="${product.productoId}"><i class="fas fa-plus"></i></button>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>`;
                        
        contentProducts.append(productHtml);
      });

      $('button.btn.btn-outline-secondary.add-product').click(function(){
        let productID = this.dataset.productoid;
        addProduct(productID);
      });

      $('button.btn.btn-outline-secondary.remove-product').click(function(){
        let productID = this.dataset.productoid;
        decrementAmount(productID);
        removeProduct(productID);
      });

      restoreSelectedProducts();
    })
    .catch(function(error){
      console.log(error);
      notify('Error al obtener los productos', 'error');
    })
    .then(function(){
      loading.close();
    });
}
