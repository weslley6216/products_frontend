export const formatCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export const parsePrice = (price) => {
  if (typeof price === 'string' && price.trim() === '') {
    return '';
  }
  if (typeof price === 'number') {
    return price;
  }

  return parseFloat(price) || 0;
};

