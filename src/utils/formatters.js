export const formatCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export const parsePrice = (price) => {
  if (typeof price === 'string' && price.trim() === '') {
    return ''; // Retorna string vazia para campos de preço vazios
  }
  if (typeof price === 'number') {
    return price;
  }

  return parseFloat(price) || 0;
};

