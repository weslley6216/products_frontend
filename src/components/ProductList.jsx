import ProductItem from './ProductItem';

function ProductList({ products, onSave, onDelete, hasNewProduct, setHasNewProduct }) {

  const newProduct = { id: null, name: '', price: '', sku: '' }
  const productsToDisplay = hasNewProduct ? [newProduct, ...products] : products;

  return (
    <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
      {productsToDisplay.length === 0 ? (
        <p className="p-4 text-gray-600 italic text-center">Nenhum produto cadastrado.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead>
            <tr>
              <th className="w-3/12 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="w-2/12 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="w-2/12 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="w-1/12 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Primeira Letra Ausente</th>
              <th className="w-4/12 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productsToDisplay.map((product) => {
              const isNewProduct = product.id === null;
              const cancelNewProduct = () => setHasNewProduct(false);

              return (
                <ProductItem
                  key={product.id || 'new-product'}
                  product={product}
                  onSave={onSave}
                  onDelete={isNewProduct ? cancelNewProduct : onDelete}
                  isNewProduct={isNewProduct}
                />
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductList;
