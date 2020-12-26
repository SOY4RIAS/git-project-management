import { getRepository } from 'typeorm';
import { Projects } from '../entity/Projects';
import { ProjectModel } from './../typings/models';

export class ProjectService {
  private projectRepository = getRepository(Projects);

  async createOrUpdate(project: ProjectModel) {
    let projectEntity = this.projectRepository.create(project);

    projectEntity = await this.projectRepository.save(projectEntity);

    return projectEntity;
  }

  findAll() {
    return this.projectRepository.find();
  }
}
