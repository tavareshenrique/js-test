import { appError } from '@/utils';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as service from '@/database/service';
import { get } from './user.middleware';

jest.mock('@/database/service');

describe('Middlewares > User', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should foward an error when an email is NOT provided in the headers', () => {
    const req = { headers: {} };
    const next = jest.fn().mockName('next');
    const error = appError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, error);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should foward an error when an email is provided in the headers but is invalid', () => {
    const req = {
      headers: {
        email: 'invalid-email',
      }
    };
    const next = jest.fn().mockName('next');
    const error = appError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, error);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should return an user object given a valid email is provided', async () => {
    const email = 'ihenrits@gmail.com';

    const req = {
      headers: {
        email,
      }
    };

    const next = jest.fn().mockName('next');

    jest.spyOn(service, 'findOrSave').mockResolvedValue([ {
      id: 1,
      email
    } ]);

    await get(req, null, next);

    expect(req.user).toBeDefined();
    expect(req.user).toEqual({
      id: 1,
      email
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/* nothing! */);
  });

  it('should return an error when servicec findOrSave fails', async () => {
    const email = 'ihenrits@gmail.com';

    const req = {
      headers: {
        email,
      }
    };

    const next = jest.fn().mockName('next');

    jest.spyOn(service, 'findOrSave').mockRejectedValueOnce('findOrSave failed');

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('findOrSave failed');
  });
});
