import { CommonUtil, HttpCode, LoggerFactory, StringUtil } from 'wallet-common-lib';
import { consumerDao, addressDao } from 'wallet-db-lib';
import * as winston from 'winston';

const logger: winston.Logger = LoggerFactory.create('LocateAgentController');

// radius in km - read from environment, if not set then default 5
let radius = CommonUtil.parseInteger(process.env.AGENT_LOCATE_DISTANCE);
radius = radius > 0 ? radius : 5;

export const locateAgent = async (req: any, res: any) => {
    logger.info('Locate Agent API called | Request Data: ' + JSON.stringify(req.query));
    const lat = req.query?.lat;
    const lng = req.query?.lng;
    const consumer = await consumerDao.findOneByPhone(req.tokenData.phone, req.tokenData.countryCode);
    const consumerAddress = await addressDao.findOneByQuery({ address_id: consumer.addressId });
    if (!consumerAddress) return res.status(HttpCode.NOT_FOUND).json({ message: 'Address not found' });
    logger.info('Locate Agent API | consumerAddress: ' + JSON.stringify(consumerAddress));
    //locate agent within X-km
    const addresses = await addressDao.findNearBy(
        consumerAddress.addressId,
        lat,
        lng,
        radius
    );
    logger.info('Locate Agent API | addresses: ' + addresses?.length);
    return res.status(HttpCode.OK).json(addresses)
}