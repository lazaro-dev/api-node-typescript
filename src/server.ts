import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import * as database from '@src/database';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';
import logger from './logger';
import * as http from 'http';
import cors from 'cors';
import expressPino from 'express-pino-logger';
import apiSchema from './api.schema.json';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

export class SetupServer extends Server {
  private server?: http.Server;
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.docsSetup();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(expressPino({
      logger,
    }));
    this.app.use(cors({ //origin...travar o dominio para impedir clonagem de pagina para realizar requisição
      origin: '*'
    }));
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([forecastController, beachesController, usersController]);
  }

  private async docsSetup(): Promise<void> {
     this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
     this.app.use( OpenApiValidator.middleware({
       apiSpec: apiSchema as OpenAPIV3.Document,
       validateRequests: true,
       validateResponses: true,
     }));
  }

  public getApp(): Application {
    return this.app;
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info('Server listening of port: ', this.port);
    })
  }

}
