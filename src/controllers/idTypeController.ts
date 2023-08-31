import { HttpCode, LoggerFactory } from 'wallet-common-lib';
import { identityTypeDao } from 'wallet-db-lib';
import { Request, Response } from 'express';
import * as winston from 'winston';

const logger: winston.Logger = LoggerFactory.create('idTypesController');

export const getIdentityTypes = async (req: Request, res: Response) => {
    const result = await identityTypeDao.findAll();
    logger.info('Fetched Result: ' + result);
    return res.status(HttpCode.OK).send(result);
}


