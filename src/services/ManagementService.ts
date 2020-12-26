import { getRepository } from 'typeorm';
import { Projects } from '../entity/Projects';
import { exec } from 'child_process';
import { EventDispatcher } from 'event-dispatch';
import { events } from './../events';

export class ManagementService {
  private projectRepository = getRepository(Projects);
  private eventDispatcher = new EventDispatcher();

  private environmentBranches = new Set([
    'master',
    'develop',
    'developer',
    'QA',
  ]);

  public async checkout(projectName: string, branchId: string) {
    const project = await this.projectRepository.findOneOrFail({
      where: { name: projectName },
    });

    if (this.environmentBranches.has(branchId)) {
      return { err: 'NOT_ALLOWED' };
    }
    const branch = await this.checkBranch(project.path, branchId);

    return this.setBranch(project.path, branch, () => {
      project.currentBranch = branch.replace('origin/', '');
      this.eventDispatcher.dispatch(events.projects.checkout, project);
    });
  }

  private checkBranch(
    path: string,
    branchId: string,
    remote = true
  ): Promise<string> {
    const GO_TO_PATH_AND_CHECK = `cd ${path} && git fetch && git branch ${
      remote ? '-r' : ''
    } | grep ${branchId}`;

    return new Promise<string>((resolve, reject) => {
      exec(GO_TO_PATH_AND_CHECK, (err, stdout, stderr) => {
        if (err) reject({ err, stderr: stderr.split('\n') });

        if (!Boolean(stdout)) reject({ err: 'NOT_FOUND' });

        const [branch] = stdout.split('\n');

        resolve(branch.trim());
      });
    });
  }

  private async setBranch(
    path: string,
    remoteBranch: string,
    event: CallableFunction
  ) {
    const branch = remoteBranch.replace('origin/', '');
    let deleteBranch: boolean;

    try {
      const branchInSystem = await this.checkBranch(path, branch, false);
      deleteBranch = Boolean(branchInSystem);
    } catch (error) {
      deleteBranch = false;
    }

    const deleteCommand = `git branch -D ${branch}`;

    const GO_TO_PATH_AND_SET = [
      `cd ${path}`,
      `git checkout master -f`,
      `${
        deleteBranch ? deleteCommand + ' &&' : ''
      } git checkout -t ${remoteBranch}`,
      `git pull --rebase`,
      `git branch`,
    ];

    return new Promise((resolve, reject) => {
      exec(GO_TO_PATH_AND_SET.join(' && '), (err, stdout, stderr) => {
        if (err) {
          return reject({ err, stderr: stderr.split('\n') });
        }

        const output = stdout.split('\n');

        if (event) {
          event();
        }

        resolve({ output });
      });
    });
  }

  private getCurrentBranch(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(
        `cd ${path} && git rev-parse --abbrev-ref HEAD`,
        (err, stdout, stderr) => {
          if (err) return reject({ err, stderr: stderr.split('\n') });

          resolve(stdout.trim().replace('\n', ''));
        }
      );
    });
  }
}
