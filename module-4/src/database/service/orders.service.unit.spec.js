/* eslint-disable no-param-reassign */
import { buildError, buildOrders, buildUser } from 'test/builders';
import { Order } from '@/database/models/order.model';
import { StatusCodes } from 'http-status-codes';
import { listOrders } from './orders.service';

jest.mock('@/database/models/order.model');
JSON.parse = jest.fn();

describe('Service > Orders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of orders', async () => {
    const user = buildUser();

    const where = {
      userid: user.id,
    };

    const orders = buildOrders().map(order => {
      order.products = JSON.stringify(order.products);

      return order;
    });

    jest.spyOn(Order, 'findAll').mockResolvedValueOnce(orders);

    const returnOrders = await listOrders(user.id);

    expect(returnOrders).toEqual(orders);
    expect(Order.findAll).toHaveBeenCalledTimes(1);
    expect(Order.findAll).toHaveBeenCalledWith({ where });
    expect(JSON.parse).toHaveBeenCalledTimes(orders.length);
  });

  it('should reject with an error when Order.findAll() fails', async () => {
    const user = buildUser();
    const error = buildError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve orders for user: 111');

    jest.spyOn(Order, 'findAll').mockRejectedValueOnce(error);

    await expect(listOrders(user.id)).rejects.toEqual(error);
  });
});
