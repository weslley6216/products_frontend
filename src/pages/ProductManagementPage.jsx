import { useState, useEffect, useCallback } from 'react';
import ProductList from '../components/ProductList';
import productService from '../services/productService';

function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNewProduct, setHasNewProduct] = useState(false);

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
    setHasNewProduct(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await productService.deleteProduct(id);
        const updatedListProducts = products.filter(product => product.id !== id);
        setProducts(sortProductsByName(updatedListProducts));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Não foi possível deletar o produto.');
      }
    }
  };

  const handleSaveProduct = async (product, isNewProduct) => {
    try {
      let savedProduct;
      let updatedListProducts;

      if (isNewProduct) {
        const { name, price, sku } = product;
        savedProduct = await productService.addProduct({ name, price, sku });
        updatedListProducts = [...products, savedProduct];
        setHasNewProduct(false);
      } else {
        savedProduct = await productService.updateProduct(product.id, product);
        updatedListProducts = products.map(existingProduct =>
          existingProduct.id === product.id ? savedProduct : existingProduct
        );
      }

      setProducts(sortProductsByName(updatedListProducts));
    } catch (error) {
      console.error('Error saving product:', error);
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
          disabled={hasNewProduct}
        >
          Adicionar Novo Produto
        </button>
      </div>

      <ProductList
        products={products}
        onSave={handleSaveProduct}
        onDelete={handleDelete}
        hasNewProduct={hasNewProduct}
        setHasNewProduct={setHasNewProduct}
      />
    </div>
  );
}

export default ProductManagementPage;
