import { Request, Response } from 'express';
import { HttpCode, LoggerFactory } from 'wallet-common-lib';
import { appConfigDao } from 'wallet-db-lib';
import * as winston from 'winston';

const logger: winston.Logger = LoggerFactory.create('appConfigController');

//fetch app config data
export const getConfig = async (req: Request, res: Response) => {
    logger.info('App Config API|Request Data: ' + JSON.stringify(req.query));
    const configName = String(req.query.configName);

    //fetch appconfig by config name
    const appConfig = await appConfigDao.findOneByName(configName);
    logger.info('fetch app config|Response Data: ' + JSON.stringify(appConfig));
    const response = {
        name: configName,
        value: appConfig?.value
    }
    logger.info('App Config API|Response Data: ' + JSON.stringify(response));
    return res.status(HttpCode.OK).json(response);
}
