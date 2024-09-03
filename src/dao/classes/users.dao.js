import usersModel from "../models/usersModel.js";

class UserMongoDAO {
  async findById(uid) {
    return await usersModel.findById(uid);
  }

  async findByEmail(email) {
    return await usersModel.findOne({ email });
  }

  async findAll() {
    return await usersModel.find();
  }

  async create(userData) {
    const newUser = new usersModel(userData);
    return await newUser.save();
  }

  async update(uid, updatedUser) {
    return await usersModel.findByIdAndUpdate(uid, updatedUser, { new: true });
  }

  async delete(uid) {
    return await usersModel.findByIdAndDelete(uid);
  }
}

export default new UserMongoDAO();
