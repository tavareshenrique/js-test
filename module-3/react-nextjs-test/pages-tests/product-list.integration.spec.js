import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Response from 'miragejs';

import { makeServer } from '../miragejs/server';

import ProductList from '../pages';

const renderProductList = () => render(<ProductList />);

describe('ProductList', () => {
  let server;

  beforeEach(() => {
    server = makeServer({
      environment: 'test',
    });
  })

  afterEach(() => {
    server.shutdown();
  })

  it('should render ProductList', () => {
    renderProductList();

    expect(screen.getByTestId('product-list')).toBeInTheDocument()
  })

  it('should render the ProductCard component 10 times', async () => {
    server.createList('product', 10)
    
    renderProductList();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(10)
    })
  })

  it('should render the "no products message"', async () => {
    renderProductList();

    await waitFor(() => {
      expect(screen.getByTestId('no-products')).toBeInTheDocument()
    })
  })

  it('should display error message when promise rejects', async () => {
    server.get('products', () => {
      return new Response(500, {}, '');
    })

    renderProductList();

    await waitFor(() => {
      expect(screen.getByTestId('server-error')).toBeInTheDocument()
      expect(screen.queryByTestId('no-products')).toBeNull()
      expect(screen.queryAllByTestId('product-card')).toHaveLength(0)
    })
  })

  it('should filter the product list when a search is performed', async () => {
    const serachItem = 'Relógio Bonito';

    server.createList('product', 2)

    server.create('product', {
      title: serachItem,
    })
    
    renderProductList();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(3)      
    })

    const form = screen.getByRole('form')
    const input = screen.getByRole('searchbox')

    userEvent.type(input, serachItem)
    
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(1)      
    })
  })

  it('should display the total quantityt of products', async () => {
    server.createList('product', 10);

    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/10 Products/i)).toBeInTheDocument();
    })
  });

  it('should display product (singular) when there is only 1 product', async () => {
    server.createList('product', 1);

    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/1 Product$/i)).toBeInTheDocument();
    })
  });

  it('should display proper quantity when list is filtered', async () => {
    const serachItem = 'Relógio Bonito';

    server.createList('product', 2)

    server.create('product', {
      title: serachItem,
    })
    
    renderProductList();

    await waitFor(() => {
      expect(screen.getByText(/3 Products/i)).toBeInTheDocument();
    })

    const form = screen.getByRole('form')
    const input = screen.getByRole('searchbox')

    userEvent.type(input, serachItem)
    
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/1 Product$/i)).toBeInTheDocument();
    })
  });
})