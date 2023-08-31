import { Request, Response } from 'express';
import { HttpCode } from 'wallet-common';
import { appConfigDao } from 'wallet-dao';

//fetch app config data
export const config = async (req: Request, res: Response) => {
        const configName = req.query.configName;
        const result = await appConfigDao.findOneByName(configName);
        res.status(HttpCode.OK).send(result);
}