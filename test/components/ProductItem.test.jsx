import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import ProductItem from '@/components/ProductItem';

describe('ProductItem', () => {
  const mockProduct = {
    id: 1,
    name: 'Teclado Gamer',
    price: 450.00,
    sku: 'TCL001',
    missing_letter: 'b'
  };

  const mockOnSave = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render product details in view mode', () => {
    render(
      <table>
        <tbody>
          <ProductItem
            product={mockProduct}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            isNewProduct={false}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('Teclado Gamer')).toBeInTheDocument();
    expect(screen.getByText('R$ 450,00')).toBeInTheDocument();
    expect(screen.getByText('TCL001')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.missing_letter)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deletar/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /salvar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
  });

  it('should switch to edit mode when "Editar" button is clicked', () => {
    render(
      <table>
        <tbody>
          <ProductItem
            product={mockProduct}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            isNewProduct={false}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    expect(screen.getByDisplayValue('Teclado Gamer')).toBeInTheDocument();
    expect(screen.getByDisplayValue(450)).toBeInTheDocument()
    expect(screen.getByDisplayValue('TCL001')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /editar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /deletar/i })).not.toBeInTheDocument();
  });

  it('should update editedProduct state on input change', () => {
    render(
      <table>
        <tbody>
          <ProductItem
            product={mockProduct}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            isNewProduct={false}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    const nameInput = screen.getByDisplayValue('Teclado Gamer');
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Novo Nome' } });
    expect(nameInput.value).toBe('Novo Nome');

    const priceInput = screen.getByDisplayValue(450);
    fireEvent.change(priceInput, { target: { name: 'price', value: '500.50' } });
    expect(priceInput.value).toBe('500.50');
  });

  it('should call onSave with updated product data when "Salvar" is clicked', async () => {
    render(
      <table>
        <tbody>
          <ProductItem
            product={mockProduct}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            isNewProduct={false}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    const nameInput = screen.getByDisplayValue('Teclado Gamer');
    const priceInput = screen.getByDisplayValue(450);
    const skuInput = screen.getByDisplayValue('TCL001');

    fireEvent.change(nameInput, { target: { name: 'name', value: 'Teclado Novo' } });
    fireEvent.change(priceInput, { target: { name: 'price', value: '600.00' } });
    fireEvent.change(skuInput, { target: { name: 'sku', value: 'SKU002' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Teclado Novo',
          price: 600,
          sku: 'SKU002',
        }),
        false
      );
    });
  });

  it('should revert to view mode and restore original data when "Cancelar" is clicked', () => {
    render(
      <table>
        <tbody>
          <ProductItem
            product={mockProduct}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            isNewProduct={false}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    const nameInput = screen.getByDisplayValue('Teclado Gamer');
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Nome Temporário' } });

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(screen.getByText('Teclado Gamer')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /salvar/i })).not.toBeInTheDocument();
  });

  it('should call onDelete with product id when "Cancelar" is clicked for a new product', () => {
    const newTempProduct = { id: -123, name: '', price: '', sku: '', missing_letter: '' };
    render(
      <table>
        <tbody>
          <ProductItem
            product={newTempProduct}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            isNewProduct={true}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(newTempProduct.id);
  });

  it('should call onDelete with product id when "Deletar" button is clicked', () => {
    render(
      <table>
        <tbody>
          <ProductItem
            product={mockProduct}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            isNewProduct={false}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByRole('button', { name: /deletar/i }));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should show alert and not call onSave if required fields are empty', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <table>
        <tbody>
          <ProductItem
            product={{ ...mockProduct, name: '', price: '', sku: '' }}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            isNewProduct={true}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(alertMock).toHaveBeenCalledWith('Por favor, preencha todos os campos!');
    expect(mockOnSave).not.toHaveBeenCalled();
    alertMock.mockRestore();
  });

  it('should not call onSave if no changes were made and it is not a new product', () => {
    render(
      <table>
        <tbody>
          <ProductItem
            product={mockProduct}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            isNewProduct={false}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /salvar/i })).not.toBeInTheDocument();
  });
});
