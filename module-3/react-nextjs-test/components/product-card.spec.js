import ProductCard from './product-card';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const product = {
  title: 'Relógio',
  price: '22.00',
  image: 'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
  // image: 'https://picsum.photos/200',
}

describe('<ProductCard />', () => {
  it('should render a ProductCard', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByTestId('product-card')).toBeInTheDocument();
  })

  it('should display proper content', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(screen.getByTestId('image')).toHaveStyle({
      backgroundImage: product.image
    })
  })
})