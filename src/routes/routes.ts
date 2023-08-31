import { Router } from 'express';
import { authenticateJWT, requestValidator, Scope } from 'wallet-common-lib';
import * as appConfigController from '../controllers/appConfigController.js';
import { validationSchemas } from '../controllers/validationSchema.js';
import * as identity from '../controllers/idTypeController.js';
import * as consumer from '../controllers/consumerTypeController.js';
import * as miscController from '../controllers/miscController.js'
import * as locateAgentController from '../controllers/locateAgentController.js';
import * as notificationController from '../controllers/notificationController.js';

const router = Router();
export {router};

// get config API
router.route('/config').get(authenticateJWT(Scope.ONBOARDING),
    requestValidator(validationSchemas.appConfig),
    appConfigController.getConfig);

// get identity API
router.get('/identity', authenticateJWT(Scope.ONBOARDING), identity.getIdentityTypes);
router.get('/consumer', authenticateJWT(Scope.ONBOARDING), consumer.getConsumerTypes);
// get industry types API
router.route('/industry').get(authenticateJWT(Scope.ONBOARDING), miscController.getIndustryTypes);
// get income types API
router.route('/income').get(authenticateJWT(Scope.ONBOARDING), miscController.getIncomeTypes);
// get business types API
router.route('/business').get(authenticateJWT(Scope.ONBOARDING), miscController.getBusinessTypes);
// locate agent API
router.route('/nearbyagents').get(
    authenticateJWT(Scope.TRANSACTION),
    requestValidator(validationSchemas.locateAgent), locateAgentController.locateAgent);
// Notification APIs
router.route('/notification/register').post(authenticateJWT(Scope.TRANSACTION), notificationController.register);
router.route('/notification/unregister').delete(authenticateJWT(Scope.TRANSACTION), notificationController.unregister);
