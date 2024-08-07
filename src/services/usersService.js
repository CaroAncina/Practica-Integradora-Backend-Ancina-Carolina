import UserMongoDAO from "../dao/classes/users.dao.js";
import CartMongoDAO from "../dao/classes/carts.dao.js";
import { createHash } from "../utils/utils.js";
import logger from "../utils/logger.js";

class UserService {
  static async createUser(userData) {
    try {
      const existingUser = await UserMongoDAO.findByEmail(userData.email);
      if (existingUser) {
        logger.warn(
          `Intento de crear usuario con email ya en uso: ${userData.email}`
        );
        throw new Error("El correo electrónico ya está en uso");
      }
      userData.password = createHash(userData.password);

      if (userData.email === "acoderhouse@gmail.com") {
        userData.role = "admin";
      } else {
        userData.role = "user";
        const newCart = await CartMongoDAO.create({ products: [] });
        userData.cart = newCart._id;
      }

      const result = await UserMongoDAO.create(userData);
      logger.info(`Usuario creado con éxito: ${result.email}`);
      return result;
    } catch (error) {
      logger.error(`Error al crear usuario: ${error.message}`, {
        stack: error.stack,
      });
      throw new Error("Error al crear usuario");
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await UserMongoDAO.findByEmail(email);
      if (!user) {
        logger.warn(`Usuario con email ${email} no encontrado`);
      } else {
        logger.info(`Usuario con email ${email} obtenido con éxito`);
      }
      return user;
    } catch (error) {
      logger.error(`Error al obtener usuario por email: ${error.message}`, {
        stack: error.stack,
      });
      throw new Error("Error al obtener usuario por email");
    }
  }

  static async getAllUsers() {
    try {
      const users = await UserMongoDAO.findAll();
      logger.info("Todos los usuarios obtenidos con éxito");
      return users;
    } catch (error) {
      logger.error(`Error al obtener todos los usuarios: ${error.message}`, {
        stack: error.stack,
      });
      throw new Error("Error al obtener todos los usuarios");
    }
  }

  static async updateUser(uid, updatedUser) {
    try {
      if (updatedUser.password) {
        updatedUser.password = createHash(updatedUser.password);
      }
      const updated = await UserMongoDAO.update(uid, updatedUser);
      if (!updated) {
        logger.warn(`Usuario con id ${uid} no encontrado para actualizar`);
        throw new Error("Usuario no encontrado para actualizar");
      }
      logger.info(`Usuario con id ${uid} actualizado con éxito`);
      return updated;
    } catch (error) {
      logger.error(`Error al actualizar usuario: ${error.message}`, {
        stack: error.stack,
      });
      throw new Error("Error al actualizar usuario");
    }
  }

  static async deleteUser(uid) {
    try {
      const deleted = await UserMongoDAO.delete(uid);
      if (!deleted) {
        logger.warn(`Usuario con id ${uid} no encontrado para eliminar`);
        throw new Error("Usuario no encontrado para eliminar");
      }
      logger.info(`Usuario con id ${uid} eliminado con éxito`);
      return deleted;
    } catch (error) {
      logger.error(`Error al eliminar usuario: ${error.message}`, {
        stack: error.stack,
      });
      throw new Error("Error al eliminar usuario");
    }
  }
}

export default UserService;
