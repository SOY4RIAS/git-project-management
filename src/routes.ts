import { ProjectsController } from './controller/ProjectsController';
import { AuthMiddleware } from './middleware/auth';
import { UserService } from './services/UserService';
import { UsersController } from './controller/UsersController';

const middleware = [AuthMiddleware];

export const Routes = [
  {
    method: 'get',
    route: '/projects',
    controller: ProjectsController,
    middleware,
    action: 'all',
  },
  {
    method: 'post',
    route: '/projects',
    controller: ProjectsController,
    middleware,
    action: 'create',
  },
  {
    method: 'post',
    route: '/projects/checkout',
    controller: ProjectsController,
    middleware,
    action: 'checkout',
  },
  {
    method: 'post',
    route: '/login',
    controller: UsersController,
    middleware: [],
    action: 'login',
  },
];
