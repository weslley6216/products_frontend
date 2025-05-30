import { useState, useEffect, useCallback } from 'react';
import ProductList from '../components/ProductList';
import productService from '../services/productService';

function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProductTempId, setNewProductTempId] = useState(null);

  const sortProductsByName = useCallback((productList) => {
    return [...productList].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(sortProductsByName(data));
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Unable to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortProductsByName]);

  const handleAddClick = () => {
    if (!newProductTempId) {
      setNewProductTempId(Date.now() * -1);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await productService.deleteProduct(id);
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(sortProductsByName(updatedProducts));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Não foi possível deletar o produto.');
      }
    }
  };

  const handleSaveProduct = async (id, productData) => {
    try {
      let savedProduct;
      let updatedProducts;

      if (id > 0) { 
        savedProduct = await productService.updateProduct(id, productData);
        updatedProducts = products.map(product =>
          product.id === id ? savedProduct : product
        );
      } else { 
        const { name, price, sku } = productData;
        savedProduct = await productService.addProduct({ name, price, sku });
        updatedProducts = [...products, savedProduct];
      }
      setProducts(sortProductsByName(updatedProducts));
      setNewProductTempId(null);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);

      const errorMessage = error.response?.data?.message;

      if (errorMessage) {
        alert(`Erro ao salvar: ${errorMessage}`);
      } else {
        alert('Não foi possível salvar o produto. Verifique os dados e tente novamente.');
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center text-lg">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Gestão de Produtos
      </h1>

      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAddClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={newProductTempId !== null}
        >
          Adicionar Novo Produto
        </button>
      </div>

      <ProductList
        products={products}
        onSave={handleSaveProduct}
        onDelete={handleDelete}
        newProductTempId={newProductTempId}
        setNewProductTempId={setNewProductTempId}
      />
    </div>
  );
}

export default ProductManagementPage;
