import * as winston from 'winston';
import { AppResponse, AttributeIdentifier, AttributeNames, AttributeTypes, Constants, HttpCode, LoggerFactory } from 'wallet-common-lib';
import { Request, Response } from 'express';
import {
    consumerDao,
    attributeNameDao,
    attributeTypeDao,
    consumerAttributeDao,
    AttributeNameFlds
} from 'wallet-db-lib';

const logger: winston.Logger = LoggerFactory.create('NotificationController');

// Register device for push notification
export const register = async (req: Request, res: Response) => {
    logger.info('Device Register | tokenData.phone: ' + req?.tokenData?.phone);
    const consumer = await consumerDao.findOneByPhone(req.tokenData.phone, req.tokenData.countryCode);

    // Fetch AttributeType and AttributeNames
    const attributeType = await attributeTypeDao.findOneByName(AttributeTypes.INFO);
    const attributeNames = await attributeNameDao.find({
        attributeName: [AttributeIdentifier.DEVICE_TYPE, AttributeIdentifier.DEVICE_TOKEN]
    });

    if (!attributeType || attributeNames?.length !== 2) {
        logger.error('Device Register | AttributeType or AttributeNames not found: '
            + AttributeIdentifier.DEVICE_TYPE + ', ' + AttributeIdentifier.DEVICE_TOKEN);
        res.status(HttpCode.INTERNAL_SERVER_ERROR);
        return res.send(new AppResponse(Constants.FAILURE, 'AttributeType or AttributeNames not found'));
    }

    // Create ConsumerAttributes
    const attributes = attributeNames.map((attributeName: AttributeNameFlds) => {
        return {
            identifier: attributeName.attributeName,
            consumerId: consumer.consumerId,
            attributeTypeId: attributeType.attributeTypeId,
            attributeNameId: attributeName.attributeNameId,
            value: attributeName.attributeName === AttributeIdentifier.DEVICE_TYPE ? req.body.osType : req.body.deviceToken,
            createdon: new Date().getTime(),
        }
    });
    await consumerAttributeDao.bulkUpsert(attributes);
    res.status(HttpCode.OK);
    return res.send(new AppResponse(Constants.SUCCESS));
}

// UnRegister device for push notification
export const unregister = async (req: Request, res: Response) => {
    logger.info('Device UnRegister | tokenData.phone: ' + req?.tokenData?.phone);
    const consumer = await consumerDao.findOneByPhone(req.tokenData.phone, req.tokenData.countryCode);
    const attributeTypeId = await attributeTypeDao.getFromCache(AttributeTypes.INFO);
    const attributeNameId1 = await attributeNameDao.getFromCache(AttributeNames.DEVICE_TYPE);

    await consumerAttributeDao.deleteByQuery({
        consumerId: consumer.consumerId,
        attributeTypeId: attributeTypeId,
        attributeNameId: attributeNameId1
    });

    const attributeNameId2 = await attributeNameDao.getFromCache(AttributeNames.DEVICE_TOKEN);

    await consumerAttributeDao.deleteByQuery({
        consumerId: consumer.consumerId,
        attributeTypeId: attributeTypeId,
        attributeNameId: attributeNameId2
    });

    res.status(HttpCode.OK);
    return res.send(new AppResponse(Constants.SUCCESS));
}
