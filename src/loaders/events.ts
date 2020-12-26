import path from 'path';
import requireAll from 'require-all';

export const EventsLoader = () => {
  requireAll({
    dirname: path.resolve(__dirname, '../events/subscribers'),
    filter: /^(.+\.subscriber)\.(ts|js)$/,
  });
};
