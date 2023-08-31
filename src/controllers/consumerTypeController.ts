import { HttpCode, LoggerFactory } from 'wallet-common-lib';
import { consumerTypeDao } from 'wallet-db-lib';
import { Request, Response } from 'express';
import * as winston from 'winston';

const logger: winston.Logger = LoggerFactory.create('consumerTypeController');

export const getConsumerTypes = async (req: Request, res: Response) => {
    const result = await consumerTypeDao.findAll();
    logger.info('Fetched Result: ' + result.length);
    return res.status(HttpCode.OK).json(result);
}


