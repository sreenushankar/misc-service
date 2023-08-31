import 'express-async-errors';
import 'reflect-metadata';
import * as express from 'express';
import 'express-async-errors';
import * as winston from 'winston';
import { router } from './routes/routes.js'
import { LoggerFactory, errorHandlerMiddleware, Constants } from 'wallet-common-lib';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { dbConnInit, dbInitCache } from 'wallet-db-lib';

/**
 * Main class for application which is going to run as a server
 */
class App {
    private port = process.env.PORT ? process.env.PORT : 8080;
    private logger: winston.Logger = LoggerFactory.create(App.name);

    public async run(): Promise<void> {
        const start = Date.now();
        const app: express.Application = express()
        app.disable('x-powered-by'); // sonar does not recognize the constants for this
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        const file = fs.readFileSync(__dirname + '/../swagger.yaml', 'utf8')
        const swaggerDocument = YAML.parse(file)

        // set up openapi doc
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
            explorer: false,
            swaggerOptions: {
                docExpansion: 'list'
            }
        }));

        app.use('/health', (req, res) => {
            res.status(200).send(Constants.SUCCESS);
        });

        app.use('/misc/api/v1', router);
        app.use(errorHandlerMiddleware);

        await dbConnInit();
        await dbInitCache();

        // start the server
        app.listen(this.port, () => {
            this.logger.info(`App listens on port ${this.port}`);
            const duration = Date.now() - start;
            this.logger.debug(`Server startup time: ${duration}`);
        });
    }

}

process.on('unhandledRejection', (error: Error) => {
    LoggerFactory.create(App.name).error('Unhandled rejection: ' + (error.stack ? error.stack : error));
});

process.on('uncaughtException', (error: Error) => {
    LoggerFactory.create(App.name).error('uncaughtException: ' + (error.stack ? error.stack : error));
});

const appSrv = new App();

// start client application
appSrv.run();

