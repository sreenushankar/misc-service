import { Request, Response } from 'express';
import { LoggerFactory } from 'wallet-common-lib';
import { industryTypesDao, incomeTypesDao, businessTypesDao } from 'wallet-db-lib';
import * as winston from 'winston';

const logger: winston.Logger = LoggerFactory.create('MiscController');
// fetch all industry types
export const getIndustryTypes = async (req: Request, res: Response) => {
    logger.info('Get Industry types API');
    const result = await industryTypesDao.findAll()
    //logger.info('Get Industry type|Response Data: ' + JSON.stringify(result));
    return res.status(200).json(result)
}

// fetch all Income types
export const getIncomeTypes = async (req: Request, res: Response) => {
    logger.info('Get Income types API');
    const result = await incomeTypesDao.findAll()
    // logger.info('Get Income type|Response Data: ' + JSON.stringify(result));
    return res.status(200).json(result)
}

export const getBusinessTypes = async (req: Request, res: Response) => {
    logger.info('Get Business types API');
    const result = await businessTypesDao.findAll()
    //logger.info('Get Business type|Response Data: ' + JSON.stringify(result));
    return res.status(200).json(result)
}