import { usersDao } from "../dao/index.js";

export class UsersService {
  //get users
  static getUsers = () => {
    return usersDao.getUsers();
  };
  //add user
  static addUser = (userInfo) => {
    return usersDao.addUser(userInfo);
  };
  //get user by ID
  static getUserById = (id) => {
    return usersDao.getUserById(id);
  };
  //get user by email
  static getUserByEmail = (email) => {
    return usersDao.getUserByEmail(email);
  };
  //update user
  static updateUser = (id, user) => {
    return usersDao.updateUser(id, user);
  };
  //delete user
  static deleteUser = (id) => {
    return usersDao.deleteUser(id);
  };
}
