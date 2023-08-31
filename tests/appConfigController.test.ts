import { Request, Response } from 'express';
import { AppError, Constants, HttpCode } from 'wallet-common-lib'
import { appConfigDao } from 'wallet-db-lib'
import { getConfig } from '../src/controllers/appConfigController.js'

describe('appConfigController Testing', () => {
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>

    const error: AppError = new AppError(Constants.FAILURE, Constants.ERROR_IN_PROCESSING, HttpCode.INTERNAL_SERVER_ERROR)
    const appConfig: any = {
        name: 'terms',
        value: 'http://testing.com/terms'
    }

    beforeEach(() => {
        mockRequest = {}
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    })
    
    describe('get config API Test Cases', () => {
        beforeAll(() => {
            jest.spyOn(appConfigDao, 'findOneByName')
            .mockResolvedValueOnce(appConfig)
            .mockResolvedValueOnce(null)
            .mockRejectedValue(error)
        })
        afterAll(() => {
            jest.clearAllMocks()
        })

        it('should return configuration name and value if name is present in appConfig table', async () => {
            mockRequest.query = {
                configName: 'terms'
            }
            await getConfig(mockRequest as Request, mockResponse as Response)

            // Assert that the response status and json methods were called
            expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.OK)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: appConfig.name,
                    value: appConfig.value
                })
            )
        });

        it('should return config name only if it is not present in appConfig table', async () => {
            const configName = 'test';
            mockRequest.query = {
                configName: configName
            }

            await getConfig(mockRequest as Request, mockResponse as Response)

            // Assert that the response status and json methods were called
            expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.OK)
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: configName
                })
            )
        });

        it('should throw error when appConfig response is not received', async () => {
            mockRequest.query = {}
            await expect(
                getConfig(mockRequest as Request, mockResponse as Response)
            ).rejects.toThrow(error);
        });
    });
});