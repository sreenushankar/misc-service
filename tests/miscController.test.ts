// test cases for ../src/controllers/misc.ts using jest
import { Request, Response } from 'express';
import { getIncomeTypes, getIndustryTypes, getBusinessTypes } from '../src/controllers/miscController.js';


// jest.mock('../src/controllers/misc');


describe('Test misc.ts', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should verify 200 status code', async () => {
        const response = await getIncomeTypes(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should verify 200 status code', async () => {
        const response = await getIndustryTypes(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should verify 200 status code', async () => {
        const response = await getBusinessTypes(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalled();
    });

});


