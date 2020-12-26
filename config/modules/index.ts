import fs from 'fs-extra';
import path from 'path'
import YAML from 'yaml';
import { MODULE_LIST } from './constants';
import { ModuleConf } from './typings';

export const MODULE_CONF:ModuleConf = {};

for (const module of MODULE_LIST) {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, `./${module}.yml`)).toString('utf-8');
    const document = YAML.parse(data);

    (MODULE_CONF as any)[module] = document;
    console.log(document)
    
  } catch (error) {
    console.info(`${module}.yml not found`)
  }
}

