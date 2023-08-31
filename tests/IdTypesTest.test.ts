import { Request, Response } from 'express';
import { HttpCode } from 'wallet-common-lib';
import { IdentityType, identityTypeDao } from 'wallet-db-lib';
import { getIdentityTypes } from '../src/controllers/idTypeController.js';

// Mock the logger methods
jest.mock('winston', () => ({
    Logger: jest.fn().mockReturnValue({
        info: jest.fn(),
        error: jest.fn(),
    }),
}));

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;

beforeEach(() => {
    mockRequest = {};
    mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
    };
});

describe('IdentityDetailsController', () => {

    it('should return Identity details', async () => {
        // Mock the IdentityTypeDao.findAll() method
        const mockIdentityData = [
            {
                'code': '1',
                'description': 'Smart Card ID'
            },
            {
                'code': '2',
                'description': 'Green ID Book'
            }
        ]
        jest.spyOn(identityTypeDao, 'findAll').mockResolvedValue(IdentityType.findAll());

        await getIdentityTypes(mockRequest as Request, mockResponse as Response);

        // Assert that the response status and json methods were called
        expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.OK);
    });

    it('should return error', async () => {
        // Mock the IdentityTypeDao.findAll() method to throw an error
        jest.spyOn(identityTypeDao, 'findAll').mockRejectedValue(new Error('Database error'));

        try {
            await getIdentityTypes(mockRequest as Request, mockResponse as Response);
        } catch (error) {
            // Assert that the response status and json methods were called with the error response
            expect(error.message).toBe('Database error');
        }
    });

});
