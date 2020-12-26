import { Request } from 'express';
import { ProjectModel } from './models';

export interface CheckoutProjectRequest extends Request {
  body: {
    projectName: string;
    branchId: string;
  };
}

export interface CreateProjectRequest extends Request {
  body: {
    project: ProjectModel;
  };
}

export interface LoginRequest extends Request {
  body: {
    mail: string;
    password: string;
  };
}
