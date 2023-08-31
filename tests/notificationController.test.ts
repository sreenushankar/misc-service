import { HttpCode } from 'wallet-common-lib';
import { consumerDao, attributeTypeDao, attributeNameDao, consumerAttributeDao } from 'wallet-db-lib';
import { register, unregister } from '../src/controllers/notificationController.js';


describe('Test notification', () => {
    let mockRequest: any //Partial<Request>;
    let mockResponse: any;
    const mockedTokenData = {
        phone: '1234567890',
        countryCode: '91'
    }
    const mockedConsumer: any = {
        consumerId: 1,
        addressId: 1,
        countryCode: 'string',
        phone: 'string',
        otp: 'string',
        otpCreatedon: 1,
        zpin: 'string',
        zsalt: 'string',
        zpinCreatedon: 1,
        zpinExpired: true,
        businessName: 'string',
        ownerName: 'string',
        firstname: 'string',
        surname: 'string',
        idNumber: 'string',
        createdon: 1,
        lastupdated: 1,
    }
    const attrType: any = {
        attributeTypeId: 1,
        attributeType: 'INFO'
    }
    const attributeNames: any = [
        {
            attributeNameId: 1,
            attributeName: 'DEVICE_TYPE',
        },
        {
            attributeNameId: 2,
            attributeName: 'DEVICE_TOKEN',
        }
    ];

    beforeEach(() => {
        mockRequest = {
            tokenData: mockedTokenData,
            body: {
                'deviceToken': 'string',
                'osType': 'string'
            }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should fail on register', async () => {
        jest.spyOn(consumerDao, 'findOneByPhone').mockResolvedValue(mockedConsumer);
        jest.spyOn(attributeTypeDao, 'findOneByName').mockResolvedValue(attrType);
        jest.spyOn(attributeNameDao, 'find').mockResolvedValue([]);
        await register(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.INTERNAL_SERVER_ERROR);
        });
    })

    it('should register device', async () => {
        jest.spyOn(consumerDao, 'findOneByPhone').mockResolvedValue(mockedConsumer);
        jest.spyOn(attributeTypeDao, 'findOneByName').mockResolvedValue(attrType);
        jest.spyOn(attributeNameDao, 'find').mockResolvedValue(attributeNames);
        jest.spyOn(consumerAttributeDao, 'bulkUpsert').mockResolvedValue();
        await register(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.OK);
        });
    })

    it('should unregister device', async () => {
        jest.spyOn(consumerDao, 'findOneByPhone').mockResolvedValue(mockedConsumer);
        jest.spyOn(consumerAttributeDao, 'deleteByQuery').mockResolvedValue(2);
        await unregister(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.OK);
        });
    })
})