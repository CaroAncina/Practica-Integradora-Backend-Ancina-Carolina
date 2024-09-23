import usersModel from "../models/usersModel.js";

class UserMongoDAO {
  async findById(uid) {
    try {
      return await usersModel.findById(uid);
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await usersModel.findOne({ email });
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  async findAll() {
    return await usersModel.find(
      {},
      { first_name: 1, last_name: 1, email: 1, role: 1 }
    );
  }

  async create(userData) {
    try {
      const newUser = new usersModel(userData);
      return await newUser.save();
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async update(uid, updatedUser) {
    try {
      return await usersModel.findByIdAndUpdate(uid, updatedUser, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async delete(uid) {
    try {
      return await usersModel.findByIdAndDelete(uid);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  async findInactiveSince(cutoffDate) {
    try {
      return await usersModel.find({ last_connection: { $lt: cutoffDate } });
    } catch (error) {
      throw new Error(`Error al buscar usuarios inactivos: ${error.message}`);
    }
  }
}

export default new UserMongoDAO();
