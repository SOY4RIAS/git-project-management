export interface ProjectModel {
  id: number;
  name: string;
  path: string;
  currentBranch: string;
  url: string;
}

export interface UserModel {
  id?: number;
  mail: string;
  password: string;
}
