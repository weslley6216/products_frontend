import axiosInstance from './axios';

const PRODUCTS_URL = '/products';

const productService = {
  getAllProducts: async () => {
    try {
      const response = await axiosInstance.get(PRODUCTS_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },

  addProduct: async (productData) => {
    try {
      const { name, price, sku } = productData;
      const response = await axiosInstance.post(PRODUCTS_URL, { name, price, sku });
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const { name, price, sku } = productData;
      const dataToSend = { name, price, sku };

      const response = await axiosInstance.put(`${PRODUCTS_URL}/${id}`, dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await axiosInstance.delete(`${PRODUCTS_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

export default productService;
