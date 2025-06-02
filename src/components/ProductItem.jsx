import { useState, useEffect } from 'react';
import { formatCurrency, parsePrice } from '../utils/formatters';

function ProductItem({ product, onSave, onDelete, isNewProduct }) {
  const [isEditing, setIsEditing] = useState(isNewProduct);

  const [editedProduct, setEditedProduct] = useState({
    ...product,
    price: parsePrice(product.price)
  });

  const [originalProduct, setOriginalProduct] = useState(editedProduct);

  useEffect(() => {
    const currentProduct = { ...product, price: parsePrice(product.price) };
    setEditedProduct(currentProduct);
    setOriginalProduct(currentProduct);

    if (isNewProduct) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [product, isNewProduct]);

  const handleEditClick = () => (setIsEditing(true));

  const handleCancelClick = () => {
    if (isNewProduct) {
      onDelete(product.id);
    } else {
      setIsEditing(false);
      setEditedProduct({ ...originalProduct });
    }
  };

  const handleSaveClick = () => {
    if (editedProduct.name.trim() === '' || editedProduct.price === '' || editedProduct.sku.trim() === '') {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const productToSave = {
      ...editedProduct,
      price: parsePrice(editedProduct.price),
    };

    if (!isNewProduct &&
      originalProduct.name === productToSave.name &&
      originalProduct.price === productToSave.price &&
      originalProduct.sku === productToSave.sku) {
      setIsEditing(false);
      return;
    }

    onSave(productToSave, isNewProduct);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: name === 'price' ? parsePrice(value) : value,
    }));
  };

  return (
    <tr key={product.id}>
      {isEditing ? (
        <>
          <td className="px-6 py-4">
            <input
              type="text"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Nome do produto"
            />
          </td>
          <td className="px-6 py-4">
            <input
              type="number"
              name="price"
              value={editedProduct.price}
              onChange={handleChange}
              step="0.01"
              className="border p-2 rounded w-full"
              placeholder="Preço"
            />
          </td>
          <td className="px-6 py-4">
            <input
              type="text"
              name="sku"
              value={editedProduct.sku}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="SKU"
            />
          </td>
          <td className="px-6 py-4"></td>
        </>
      ) : (
        <>
          <td className="px-6 py-4">{product.name}</td>
          <td className="px-6 py-4">{formatCurrency.format(product.price)}</td>
          <td className="px-6 py-4">{product.sku}</td>
          <td className="px-6 py-4 text-center">{product.missing_letter}</td>
        </>
      )}
      <td className="px-6 py-4 text-center">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveClick}
              className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:shadow-outline-green active:bg-green-600 transition duration-150 ease-in-out"
            >
              Salvar
            </button>
            <button
              onClick={handleCancelClick}
              className="ml-2 px-4 py-2 font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEditClick}
              className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="ml-2 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out"
            >
              Deletar
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default ProductItem;
