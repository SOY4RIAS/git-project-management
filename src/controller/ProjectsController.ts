import { NextFunction, Request, Response } from 'express';

import { ProjectService } from '../services/ProjectServices';

import {
  CheckoutProjectRequest,
  CreateProjectRequest,
} from './../typings/RequestsInterfaces';
import * as http from '../constants/http';
import { ManagementService } from '../services/ManagementService';

export class ProjectsController {
  private projectService = new ProjectService();
  private managementService = new ManagementService();

  async all(_: Request, res: Response) {
    try {
      return this.projectService.findAll();
    } catch (err) {
      return res.status(http.INTERNAL_SERVER_ERROR).json({ err });
    }
  }

  checkout(req: CheckoutProjectRequest, res: Response) {
    const { projectName, branchId } = req.body;

    this.managementService
      .checkout(projectName, branchId)
      .then((result) => res.json({ result }))
      .catch((err) => {
        res.status(http.INTERNAL_SERVER_ERROR).json({ err });
      });
  }

  create(req: CreateProjectRequest, res: Response) {
    const { project } = req.body;

    this.projectService
      .createOrUpdate(project)
      .then((result) => res.json({ result }))
      .catch((err) => {
        res.status(http.INTERNAL_SERVER_ERROR).json({ err });
      });
  }
}
