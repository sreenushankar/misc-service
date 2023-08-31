import { Request, Response } from 'express';
import { HttpCode } from 'wallet-common-lib';
import { ConsumerType, consumerTypeDao } from 'wallet-db-lib';
import { getConsumerTypes } from '../src/controllers/consumerTypeController.js';

// Mock the logger methods
jest.mock('winston', () => ({
    Logger: jest.fn().mockReturnValue({
        info: jest.fn(),
        error: jest.fn(),
    }),
}));

describe('ConsumerDetailsController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('getConsumerDet', () => {
        it('should return consumer details', async () => {
            // Mock the consumerTypeDao.findAll() method
            const mockConsumerData = [
                {
                    'code': '1',
                    'description': 'Consumer'
                },
                {
                    'code': '2',
                    'description': 'Agent'
                },
                {
                    'code': '3',
                    'description': 'Merchant'
                }
            ];
            jest.spyOn(consumerTypeDao, 'findAll').mockResolvedValue(ConsumerType.findAll());

            const result = await getConsumerTypes(mockRequest as Request, mockResponse as Response);
            // Assert that the response status and json methods were called
            expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.OK);
        });

        it('should return INTERNAL_SERVER_ERROR when an error occurs', async () => {
            // Mock the consumerTypeDao.findAll() method to throw an error
            jest.spyOn(consumerTypeDao, 'findAll').mockRejectedValue(new Error('Database error'));
            try {
                await getConsumerTypes(mockRequest as Request, mockResponse as Response);
            } catch (error) {
                // Assert that the response status and json methods were called with the error response
                expect(error.message).toBe('Database error');
            }
        });
    });
});
