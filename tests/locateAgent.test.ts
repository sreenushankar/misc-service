import { Response } from 'express';
import { HttpCode } from 'wallet-common-lib';
import { consumerDao, addressDao } from 'wallet-db-lib';
import { locateAgent } from '../src/controllers/locateAgentController';

describe('locateAgent', () => {
    let mockRequest: any //Partial<Request>;
    let mockResponse: Partial<Response>;
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
    const mockedConsumerAddress: any = {
        addressId: 1,
        lat: 12.9716,
        lng: 77.5946,
        address1: 'string',
        address2: 'string',
        city: 'string',
        state: 'string',
        country: 'string',
        zip: 'string',
        createdon: 1,
        lastupdated: 1,
    }
    const mockAddresses: any = [
        {
            addressId: 1,
            lat: 12.9716,
            lng: 77.5946,
            distance: 1,// in km
            address1: 'string',
            address2: 'string',
            city: 'string',
            state: 'string',
            country: 'string',
            zip: 'string',
            createdon: 1,
            lastupdated: 1,
        },
        {
            addressId: 2,
            lat: 12.9716,
            lng: 77.5946,
            distance: 2,// in km
            address1: 'string',
            address2: 'string',
            city: 'string',
            state: 'string',
            country: 'string',
            zip: 'string',
            createdon: 1,
            lastupdated: 1,
        }
    ];

    beforeEach(() => {
        mockRequest = {
            tokenData: mockedTokenData
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should fail on finding address', async () => {
        jest.spyOn(consumerDao, 'findOneByPhone').mockResolvedValue(mockedConsumer);
        jest.spyOn(addressDao, 'findOneByQuery').mockResolvedValue(null);
        await locateAgent(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.NOT_FOUND);
        });
    });

    it(`should get agents within: ${process.env.AGENT_LOCATE_DISTANCE}`, async () => {
        jest.spyOn(consumerDao, 'findOneByPhone').mockResolvedValue(mockedConsumer);
        jest.spyOn(addressDao, 'findOneByQuery').mockResolvedValue(mockedConsumerAddress);
        jest.spyOn(addressDao, 'findNearBy').mockResolvedValue(mockAddresses);
        await locateAgent(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(mockAddresses);
        });
    });


});