function currencyFormat(number){
  return number.toFixed(2).toString().replace('.', ',');
}

Array.prototype.remove = function (key, value) {
  const index = this.findIndex(obj => obj[key] === value);
  return index >= 0 ? [
      ...this.slice(0, index),
      ...this.slice(index + 1)
  ] : this;
};