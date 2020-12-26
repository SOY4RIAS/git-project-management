import { events } from '../events';
import { EventSubscriber, On } from 'event-dispatch';
import { exec } from 'child_process';
import { getRepository } from 'typeorm';
import { Projects } from './../../entity/Projects';
import { ProjectService } from './../../services/ProjectServices';

@EventSubscriber()
export class ProjectSubscriber {
  private projectService = new ProjectService();

  @On(events.projects.checkout)
  public onCheckout(project: Projects) {
    const commands = [`cd ${project.path}`, `${project.setupCommand}`];

    project.lastSetupDate = new Date();

    console.log(
      events.projects.checkout,
      'event started',
      new Date().toISOString()
    );

    exec(commands.join(' && '), (err, stdout, stderr) => {
      let logMessage = 'Executed With Problem ID:';

      if (err) {
        project.lastInstallationStatus = false;
        project.setupErrorDetails = stderr;
      } else {
        console.log(stdout.split('\n'), 'EVENT LOG');
        logMessage = 'Executed Successfully ID:';
        project.lastInstallationStatus = true;
        project.setupErrorDetails = '';
      }

      console.log(events.projects.checkout, logMessage, project.id);

      this.projectService
        .createOrUpdate(project)
        .then((res) => {
          console.log(
            events.projects.checkout,
            'event finished',
            new Date().toISOString()
          );
        })
        .catch((err) => {
          console.log(
            events.projects.checkout,
            'with errors',
            new Date().toISOString()
          );
          console.log(err);
        });
    });
  }
}
