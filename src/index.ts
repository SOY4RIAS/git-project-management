import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { Routes } from './routes';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as bcryptjs from 'bcryptjs';
import { Users } from './entity/Users';
import { Loader } from './loaders';
import { MODULE_CONF } from '../config/modules';

dotenv.config();

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        route.middleware,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    if (MODULE_CONF.auth) {
      await connection.manager
        .save(
          connection.manager.save(Users, {
            id: 1,
            mail: MODULE_CONF.auth.root.user,
            password: await bcryptjs.hash(MODULE_CONF.auth.root.password, 10),
          })
        )
        .catch(() => console.warn('SOFT_ERROR'));
    }

    await Loader().catch(console.error);

    // setup express app here
    // ...

    // start express server
    const PORT = process.env.APP_PORT || 3000;

    app.listen(PORT);

    console.log(
      `Express server has started on port ${PORT}. Open http://localhost:${PORT}/ to see results`
    );
  })
  .catch((error) => console.log(error));
