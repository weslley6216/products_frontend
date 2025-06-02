import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import ProductList from '@/components/ProductList';

describe('ProductList', () => {
  const mockProducts = [
    { id: 1, name: 'Produto A', price: 100, sku: 'SKU001', missing_letter: 'a' },
    { id: 2, name: 'Produto B', price: 200, sku: 'SKU002', missing_letter: 'b' },
  ];
  const mockOnSave = vi.fn();
  const mockOnDelete = vi.fn();
  const mockSetHasNewProduct = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render a message when no products are available', () => {
    render(
      <ProductList
        products={[]}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        hasNewProduct={false}
        setHasNewProduct={mockSetHasNewProduct}
      />
    );
    expect(screen.getByText('Nenhum produto cadastrado.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should render a table with products when products are available', () => {
    render(
      <ProductList
        products={mockProducts}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        hasNewProduct={false}
        setHasNewProduct={mockSetHasNewProduct}
      />
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByText('Nenhum produto cadastrado.')).not.toBeInTheDocument();
    expect(screen.getByText('Produto A')).toBeInTheDocument();
    expect(screen.getByText('Produto B')).toBeInTheDocument();
  });

  it('should render inputs and "Salvar"/"Cancelar" buttons for the temporary new product', () => {
    render(
      <ProductList
        products={mockProducts}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        hasNewProduct={true}
        setHasNewProduct={mockSetHasNewProduct}
      />
    );

    expect(screen.getByPlaceholderText('Nome do produto')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Preço')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('SKU')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('should call setHasNewProduct(false) when "Cancelar" is clicked for a temporary product', () => {
    render(
      <ProductList
        products={mockProducts}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        hasNewProduct={true}
        setHasNewProduct={mockSetHasNewProduct}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockSetHasNewProduct).toHaveBeenCalledTimes(1);
    expect(mockSetHasNewProduct).toHaveBeenCalledWith(false);
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should call onDelete with the correct product id when "Deletar" button is clicked for an existing product', () => {
    render(
      <ProductList
        products={mockProducts}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        hasNewProduct={false}
        setHasNewProduct={mockSetHasNewProduct}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /deletar/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProducts[0].id);
  });

  it('should call onSave with updated product data when "Salvar" is clicked on any product item', async () => {
    render(
      <ProductList
        products={mockProducts}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        hasNewProduct={false}
        setHasNewProduct={mockSetHasNewProduct}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editButtons[0]);

    const nameInput = screen.getByDisplayValue('Produto A');
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Produto A Modificado' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: 'Produto A Modificado' }),
      false
    );
  });

  it('should call onSave for a new temporary product when "Salvar" is clicked', async () => {
    render(
      <ProductList
        products={[]}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        hasNewProduct={true}
        setHasNewProduct={mockSetHasNewProduct}
      />
    );

    const nameInput = screen.getByPlaceholderText('Nome do produto');
    const priceInput = screen.getByPlaceholderText('Preço');
    const skuInput = screen.getByPlaceholderText('SKU');

    fireEvent.change(nameInput, { target: { name: 'name', value: 'Novo Produto Teste' } });
    fireEvent.change(priceInput, { target: { name: 'price', value: '123.45' } });
    fireEvent.change(skuInput, { target: { name: 'sku', value: 'NPT001' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({ id: null, name: 'Novo Produto Teste' }),
      true
    );
  });
});
