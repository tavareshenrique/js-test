import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CartItem from './cart-item';

const product = {
  title: 'Relógio',
  price: '22.00',
  image: 'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
}

const renderCartItem = () => {
  render(<CartItem product={product} />);
}

describe('<CartItem />', () => {
  it('should render a ProductCard', () => {
    renderCartItem();

    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  })

  it('should display proper content', () => {
    renderCartItem();

    const image = screen.getByTestId('image');

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();

    expect(image).toHaveStyle({ backgroundImage: product.image })
    expect(image).toHaveProperty('src', product.image);
    expect(image).toHaveProperty('alt', product.title);
  })
})