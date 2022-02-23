import { appError } from '@/utils';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as service from '@/database/service';
import { buildError, buildNext, buildReq } from 'test/builders';
import { get } from './user.middleware';

jest.mock('@/database/service');

describe('Middlewares > User', () => {
  const error = buildError(StatusCodes.UNPROCESSABLE_ENTITY, `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should foward an error when an email is NOT provided in the headers', () => {
    const req = buildReq({
      headers: {},
    });
    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, error);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should foward an error when an email is provided in the headers but is invalid', () => {
    const req = buildReq({
      headers: {
        email: 'invalid-email',
      }
    });

    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, error);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should return an user object given a valid email is provided', async () => {
    // Arrange
    const req = buildReq();
    const next = buildNext();

    const { email } = req.headers;

    const resolved = {
      id: 1,
      email,
    };

    jest.spyOn(service, 'findOrSave').mockResolvedValue([ resolved ]);

    // Act
    await get(req, null, next);

    // Assert
    expect(req.user).toBeDefined();
    expect(req.user).toEqual({
      id: 1,
      email
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/* nothing! */);
  });

  it('should return an error when servicec findOrSave fails', async () => {
    const req = buildReq();
    const next = buildNext();

    delete req.user;

    jest.spyOn(service, 'findOrSave').mockRejectedValueOnce('findOrSave failed');

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('findOrSave failed');
  });
});
