function currencyFormat(number, decimalCharacter){
  return number.toFixed(2).toString().replace('.', ',');
}