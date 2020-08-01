function initSelectedProducts(products){
  if(localStorage.getItem('selectedProducts') == undefined || localStorage.getItem('selectedProducts') == null){
    localStorage.setItem('selectedProducts', '[]');
  }

  var selected = getSelectedProducts();
  setSelectedProducts(selected);
}

function setSelectedProducts(products){
  if(products != undefined){
    localStorage.setItem('selectedProducts', JSON.stringify(products));
  }
}

function getSelectedProducts(){
  var products = JSON.parse(localStorage.getItem('selectedProducts'));
  return products;
}

function resetSelectedProducts(){
  localStorage.setItem('selectedProducts', '[]');
}

function currencyFormat(number){
  return number.toFixed(2).toString().replace('.', ',');
}

function idFormat(number){
  return number.toString().padStart(6, '0');
}

// OVERRIDE
Array.prototype.remove = function (key, value) {
  const index = this.findIndex(obj => obj[key] === value);
  return index >= 0 ? [
      ...this.slice(0, index),
      ...this.slice(index + 1)
  ] : this;
};

function showLoading(){
  return Swal.fire({
    showConfirmButton: false,
    toast: true,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });
}

function notify(message, action){
  return Swal.fire({
    icon: action,
    title: message,
    showConfirmButton: false,
    backdrop: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    timer: 1500
  });
}