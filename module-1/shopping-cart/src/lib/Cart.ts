export interface Item {
  product: {
    title: string;
    price: number;
  };
  quantity: number;
}

export default class Cart {
  items: Item[] = [];

  add(item: Item) {
    this.items.push(item);
  }

  getTotal() {
    return this.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  }
}
