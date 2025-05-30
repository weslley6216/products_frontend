import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import ProductManagementPage from '@/pages/ProductManagementPage';
import productService from '@/services/productService';
import ProductList from '@/components/ProductList';

vi.mock('@/services/productService', () => ({
  default: {
    getAllProducts: vi.fn(),
  },
}));

vi.mock('@/components/ProductList', () => ({
  default: vi.fn(() => null)
}));

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('ProductManagementPage', () => {
  const mockProducts = [
    { id: 1, name: 'Teclado', price: 3.50, sku: 'MON001' },
    { id: 2, name: 'Notebook', price: 5.00, sku: 'TLC001' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    productService.getAllProducts.mockResolvedValue(mockProducts);
  });

  it('should display loading message initially', () => {
    render(<ProductManagementPage />);

    expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();
    expect(ProductList).not.toHaveBeenCalled();
  });

  it('should render main elements (title, add button, and ProductList) after successful load', async () => {
    render(<ProductManagementPage />);

    await waitFor(() => {
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Carregando produtos...')).not.toBeInTheDocument();

      expect(screen.getByRole('heading', { name: /gestão de produtos/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /adicionar novo produto/i })).toBeInTheDocument();

      expect(ProductList).toHaveBeenCalledTimes(1);
      expect(ProductList).toHaveBeenCalledWith(
        {
          products: expect.arrayContaining([
            expect.objectContaining({ name: 'Notebook' }),
            expect.objectContaining({ name: 'Teclado' })
          ]),
          onSave: expect.any(Function),
          onDelete: expect.any(Function),
          newProductTempId: null,
          setNewProductTempId: expect.any(Function)
        }, undefined
      );
    });
  });

  it('should display an error message if product loading fails', async () => {
    productService.getAllProducts.mockRejectedValueOnce(new Error('Network error'));

    render(<ProductManagementPage />);

    await waitFor(() => {
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Unable to load products. Please try again later.')).toBeInTheDocument();
    });

    expect(screen.queryByText('Carregando produtos...')).not.toBeInTheDocument();
    expect(ProductList).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading products:', expect.any(Error));
  });

  it('should have "Adicionar Novo Produto" button enabled initially', async () => {
    render(<ProductManagementPage />);
    await waitFor(() => expect(productService.getAllProducts).toHaveBeenCalled());

    expect(screen.getByRole('button', { name: /adicionar novo produto/i })).toBeEnabled();
  });
});
