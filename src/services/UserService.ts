import { getRepository } from 'typeorm';
import { UserModel } from './../typings/models';
import { Users } from '../entity/Users';

export class UserService {
  private userRepository = getRepository(Users);

  findAll() {
    return this.userRepository.find();
  }

  async createOrUpdate(user: UserModel) {
    let userEntity = this.userRepository.create(user);
    userEntity = await this.userRepository.save(userEntity);
    return userEntity;
  }
}
