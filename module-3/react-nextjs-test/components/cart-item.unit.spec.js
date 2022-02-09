import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { setAutoFreeze } from 'immer'
;
import { useCartStore } from '../store/cart';

import CartItem from './cart-item';

setAutoFreeze(false);

const product = {
  id: 1,
  title: 'Relógio',
  price: '22.00',
  image: 'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
  quantity: 1
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

  it('should display 1 as initial quantity', () => {
    renderCartItem();

    expect(screen.getByTestId('quantity').textContent).toEqual('1');
  })

  it.skip('should increase quantity by 1 when second button is clicked', () => {
    renderCartItem();

    const increaseButton = screen.getByTestId('increase');

    screen.debug(increaseButton);

    // fireEvent.click(increaseButton);

    // expect(screen.getByTestId('quantity').textContent).toEqual('2');
  })

  it.skip('should decrease quantity by 1 when first button is clicked', () => {
    renderCartItem();

    const decreaseButton = screen.getByTestId('decrease');

    userEvent.click(decreaseButton);

    expect(screen.getByTestId('quantity').textContent).toEqual('0');
  })

  it.skip('should not go below zero in the quantity', () => {
    renderCartItem();

    const decreaseButton = screen.getByTestId('decrease');

    userEvent.click(decreaseButton);
    userEvent.click(decreaseButton);
    userEvent.click(decreaseButton);

    expect(screen.getByTestId('quantity').textContent).toEqual('0');
  })

  it('should call remove() when remove button is clicked', async () => {
    const result = renderHook(() => useCartStore()).result;

    const spy = jest.spyOn(result.current.actions, 'remove');

    renderCartItem();

    const button = screen.getByRole('button', {  name: /remove/i });

    await userEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  })
})