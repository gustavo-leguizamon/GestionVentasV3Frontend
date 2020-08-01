$(function(){
  getPurchases();
});

function getPurchases(){
  var loading = showLoading();

  var clientId = CLIENT_LOGGED.clienteId;

  var URL = API_SALE_GET_PURCHASES_CLIENT.replace('{clientId}', clientId);

  var options = {
    method: 'GET',
    mode: 'cors'
  };

  fetch(URL, options)
    .then(function (response) {
      return response.json();
    })
    .catch(function(error){
      Swal.fire({
        title: 'Error al obtener las compras',
        showConfirmButton: false,
        backdrop: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        toast: true
      });
      loading.close();
    })
    .then(function(response){
      console.log('Success:', response);
      var purchasesHtml = $('#purchases');

      $.each(response, function(index, item){
        var purchaseHtml = `<tr>
                              <th scope="row">#${idFormat(item.saleId)}</th>
                              <td>${item.date}</td>
                              <td>${item.quantityProducts}</td>
                              <td>$${currencyFormat(item.totalPrice)}</td>
                              <td>
                                ${
                                  item.stateId == 2 ?
                                  'Cancelado' :
                                  `<a href="javascript:cancelPurchase(${item.saleId})" title="Cancelar compra"><i class="fas fa-ban"></i> Cancelar compra</a>`
                                }
                              </td>
                            </tr>`;

        purchasesHtml.append(purchaseHtml);
      });
      // restoreSelectedProducts();
      restoreCart();
      loading.close();
    });
}

async function cancelPurchase(saleID){
  var confirmCancel = false;
  await Swal.fire({
    title: `Quieres cancelar la compra #${idFormat(saleID)}?`,
    text: "No se podrá deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, cancelarlo!',
    cancelButtonText: 'No'
  }).then((result) => {
    confirmCancel = result.value;
  });

  if(confirmCancel){
    var showLoading = Swal.fire({
      title: `Cancelando compra #${idFormat(saleID)}...`,
      showConfirmButton: false,
      backdrop: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: saleID, // data can be `string` or {object}!
      mode: 'cors'
    };

    fetch(API_SALE_CANCEL_PURCHASE, options)
      .then(function (response) {
        if (!response.ok){
          throw Error('');
        }
      })
      .catch(function(error){
        notify('Error al cancelar la compra', 'error');
      })
      .then(async function(response){
        console.log('Success:', response);
        showLoading.close();

        await notify('Se canceló la compra', 'success');

        location.reload(true);
      });
  }
}