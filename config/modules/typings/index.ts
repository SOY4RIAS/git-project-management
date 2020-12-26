export interface AuthModule {
  root: {
    user: string;
    password: string;
  }
}

export interface ModuleConf {
  auth?: AuthModule;
}