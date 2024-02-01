import { usersModel } from "./models/users.model.js";
import { logger } from "../../helpers/logger.js";

export class UsersManager {
  constructor() {
    this.model = usersModel;
  }

  //get users
  async getUsers() {
    try {
      const result = await this.model.find().lean();
      return result;
    } catch (error) {
      logger.error(`get users error: ${error.message}`);
      throw new Error(`get users error: ${error.message}`);
    }
  }

  //add user
  async addUser(userInfo) {
    try {
      const result = await this.model.create(userInfo);
      return result;
    } catch (error) {
      logger.error(`add user error: ${error.message}`);
      throw new Error(`add user error: ${error.message}`);
    }
  }

  //get user by ID
  async getUserById(id) {
    try {
      const result = await this.model.findById(id);
      return result;
    } catch (error) {
      logger.error(`get user by ID error: ${error.message}`);
      throw new Error(`get user by ID error: ${error.message}`);
    }
  }

  //get user by email
  async getUserByEmail(email) {
    try {
      const result = await this.model.findOne({ email: email }).lean();
      return result;
    } catch (error) {
      logger.error(`get user by email error: ${error.message}`);
      throw new Error(`get user by email error: ${error.message}`);
    }
  }

  //update user
  async updateUser(id, user) {
    try {
      const result = await this.model.findByIdAndUpdate(id, user, {
        new: true,
      });
      return result;
    } catch (error) {
      logger.error(`update user error: ${error.message}`);
      throw new Error(`update user error: ${error.message}`);
    }
  }

  //delete user
  async deleteUser(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result;
    } catch (error) {
      logger.error(`delete user error: ${error.message}`);
      throw new Error(`delete user error: ${error.message}`);
    }
  }
}
